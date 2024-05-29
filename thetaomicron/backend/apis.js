import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cors from 'cors';
import sharp from 'sharp';
import jwt from 'jsonwebtoken';
import { Member, Officer, Committee, Role, Event, Location, EventType, CommitteeMember } from './models-sequelize/models.js';
import sequelize from './models-sequelize/sequelize_instance.js';
import { Op } from 'sequelize';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { appendImgPath } from './functions.js';

const app = express();
const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage });

const port = process.env.SERVERPORT  || 3001;
const host = process.env.HOST || 'localhost';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
dotenv.config();

sequelize.sync({alter: true}).then(() => {
  console.log("Database synchronized");

  app.listen(port, host,() => {
      console.log(`Server running on http://${host}:${port}`);
  });
}).catch(err => console.error("Failed to synchronize database:", err));


/* ================== Login / Authorization ================== */
app.post('/login', async (req, res) => {
  const {email, password} = req.body;
  
  const member = await Member.findOne({
    where: {email: email},
    attributes: ['password', 'memberId']
  });

  if (member && await bcrypt.compare(password, member.password)) {
    const token = jwt.sign({memberId: member.memberId}, process.env.SESSION_SECRET, {expiresIn: '1h'});
    return res.status(200).json({token, success: true});
  } 
  else return res.status(200).json({error: 'Incorrect username or password', success: false});
});

app.post('/auth', async (req, res) => {
  let authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(200).json({valid: false, success: false});
  try{
    const payload = jwt.verify(token, process.env.SESSION_SECRET);
    return res.status(200).json({success:true});
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError)
    return res.status(200).json({valid: false, message: 'Token Expired', success: false});

    return res.status(200).json({valid: false, message: err, success: false});
  }
});


/* ================== Getters ================== */
app.post("/getRush", async (req, res) => {
  try {
    const rushCommittee = await Committee.findAll({
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
    });
    res.status(200).json({success: true, members: rushCommittee[0], msg: "Got Rush Committee!"});
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

app.post("/getBro", async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    const id = (jwt.verify(token, process.env.SESSION_SECRET)).memberId;
    const brother = await Member.findOne({
      where:{ memberId: id},
      attributes: ['status', 'lastName']
    });
    res.status(200).json({success: true, info: brother});
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
});

app.post("/getEvents", async (req, res) => {
  try {
    const days = req.body.days || false;
    const vis = req.body.vis || 'Public';
    const mandatory = req.body.mandatory || false;
    const status = req.body.status;
    const where = {};
    if (days) where.start = {
      [Op.gte]: new Date(),
      [Op.lte]: new Date(new Date().setDate(new Date().getDate() + days))
    };
    if (vis) where.visibility = vis;
    if (mandatory) where.mandatory = mandatory;
    if (status) where.status = status;

    const events = await Event.findAll({
        where: {
          start: {
            [Op.gte]: new Date(),
            [Op.lte]: new Date(new Date().setDate(new Date().getDate() + days))
          },
          visibility: vis,
          status: "Approved",
        },
        attributes: {
          include: ['eventId', 'name', 'description', 'start', 'end', 'location']
        },
        include: [
            {
              model: Location,
              attributes: ['name', 'address', 'city', 'state', 'zipCode'],
            },
        ]
    });

    for (let i=0; i<events.length; i++) events[i] = appendImgPath(events[i], __dirname,'events');
    
    res.status(200).send({ success: true, events: events })
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

app.post("/getCommittees", async (req, res) => {
  try {
      let committees = false;
      let authHeader = req.headers['authorization'];
      let token = authHeader && authHeader.split(' ')[1];
      const memberId = jwt.verify(token, process.env.SESSION_SECRET).memberId;
      let inclusions = [];

      if (req.body.user) inclusions.push({
          model: Member,
          attributes: [],
          where: {memberId}
        });
      
      committees = await Committee.findAll({include: inclusions});

    
    if (committees) res.status(200).json({ success: true, committees: committees });
    else throw Error("Committees not found");
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
});

app.post("/getTypes", async (req, res) => {
  try {
    let types = false;
    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    const memberId = jwt.verify(token, process.env.SESSION_SECRET).memberId;
    console.log(memberId)
    const sql = `
      SELECT e.typeId, e.name 
      FROM EventTypes e 
      WHERE e.committee IN (
        SELECT c.committeeId 
        FROM Committees c 
        JOIN CommitteeMembers cm ON c.committeeId = cm.committeeId 
        WHERE cm.memberId = ?
      );
    `;

    types = req.body.user ? await sequelize.query(sql, {
      replacements: [memberId],
      type: sequelize.QueryTypes.SELECT
    }) : await EventType.findAll({attributes: ['typeId', 'name']});

    if (types) res.status(200).json({ success: true, types: types });
    else throw Error("Types not found");
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
});

app.post('/getLocations', async (req, res) => {
  try {
    let locations = await Location.findAll();
    if (locations) res.status(200).json({ success: true, locations: locations });
    else throw Error("Locations not found");
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
});

app.post("/getEventDetails", async (req, res) => {
  try {
    let event = await Event.findOne({
      where: {
        eventId: req.body.id
      },
      attributes: {
        include: ['name', 'description', 'start', 'end', 'location'],
        exclude: ['type','location', 'createdBy','updatedAt', 'createdAt', 'status']
      },
      include: [
          {
            model: Location,
            attributes: ['name', 'address', 'city', 'state', 'zipCode'],
          },
          {
            model: EventType,
            attributes: ['name'],
          }
      ]
  });
  if (event) {
    event = appendImgPath(event, __dirname,'events');
    res.status(200).json({ success: true, event: event });
  }
  else throw Error("Event not found");
  } catch (error) {
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
    const {name, description, start, end, committee, visibility} = req.body;
    let {location} = req.body;
    
    if (location == 0) {
      const {newLocName, newLocAddress} = req.body;
      const [address, city, sz] = newLocAddress.split(', ');
      const [state, zipCode] = sz.split(' ');
      location = (await Location.create({ address, city, state, zipCode, name: newLocName })).locationId;
    }
    const type = (await EventType.findOne({where: {committee}})).typeId;

    const event = await Event.create({name, description, start, end, type, location, visibility, createdBy: memberId});
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const folderPath = path.join(__dirname,'images','events');
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

app.post('/updateEvent', async (req, res) => {
  let {eventId, name, description, start, end, type, visibility, location} = req.body;
  if (location == 0) {
    const {newLocName, newLocAddress} = req.body;
    const [address, city, sz] = newLocAddress.split(', ');
    const [state, zipCode] = sz.split(' ');
    location = (await Location.create({ address, city, state, zipCode, name: newLocName })).locationId;
  }
  let updates = {};


  const event = await Event.update(
  
  );
});