import dotenv from 'dotenv';
import sharp from 'sharp';
import bcrypt from 'bcrypt';
import multer from 'multer';
import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import { appendImgPath, extractToken, abbrSt } from './functions.js';
import { check } from 'express-validator';
import { Event, Member, Location, Committee } from './mongoDB/models.js';
import { startSession } from 'mongoose';

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Storing files in memory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokenSecret = process.env.SESSION_SECRET;

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
};

// Utility function to send JSON responses
const sendJsonResponse = (res, status, content = {}) => {
    content.success = (status >= 200 && status < 300) ? true : false;
    res.status(status).json(content);
};

const handleError = (error,res) => {
  console.error(error); // Log the error for server-side debugging
  if (error instanceof ApiError) sendJsonResponse(res, error.status, { error: error.message });
  else sendJsonResponse(res, 500, { error: 'Internal Server Error' });
};
// Async middleware handler to avoid repeating try-catch
export const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next, res))
  .then(({status, content = {}}) => sendJsonResponse(res, status, content))
  .catch(error => handleError(error, res));


/* ================== Login / Authorization ================== */

export const login = async (req) => {
  const { email, password } = req.body;
  const member = await Member.findOne({'contactInfo.email': email}, '_id password');
  if (member && await bcrypt.compare(password, member.password)) {
    const token = jwt.sign({ memberId: member._id }, tokenSecret, { expiresIn: '1h' });
    return {status:200, content: {token}, token};
  } else throw new ApiError(401, {error: 'Invalid email or password' });
};

export const auth = async (req) => {
  try {
  let token = req.headers.authorization.split(" ")[1];
  if (!token) throw new ApiError(401, 'No token provided');
  const payload = jwt.verify(token, tokenSecret);
  const timeLeft = payload.exp - Math.floor(Date.now() / 1000);
  if (timeLeft < 10 * 60) token = jwt.sign({memberId: payload.memberId}, tokenSecret, {expiresIn: '1h'});
  return {status:200, content: {token}, token};
  } catch (error) {
    throw new ApiError(401, {error: error.message});
  }
};

/* ================== Create ================== */
export const addMember = async (req) => {
  const {email, fName, lName, status, phone, street, city, state, zip, country, initiation, graduation, school, ritualCerts:r} = req.body;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const address = {street, city, state, zip, country: country ?? "USA"};
  const contactInfo = {email, phone, schoolEmail: school};
  const member = await Member.create({
    firstName: fName, 
    lastName: lName, 
    contactInfo, 
    password: hashedPassword, 
    address, 
    initiationYear: initiation, 
    graduationYear: graduation, 
    ritualCerts: r ?? 0, 
    status: status ?? "Pledge"
  });
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
      location = (await Location.create({ address, city, state, zip, name: newLocName }))._id.toString();
    }
    
    const event = (await Event.create([
      {
        name, 
        description, 
        time,
        committee: {id: new ObjectId(String(committee._id)), name: committee.name}, 
        location: {id: new ObjectId(String(location._id)), name: location.name}, 
        visibility
      }], {session}))[0];
    
    console.log(178);
    if (req.file) {
      const folderPath = path.join(__dirname, 'public','images','events');
      if (!fs.existsSync(folderPath)) await fs.promises.mkdir(folderPath, { recursive: true });
      const uploadPath = path.join(folderPath, `${event._id.toString()}${path.extname(req.file.originalname)}`);

      await sharp(req.file.buffer).jpeg({ quality: 90 }).toFile(uploadPath);
    } else {
      const placeholderImagePath = path.join(__dirname, 'public','images','placeholder.jpg');
      const uploadPath = path.join(folderPath, `${event._id.toString()}.jpg`);
      await fs.promises.copyFile(placeholderImagePath, uploadPath);
    }

    await session.commitTransaction();
    return {status: 201, content: {newId: event._id}};
  } catch (err) {
    await session.abortTransaction();
    throw new ApiError(400, err.message);
  }
  finally {session.endSession();}
};


