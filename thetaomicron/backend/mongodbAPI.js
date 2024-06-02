import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import sharp from 'sharp';
import multer from 'multer';
import path from 'path';
import { getLocalIP } from './start.js';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import { appendImgPathMongoDB } from './functions.js';
import connectDB from './mongoDB/db.js';
import { check } from 'express-validator';
import { Event, Member, Location, Committee } from './mongoDB/models.js';
import { startSession } from 'mongoose';
import { extractToken } from './functions.js';

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Storing files in memory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json(), express.urlencoded({ extended: true }), express.static(path.join(__dirname, 'public')), cors());

//connect to db, then listen to port
(async () => {
  try {
    await connectDB();
    const port = process.env.PORT  || 3001;
    const host = getLocalIP() || 'localhost';
    app.listen(port, host, () => {
      console.log(`Server running on http://${host}:${port}`);
    });
  } catch (error) {
    console.log('Error connecting to database: ' + error.message);
  };
})();

/* ================== Login / Authorization ================== */
//Finished
app.post('/login', 
[
  check('email').trim().isEmail(),
  //check('password').isLength({ min: 5 }) // Will implement when we eventually add length requirement
], async (req, res) => {
  try {
    const { email, password } = req.body;
    const member = await Member.findOne({'contactInfo.email': email}, '_id password');

    if (member && await bcrypt.compare(password, member.password)) {
      const token = jwt.sign({memberId: member._id}, process.env.SESSION_SECRET, {expiresIn: '1h'});
      return res.status(200).json({success: true, token});
    } 
    else return res.status(401).json({success: false, error: 'Wrong username or password'});
  } catch (error) {
    return res.status(500).json({success: false, error: `Internal server error: ${error.message}`});
  }
});
//Finished
app.post('/auth', async (req, res) => {
  let authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  try{
    if (!token) throw Error("No token provided");

    const payload = jwt.verify(token, process.env.SESSION_SECRET);
    return res.status(200).json({success:true});

  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) return res.status(401).json({valid: false, message: 'Token Expired', success: false});

    return res.status(401).json({valid: false, message: err.message, success: false});
  }
});


