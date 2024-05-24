import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { Member, Officer, Committee, Role, Event } from './models-sequelize/models.js';
import sequelize from './models-sequelize/sequelize_instance.js';
import { Op } from 'sequelize';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();
const port = process.env.SERVERPORT  || 3001;

sequelize.sync().then(() => {
  console.log("Database synchronized");

  app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
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
    return res.status(200).json({valid: true, success:true});
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
          roles.push({ 
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
    const upcoming = (req.body.days) ? await Event.findAll({
        where: {
          start: {
            [Op.gte]: new Date(),
            [Op.lte]: new Date(new Date().setDate(new Date().getDate() + days))
          },
          visibility: vis,
          status: "Approval"
        },
        attributes: {
          include: ['eventId', 'name', 'description', 'start', 'end', 'location']
        }
    }): 
    await Event.findAll({
      where: {
        visibility: vis,
        approved: true
      },
      attributes: {
        include: ['eventId']
      }
    });
    res.status(200).json({ success: true, events: upcoming })
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
});

app.post("/getCommittees", async (req, res) => {
  try {
    //if searching for user's committees, get committees of user, otherwise get all comittees
    let committees = false;
    if (req.body.user && req.body.user == true) {
      let authHeader = req.headers['authorization'];
      let token = authHeader && authHeader.split(' ')[1];
      const memberId = jwt.verify(token, process.env.SESSION_SECRET).memberId;
      committees = await Committee.findAll(
        {include: [{
          model: Member,
          where: { memberId },
          attributes: []
          
      }]}
      );
    }
    else committees = await Committee.findAll();
    
    if (committees) res.status(200).json({ success: true, committees: committees });
    else throw Error("Committees not found");
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
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
    const {name, description, start, end, type, location, visibility} = req.body.data;
    const event = await Event.create({name, description, start, end, type, location, facilitatingCommittee: req.body.data.committee, visibility});
    const uploadPath = path.join(__dirname,'images','eventPosters', `${event.eventId}${path.extname(req.file.originalname)}`);

    // Save the file from memory to disk
    fs.writeFileSync(uploadPath, req.file.buffer);

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