/* ================== Read ================== */
export const getCommittee = async (req) => {
  const { name, _id, emails, pics } = req.body;
  
  const projections = {firstName: 1, lastName: 1, position: "$positions"};
  if (emails) projections["contactInfo.schoolEmail"] = 1;
  
  const committee = name ? await Committee.findOne({name}, {supervisingOfficer: 1, members: 1}) : await Committee.findOne({_id}, {supervisingOfficer: 1, members: 1});
  
  let members = await Member.aggregate([
    { $match: { _id: {$in: [...committee.members, committee.supervisingOfficer]}} },
    { $unwind: "$positions" },  // Flatten the positions array
    { $match: { $or: [{"positions.committeeId": committee._id}, {'positions.committeeName': "Executive Committee"}] } },
    { $project: projections }
  ]);

  if (pics) members = members.map(doc => appendImgPath(doc, __dirname, 'profilePics'));

  if (members.length > 0) return {status:200, content: {members}, members};
  else throw new ApiError(404, "Committee not found");
};

export const getBros = async () => {
  const bros = (await Member.find({status: "Initiate"}, {firstName: 1,lastName: 1,positions: 1 }).sort({lastName: 1, firstName: 1}))
    .map(doc => appendImgPath(doc.toJSON(), __dirname, 'profilePics')).map(d => {
      const arr = [];
      d.positions.forEach(p => {
        if (p.committeeName === "Executive Committee") arr.push(p.role)
        else if (p.role === "Chairman") arr.push(`${p.committeeName.split(" ")[0]} Chairman`);
        else arr.push(p.committeeName);
      });

      return {
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        imageUrl: d.imageUrl,
        positions: arr
      }
    });
    if (bros) return {status: 200, content: {bros}, bros};
    else throw new ApiError(404, "Brothers not found");
};

export const getBro = async (req) => {
  const _id = extractToken(req);
  const brother = await Member.findById(_id, 'status lastName positions');
  return {status: 200, content: {info: brother}};
};

export const getEvents = async (req) => {
  const { vis, days, mandatory, status } = req.body;
  const query = [];
  if (vis) query.push({visibility: vis});
  if (days) query.push({ "time.start": { $gte: new Date(), $lte: new Date(new Date().setDate(new Date().getDate() + days)) }});
  if (typeof mandatory == 'boolean') query.push({mandatory});
  if (status) query.push({status});

  const events = await Event.find((query.length > 0) ? {$and: query} : {}, { name: 1, description: 1, time: 1, location: "$location.name" });

  for (let i=0; i<events.length; i++) events[i] = appendImgPath(events[i].toJSON(), __dirname, 'events');

  if (events) return {status:200, content: { events }, events};
  else throw new ApiError(404, "Events not found");
};

export const getCommittees = async (req) => {
  // Will return false if invalid id or no id provided
  _id = extractToken(req);
  const committees = await Committee.find(_id ? {members: {$in: _id}}: {});

  if (committees) return {status: 200, content: { committees: committees }};
  else throw ApiError(404, "Committees not found");
};

export const getLocations = async () => {
  const locations = await Location.find({});
  if (locations) return {status:200, content: { locations: locations }, locations};
  else throw Error("Locations not found");
};

export const getEventCreation = async (req) => {
  const _id = extractToken(req);
  const committees = await Committee.find({members: {$in: [_id]}}, {name: 1});
  const officer = await Committee.find({supervisingOfficer: _id}, {name: 1});
  const locations = await Location.find({});
  if (committees && locations) return {status:200, content: { committees: {member: committees, officer}, locations }};
  else throw ApiError(401, "Committees or Locations not found");
};

