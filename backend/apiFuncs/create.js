import { Member, Location, Event, Minutes} from "../mongoDB/models.js";
import { startSession } from "mongoose";
import { abbrSt } from "../functions.js";
import { ApiError } from "../functions.js";
import { existsSync, promises as fs } from 'fs';
import { join, extname } from 'path';
import { ObjectId } from "mongodb";
import sharp from 'sharp';
import { dirname } from "../config.js";
import { hashPassword, extractToken } from "./authentication.js";
import { exec } from 'child_process';
import { updateAttendance } from "./update.js";
import pdf from 'pdf-parse-new';


export const addMember = async (req) => {
  const {email, fName:firstName, lName:lastName, status, phone, street, city, state, zip, country, initiation, graduation, school, ritualCerts:r} = req.body;
  const password = await hashPassword(req.body.password);
  const address = {street, city, state, zip, country: country ?? "USA"};
  const contactInfo = {email, phone, schoolEmail: school};
  await Member.create({
    firstName, lastName, contactInfo, password, address, 
    initiationYear: initiation, graduationYear: graduation, 
    ritualCerts: r ?? 0, status: status ?? "Pledge"
  }).catch(error => {throw new ApiError(400, error.message)});
  return {status: 201};
};
  
export const addEvent = async (req) => {
  const session = await startSession();
  try {
      session.startTransaction();
      const {_id} = extractToken(req);
      if (!_id) throw new ApiError(401, 'Unauthorized');
      
      const {name, description, start, end, visibility, newLocName, newLocAddress} = req.body;
      const committee = JSON.parse(req.body.committee);
      if (start > end) throw Error('Start time cannot be after end time');
      const time = {start, end};
      
      let location = JSON.parse(req.body.location);
      console.log(req.body);
      if (location === '0') {
        if (!/^(\d+)?[A-Za-z\s]+\,[A-Za-z\s]+\, [A-Z]{2} \d{5}$/.test(newLocAddress)) throw Error("Address not in address format")
        const [address, city, sz] = newLocAddress.split(', ');
        const [s, zip] = sz.split(' ');
        const state = abbrSt(s);
        location = (await Location.create({ address, city, state, zip, name: newLocName }));
      }

      const event = (await Event.create([{
          name, 
          description, 
          time,
          committee: {id: new ObjectId(String(committee._id)), name: committee.name}, 
          location: {id: new ObjectId(String(location._id)), name: location.name}, 
          visibility
      }], {session}))[0];
      
      if (req.file) {
        const folderPath = join(dirname, 'public','images','events');
        if (!existsSync(folderPath)) await fs.mkdir(folderPath, { recursive: true });
        const uploadPath = join(folderPath, `${event._id.toString()}${extname(req.file.originalname)}`);
        await sharp(req.file.buffer).jpeg({ quality: 90 }).toFile(uploadPath);
      } else {
        const placeholderImagePath = join(dirname, 'public','images','events', 'default.jpg');
        const uploadPath = join(folderPath, `${event._id.toString()}.jpg`);
        await fs.copyFile(placeholderImagePath, uploadPath);
      }
      await session.commitTransaction();
      return {status: 201, content: {newId: event._id}};
  } catch (err) {
      await session.abortTransaction();
      throw new ApiError(400, err.message);
  } finally {session.endSession()}
};

export const uploadMinutes = async (req) => {
  try {
    const { _id } = extractToken(req);
    if (!req.file) throw new ApiError(400, 'No file uploaded');
    const { date, type } = req.body;

    const baseName = `${date}_${type}`;
    const outputDir = join(dirname, 'secure', 'documents', 'minutes');
    const outputPdfPath = join(outputDir, `${baseName}.pdf`);

    if (!existsSync(outputDir)) await fs.mkdir(outputDir, { recursive: true });

    const fileExt = extname(req.file.originalname).toLowerCase();
    if (!['.pdf', '.docx', '.doc', '.odt'].includes(fileExt)) throw new ApiError(400, 'Invalid file type. Only PDF, DOCX, DOC, and ODT files are allowed.');

    if (fileExt === '.pdf') await fs.writeFile(outputPdfPath, req.file.buffer);
    else {
      const tempInputPath = join(outputDir, `${baseName}${fileExt}`);
      await fs.writeFile(tempInputPath, req.file.buffer);
      await new Promise((resolve, reject) => {
        const libreOfficeCmd = '/Applications/LibreOffice.app/Contents/MacOS/soffice';
        const command = `${libreOfficeCmd} --headless --convert-to pdf "${tempInputPath}" --outdir "${outputDir}"`;
        exec(command, (err) => {
          if (err) return reject(new ApiError(500, 'Failed to convert document to PDF'));
          resolve();
        });
      });
      await fs.unlink(tempInputPath);
    }

    const newPdfBuffer = await fs.readFile(outputPdfPath);
    const parsedData = (await pdf(newPdfBuffer)).text;

    const match = parsedData.match(/Brothers Unexcused included:\s*[:\-]?\s*(.*)/i);
    let unexcused = [];

    if (match && match[1]) unexcused = match[1].split(';').map(n => n.trim()).filter(n => n.length > 0);

    console.log("Unexcused brothers:", unexcused);
    await updateAttendance(unexcused);

    await Minutes.create({ date, type, filePath: `${baseName}.pdf`, uploadedBy: _id });
    return { status: 201, path: `${baseName}.pdf` };
  } catch (err) {
    throw new ApiError(500, err.message);
  }
};