/* ================== Getters ================== */
//Finished
app.post("/getRush", async (req, res) => {
  try {
    const rushCommittee = (await Member.find(
      {positions: {$elemMatch: {$or: [{committeeName: "Rush Committee"}, {role: "Grand Master of Ceremonies"}]}}},
      { firstName: 1, lastName: 1, email: '$contactInfo.schoolEmail', positions: 1 }
    )).map(doc => appendImgPathMongoDB(doc.toJSON(), __dirname, 'profilePics')).map(d => {
      return {
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        imageUrl: d.imageUrl,
        position: d.positions.find(p => p.committeeName === "Rush Committee" || p.role === "Grand Master of Ceremonies")
      }
    });

    res.status(200).json({success: true, members: rushCommittee, msg: "Got Rush Committee!"});
  } catch (error) {
    res.status(404).json({success: false, error: error.message });
  }
});
//Finished
app.post("/getEC", async (req, res) => {
  try {
    const ecId = new ObjectId("6658162d3ff76a90701ab5db");
    const ec = await Member.aggregate([
      { $match: { positions: { $elemMatch: { committeeId: ecId } } } },
      { $unwind: "$positions" },  // Flatten the positions array
      { $match: { "positions.committeeId": ecId } },
      { $sort: { "positions.ecOrder": 1 } },  // Sort by the ecOrder field
      { $project: {
        firstName: 1,
        lastName: 1,
        position: "$positions"  // Include the unwinded position in the projection
      }}
    ]);

    const results = ec.map(doc => appendImgPathMongoDB(doc, __dirname, 'profilePics'));
    
    res.status(200).json({success: true, officers: results, msg: "Got EC!"});
  } catch (error) {
    res.status(200).json({success: false, error: error.message });
  }
});
//Finished
app.post("/getBros", async (req, res) => {
  try {
    const bros = (await Member.find({status: "Initiate"}, {firstName: 1,lastName: 1,positions: 1 }).sort({lastName: 1, firstName: 1}))
    .map(doc => appendImgPathMongoDB(doc.toJSON(), __dirname, 'profilePics')).map(d => {
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

    res.status(200).json({success: true, brothers: bros, msg: "Got Chapter!"});
  } catch (error) {
    res.status(200).json({success: false, error: error.message });
  }
});
//Finished
app.post("/getBro", async (req, res) => {
  try {
    const _id = req.headers.authorization &&  extractToken(req);

    const brother = await Member.findById(_id, 'status lastName positions');

    res.status(200).json({success: true, info: brother});
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});
//Finished
app.post("/getEvents", 
[
  check('vis').optional().trim(),
  check('days').optional().isNumeric(),
  check('mandatory').optional().isBoolean()
], async (req, res) => {
  try {
    const { vis, days, mandatory, status } = req.body;
    const query = [];
    if (vis) query.push({visibility: vis});
    if (days) {
      query.push({ "time.start": {
        $gte: new Date(),
        $lte: new Date(new Date().setDate(new Date().getDate() + days))
      }});
    }
    if (typeof mandatory == 'boolean') query.push({mandatory});
    if (status) query.push({status});
    
    // const events = await Event.find((query.length > 0) ? {$and: query}: {});
    const events = await Event.aggregate([
      {$match:(query.length > 0) ? {$and: query}: {}},
      {
        $lookup: {
          from: 'locations', // Assuming 'locations' is the name of your collection
          localField: 'locationId',
          foreignField: '_id',
          as: 'locationDetails'
        }
      },
      {
        $unwind: {
          path: '$locationDetails'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          time: 1,
          location: '$locationDetails.name',
        }
      }
    ]);

    for (let i=0; i<events.length; i++) events[i] = appendImgPathMongoDB(events[i], __dirname, 'events');

    res.status(200).send({ success: true, events: events })
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

app.post("/getCommittees", async (req, res) => {
  try {
      let _id = false;
      
      if (req.body.user) _id = req.headers.authorization && extractToken(req);
      const committees = await Committee.find(_id ? {members: {$in: _id}}: {});

    
    if (committees) res.status(200).json({ success: true, committees: committees });
    else throw Error("Committees not found");
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
});
//Finsished
app.post('/getLocations', async (req, res) => {
  try {
    const locations = await Location.find({});
    if (locations) res.status(200).json({ success: true, locations: locations });
    else throw Error("Locations not found");
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
});
//Finished
app.post("/getEventCreation", async (req, res) => {
  try {
    const _id = req.headers.authorization &&  extractToken(req);
    const committees = await Committee.find({members: {$in: [_id]}}, {name: 1});
    const officer = await Committee.find({supervisingOfficer: _id}, {name: 1});
    const locations = await Location.find({});
    if (committees && locations) res.status(200).json({ success: true, committees: {member: committees, officer}, locations });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
});
//Finished
app.post("/getEventDetails", async (req, res) => {
  try {
    let event = (await Event.aggregate([
      { 
        $match: { _id: new ObjectId(String(req.body.id)) }
      },
      { 
        $lookup: { 
          from: "committees", 
          localField: "committeeId", 
          foreignField: "_id",
          as: "committee"
        }
      },
      {
        $lookup: {
          from: "locations",
          localField: "locationId",
          foreignField: "_id",
          as: "location"
        }
      },
      { $unwind: "$location" },
      { $unwind: "$committee" },
      {
        $project: {
          name: 1,
          description: 1,
          time: 1,
          committeeId: 1,
          location: {
            name: "$location.name",
            address: "$location.address",
            city: "$location.city",
            state: "$location.state",
            zip: "$location.zip"
          },
          type: "$committee.eventType"
        }
      }
    ]))[0];

    //Get poster and similar events (Same Type, but not the same id)
    let similar = [];
    if (event) {
      similar = (await Event.aggregate([
        {
          $match: {committeeId: event.committeeId, _id: {$ne: new Object(event._id)}, status:'Approved'}
        },
        {
          $lookup: {
            from: "locations",
            localField: "locationId",
            foreignField: "_id",
            as: "location"
          }
        },
        { $unwind: "$location" },
        {
          $project: {
            name: 1,
            time: 1,
            committeeId: 1,
            location: "$location.name"
          }
        }
      ])).map(d => appendImgPathMongoDB(d, __dirname, 'events'));
      event = appendImgPathMongoDB(event, __dirname, 'events');
    }
    else throw Error("Event not found");
    res.status(200).json({ success: true, event: event, similar});
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

app.post('/checkEventPerms', async (req, res) => {
  try {
    //Get token
    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    const memberId = jwt.verify(token, process.env.SESSION_SECRET).memberId;

    const {committeeId} = req.body;

    //Check that the user is in the facilitating committee
    const facilitating = await Committee.findOne({
      where: {
        committeeId,
      }
    });


  }
  catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});


/* ================== Setters ================== */
app.post('/addMember', async (req, res) => {
  try {
    const {email, fName, lName, status, phone, street, city, state, zip, country, initiation, graduation, school} = req.body;
    //Hash the password before entering into db
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const ritualCerts = req.body.ritualCerts ?? 0;
    const member = await Member.create({
      firstName: fName,
      lastName: lName,
      email: email,
      schoolEmail: school,
      phoneNum: phone,
      status: status,
      password: hashedPassword,
      streetAddress: street,
      city: city,
      state: state,
      zipCode: zip,
      country: country,
      initiationYear: initiation,
      graduationYear: graduation,
      ritualCerts: ritualCerts
    });
    res.status(201).json({ success: true});
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
});
//Finished
app.post('/addEvent', upload.single('image'), 
[
  check(['name', 'description', 'start', 'end', 'committeeId', 'visibility'], 'All form fields are required').not().isEmpty().isString(),
],async (req, res) => {
  const session = await startSession();
  try {
    session.startTransaction();
    if (!req.file) return res.status(400).json({ success: false, error: "No poster uploaded" });
    const _id = req.headers.authorization &&  extractToken(req);

    const {name, description, start, end, committeeId, visibility} = req.body;
    const time = {start, end};
    let {location} = req.body;
    
    if (location === '0') {
      const {newLocName, newLocAddress} = req.body;
      if (!/^\d+ [A-Za-z\s]+\, ?[A-Za-z\s]+\,?[A-Z]{2} \d{5}$/.test(newLocAddress)) throw Error("Address not in address format")
      const [address, city, sz] = newLocAddress.split(', ');
      const [state, zip] = sz.split(' ');
      location = (await Location.create({ address, city, state, zip, name: newLocName }))._id.toString();
    }

    const event = (await Event.create([
      {
        name, 
        description, 
        time, 
        committeeId: new ObjectId(String(committeeId)), 
        locationId: new ObjectId(String(location)), 
        visibility
      }], {session}))[0];
      
    const folderPath = path.join(__dirname, 'public','images','events');
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
    const uploadPath = path.join(folderPath, `${event._id.toString()}${path.extname(req.file.originalname)}`);
    console.log(uploadPath)
    console.log('before img upload')
    // Save the file from memory to disk
    await sharp(req.file.buffer)
      .jpeg({ quality: 90 }) // You can adjust the quality as needed
      .toFile(uploadPath);

    session.commitTransaction();
    session.endSession();
    res.status(201).json({ success: true, newId: event._id});
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, error: error.message });
  }
});


/* ================== Editors ================== */
app.post('/expel', async (req, res) => {
  let id = req.body.id;
  //Using member model, change status to Expelled
  try{
    let user = await Member.findByIdAndUpdate(id, {status:"Expelled"});
    res.status(200).json({success: true});
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
});

app.post('/updateEvent', upload.single('image'), async (req, res) => {
  let {eventId, name, description, start, end, type, visibility, location} = req.body;
  if (location == 0) {
    const {newLocName, newLocAddress} = req.body;
    const [address, city, sz] = newLocAddress.split(', ');
    const [state, zipCode] = sz.split(' ');
    location = (await Location.create({ address, city, state, zipCode, name: newLocName })).locationId;
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
});