export const getEventDetails = async (req) => {
  const token = extractToken(req);
  let event = (await Event.aggregate([
    { 
      $match: { _id: new ObjectId(String(req.body.id)) }
    },
    { 
      $lookup: { 
        from: "committees", 
        localField: "committee.id", 
        foreignField: "_id",
        as: "committeeInfo"
      }
    },
    {
      $lookup: {
        from: "locations",
        localField: "location.id",
        foreignField: "_id",
        as: "locationInfo"
      }
    },
    { $unwind: "$locationInfo" },
    { $unwind: "$committeeInfo" },
    {
      $project: {
        name: 1,
        description: 1,
        time: 1,
        status: 1,
        location: {
          name: "$locationInfo.name",
          address: "$locationInfo.address",
          city: "$locationInfo.city",
          state: "$locationInfo.state",
          zip: "$locationInfo.zip",
          country: "$locationInfo.country"
        },
        committee: {
          type: "$committeeInfo.eventType",
          id: "$committeeInfo._id",
          members: "$committeeInfo.members",
          officer: "$committeeInfo.supervisingOfficer",
        },
        rejDetails: 1
      }
    }
  ]))[0];
  //Get poster and similar events (Same Type, but not the same id)
  let similar = [];
  if (!event) throw ApiError(404, "Event not found");

  const params = {'committee.id': event.committee.id, _id: {$ne: new Object(event._id)}, status: "Approved"};
  similar = (await Event.find(
    params,
    {name: 1, time: 1, committeeId: 1 }
  )).map(d => appendImgPath(d.toJSON(), __dirname, 'events'));
  event = appendImgPath(event, __dirname, 'events');

  let isOfficer = false;
  let isCommittee = false;
  let isChairman = false;
  if (event.committee.officer.equals(token)) isOfficer = true;
  else if (event.committee.members.some(e => e.equals(token))) isCommittee = true;
  if (!(isOfficer || isCommittee)) delete event.rejDetails;
  if (!token) delete event.status;
  delete event.committee.members, event.committee.officer;
  return {status: 200, content: { event, similar, isOfficer, isCommittee, isChairman}};
};

export const getPortalEvents = async (req) => {
  const _id = extractToken(req);
  const events = {};
  const committees = (await Committee.find({$or: [{members: _id}, {supervisingOfficer: _id}]}, {_id: 1})).map(e=>e._id);


  const inclusions = {
    name: 1,
    description: 1,
    visibility: 1,
    mandatory: 1,
    start: '$time.start',
    end: '$time.end',
    committee: '$committee.name',
    location: '$location.name'
  };

  events.approved = await Event.find({
    status: "Approved", 
    "time.start": {$gte: new Date()},
    $nor: [{$and: [{visibility: "Committee"}, {"committee.id" : {$in: committees}}]}]
  }, inclusions);
  events.past = await Event.find({
    status: "Approved", 
    "time.start": {$lt: new Date()},
    $nor: [{$and: [{visibility: "Committee"}, {"committee.id" : {$in: committees}}]}]
  }, inclusions);
  inclusions.status= 1;
  events.comEvents = await Event.find({'committee.id' : {$in: committees}}, inclusions);
  events.rejEvents = await Event.find({'committee.id' : {$in: committees}, status: 'Rejected'}, inclusions);
  
  return {status:200, content: {events}, events};
};


/* ================== Update ================== */
export const updateEvent = async (req, res) => {
  let {eventId, name, description, start, end, type, visibility, location} = req.body;
  if (location == 0) {
    const {newLocName, newLocAddress} = req.body;
    const [address, city, sz] = newLocAddress.split(', ');
    const [state, zipCode] = sz.split(' ');
    location = (await Location.create({ address, city, state, zipCode, name: newLocName }))._id;
  }
  const updates = {};
  if (name) updates.name = name;
  if (description) updates.description = description;
  if (start) updates.start = start;
  if (end) updates.end = end;
  if (type) updates.type = type;
  if (visibility) updates.visibility = visibility;
  if (location) updates.location = location;
  updates.updatedAt = NOW();
  try{
    const folderPath = path.join(__dirname, 'public', 'images', 'events');

    // Delete existing image if it exists
    const existingFiles = fs.readdirSync(folderPath).filter(f => f.startsWith(`${eventId}.`));
    existingFiles.forEach(file => fs.unlinkSync(path.join(folderPath, file)));

    // Save the new image if provided
    if (req.file) {
      const newImagePath = path.join(folderPath, `${eventId}${path.extname(req.file.originalname)}`);
      await sharp(req.file.buffer)
        .jpeg({ quality: 90 })
        .toFile(newImagePath);
    }

    const event = await Event.findByIdAndUpdate(eventId, updates);

    res.status(200).json({success: true});
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const approveEvent = async (req) => {

};

/* ================== Delete ================== */
app.post('/rmEvent', [
  check('id').not().isEmpty()
], async (req, res) => {
  try {
    const { id } = req.body;
    const uId = extractToken(req);
    if (!uId) throw Error("User not allowed to delete event");

    const event = await Event.findById(id, {committee: 1});

    res.status(200).json({success: true});
  } catch (error) {
    res.status(400).json({success: false, error: error.message});
  }
});

export const removeEvent = async (req) => {
  // Add your logic here to remove events
};