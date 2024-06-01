import express from 'express';
import dotenv from 'dotenv';
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

dotenv.config();
const app = express();
const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT  || 3001;
const host = getLocalIP() || 'localhost';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//connect to db, then listen to port
(async () => {
  try {
    await connectDB();
    app.listen(port, host, () => {
      console.log(`Server running on http://${host}:${port}`);
    });
  } catch (error) {
    console.log('Error connecting to database: ' + error.message);
  };
})();

/* ================== Login / Authorization ================== */
//Finished
app.post('/login', [
  check('email').trim().isEmail(),
  // ExpressValidator.check('password').isLength({ min: 5 }) // Will implement when we eventually add length requirement
], async (req, res) => {
  try {
    const { email, password } = req.body;

    // const member = await db.collection('Members').findOne({ 'contactInfo.email': email }, {projection: {_id: 1, password: 1}});
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
app.post("/getRush", async (req, res) => {
  try {

    const rushCommittee = await Committee.aggregate([
      {
        $match: {name: "Rush Committee"}
      },
      {
        $lookup: {
          from: "members",
          localField: "members",
          foreignField: "_id",
          as: "members"
        }
      },
      {
        $lookup: {
          from: "members",
          localField: "supervisingOfficer",
          foreignField: "_id",
          as: "gmc"
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          members: "$members",
          gmc: '$gmc',
        }
      }
    ]);

    console.log(rushCommittee);

    /* const rushCommittee1 = await Committee.findAll({
      where: { committeeId: 4 },  // Updated to the specific committeeId you mentioned
      include: [
          {
              model: Member,  // Include the Member model
              attributes: ['memberId', 'firstName', 'lastName', 'schoolEmail'],  // Select specific fields from Members
              through: {
                  attributes: ['isChairman']  // Include the chairman status from the joining table
              }
          },
          {
              model: Officer,  // Include the Officer model
              as: 'supervisingOfficer',  // Use the correct alias as defined in Officer to Committee relationship
              where: { officeId: 3 },  // Specify the officer ID if needed to filter committees by supervising officer
              attributes: ['title'],  // Select specific fields from Officers
              include: [
                  {
                      model: Member,
                      attributes: ['memberId', 'firstName', 'lastName', 'schoolEmail'],  // Include details of the officer as a member
                  }
              ]
          }
      ],
      attributes: ['committeeId', 'name']  // Fetch committee ID and name
    }); */
    res.status(200).json({success: true, members: rushCommittee, msg: "Got Rush Committee!"});
  } catch (error) {
    res.status(200).json({success: false, error: error.message });
  }
});

app.post("/getEC", async (req, res) => {
  try {
    const ec = await Member.findAll({
      attributes: ['memberId', 'firstName', 'lastName'],
      include: [{
        model: Officer,
        attributes: ['title'],
        required: true
      }]
    });
    res.status(200).json({success: true, members: ec, msg: "Got EC!"});
  } catch (error) {
    res.status(200).json({success: false, error: error.message });
  }
});

app.post("/getBros", async (req, res) => {
  try {
    const bros = await Member.findAll({
      where: { status: 'Initiate' },
      attributes: ['memberId', 'firstName', 'lastName', 'initiationYear'], // Select specific fields
      order: [['lastName', 'ASC']], // Order by last name
      include: [
          {
              model: Officer, // Assumes you want to include Officer data
              attributes: ['title'], // Assuming 'title' is relevant in Officer model
              required: false // Include members regardless of being an officer
          },
          {
              model: Committee, // Include Committee data through CommitteeMember
              attributes: ['name'], // Assuming you want to fetch the committee's name
              through: {
                  attributes: ['isChairman'] // Include if they are the chairman
              },
              required: false // Include all, regardless of committee membership
          }
      ]
    });
    const reshapedBros = bros.map(bro => {
      const { memberId, firstName, lastName, initiationYear, Officer, Committees } = bro;
      let roles = [];
      
      // Check if the Officer data exists and append
      if (Officer) roles.push({ type: 'Officer', title: Officer.title });
      
  
      // Append all committee roles
      Committees.forEach(committee => {
          if (committee.name !== "Executive Committee") roles.push({ 
              type: 'Committee', 
              title: committee.CommitteeMember.isChairman ? committee.name.replace(/Committee/g, 'Chairman') : committee.name
          });
      });
  
      return {
          memberId,
          firstName,
          lastName,
          initiationYear,
          roles
      };
    });
    res.status(200).json({success: true, brothers: reshapedBros, msg: "Got Chapter!"});
  } catch (error) {
    res.status(200).json({success: false, error: error.message });
  }
});
//Finished
app.post("/getBro", async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    const _id = String((jwt.verify(token, process.env.SESSION_SECRET)).memberId);

    const brother = await Member.findById(_id, 'status lastName positions');

    res.status(200).json({success: true, info: brother});
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});
//Finished
app.post("/getEvents", [
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
      let committees = false;
      let inclusions = [];
      
      if (req.body.user) {
        let authHeader = req.headers['authorization'];
        let token = authHeader && authHeader.split(' ')[1];
        const memberId = jwt.verify(token, process.env.SESSION_SECRET).memberId;
        inclusions.push({
          model: Member,
          attributes: [],
          where: {memberId}
        });
      }
      committees = await Committee.findAll({include: inclusions});

    
    if (committees) res.status(200).json({ success: true, committees: committees });
    else throw Error("Committees not found");
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
});

app.post('/getLocations', async (req, res) => {
  try {
    let locations = await Location.find({});
    if (locations) res.status(200).json({ success: true, locations: locations });
    else throw Error("Locations not found");
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
});

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
    if (event) {
      const similar = await Event.find({committeeId: event.committeeId, _id: {$ne: new Object(event._id)}});
      event = appendImgPathMongoDB(event, __dirname, 'events');

      console.log("similar: ", similar);
      res.status(200).json({ success: true, event: event, similar});
    }
    else throw Error("Event not found");
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

app.post('/addEvent', upload.single('image'), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }
    
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    const {memberId} = jwt.verify(token, process.env.SESSION_SECRET);
    const {name, description, start, end, type, visibility} = req.body;
    let {location} = req.body;
    
    if (location == 0) {
      const {newLocName, newLocAddress} = req.body;
      const [address, city, sz] = newLocAddress.split(', ');
      const [state, zipCode] = sz.split(' ');
      location = (await Location.create({ address, city, state, zipCode, name: newLocName })).locationId;
    }

    const event = await Event.create({name, description, start, end, type, location, visibility, lastUpdatedBy: memberId});
    
    const folderPath = path.join(__dirname, 'public','images','events');
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
    const uploadPath = path.join(folderPath, `${event.eventId}${path.extname(req.file.originalname)}`);

    // Save the file from memory to disk
    await sharp(req.file.buffer)
      .jpeg({ quality: 90 }) // You can adjust the quality as needed
      .toFile(uploadPath);

    res.status(201).json({ success: true, newId: event.eventId});
  } catch (error) {
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