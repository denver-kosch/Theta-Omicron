import { Member, Location } from "../mongoDB/models.js";
import { startSession } from "mongoose";
import { abbrSt } from "../functions.js";
import { ApiError, extractToken } from "../functions.js";
import { existsSync, promises } from 'fs';
import { join, extname } from 'path';
import sharp from 'sharp';
import { dirname } from "../config.js";
import { hashPassword } from "./authentication.js";


export const addMember = async (req) => {
  const {email, fName:firstName, lName:lastName, status, phone, street, city, state, zip, country, initiation, graduation, school, ritualCerts:r} = req.body;
  const password = await hashPassword(req.body.password);
  const address = {street, city, state, zip, country: country ?? "USA"};
  const contactInfo = {email, phone, schoolEmail: school};
  const member = await Member.create({
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
      const _id = extractToken(req);
      if (!_id) throw new ApiError(401, 'Unauthorized');
      
      const {name, description, start, end, visibility, newLocName, newLocAddress} = req.body;
      const committee = JSON.parse(req.body.committee);
      if (start > end) throw Error('Start time cannot be after end time');
      const time = {start, end};
      
      let location = JSON.parse(req.body.location);
      
      if (location === '0') {
      if (!/^\d+[A-Za-z\s]+\,[A-Za-z\s]+\, [A-Z]{2} \d{5}$/.test(newLocAddress)) throw Error("Address not in address format")
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
        if (!existsSync(folderPath)) await promises.mkdir(folderPath, { recursive: true });
        const uploadPath = join(folderPath, `${event._id.toString()}${extname(req.file.originalname)}`);
        await sharp(req.file.buffer).jpeg({ quality: 90 }).toFile(uploadPath);
      } else {
        const placeholderImagePath = join(dirname, 'public','images','events', 'default.jpg');
        const uploadPath = join(folderPath, `${event._id.toString()}.jpg`);
        await promises.copyFile(placeholderImagePath, uploadPath);
      }

      await session.commitTransaction();
      return {status: 201, content: {newId: event._id}};
  } catch (err) {
      await session.abortTransaction();
      throw new ApiError(400, err.message);
  } finally {session.endSession();}
};