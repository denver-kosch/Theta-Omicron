import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { Op, fn } from 'sequelize';
import {Member, Chair} from './models-sequelize/models.js';
import sequelize from './models-sequelize/sequelize_instance.js';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
const port = process.env.SERVERPORT  || 3001;


const pool = mysql.createPool({
  connectionLimit: 10, // the number of connections to create in the pool
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 8888
});

sequelize.sync().then(() => {
  console.log("Database synchronized");

  app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
  });
}).catch(err => console.error("Failed to synchronize database:", err));


/* ================== Login / Authorization ================== */
app.post('/login', async (req, res) => {
  const {email, password} = req.body;
  
  const member = await Member.findOne({where: {email}});


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
    const rushCommittee = await Member.findAll({
      attributes: ['memberId', 'firstName', 'lastName', 'schoolEmail'], // Select specific fields from Members
      include: [{
        model: Chair,
        where: { chairId: {[Op.in]: [3, 15, 16]} }, // Condition on the included model
        attributes: ['title'], // Fetch the title of the chair
        through: {
          attributes: [] // Exclude attributes from the joining table
        }
      }]
    });
    res.status(200).json({members: rushCommittee, msg: "Got Rush Committee!"});
  } catch (error) {
    res.status(200).json({ error: 'Server error', details: error.message });
  }
});

app.post("/getEC", async (req, res) => {
  try {
    const ec = await Member.findAll({
      attributes: ['memberId', 'firstName', 'lastName'],
      include: [{
        model: Chair,
        where: {chairId: {[Op.between]: [1,5]}},
        attributes: ['title'],
        through: {
          attributes: []
        }
      }]
    });
    res.status(200).json({members: ec, msg: "Got EC!"});
  } catch (error) {
    res.status(200).json({ error: 'Server error', details: error });
  }
});

app.post("/getBros", async (req, res) => {
  try {
    const bros = await Member.findAll({
      where: { status: 'Initiate' },
      attributes: ['memberId', 'firstName', 'lastName', 'initiationYear'], // Select specific fields
      order: [['lastName', 'ASC']], // Order by last name
      include: [{
        model: Chair,
        through: {
          attributes: [] // Exclude attributes from the joining table
        },
        attributes: ['title'], // Fetch the title of the chair
        order: [['chairId', 'ASC']] // Order chairs by chairId
      }]
    });
    res.status(200).json({brothers: bros, msg: "Got Chapter!"});
  } catch (error) {
    res.status(200).json({ error: 'Server error', details: error.message });
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
    res.status(200).json({info: brother});
  } catch (error) {
    res.status(200).json({ error: 'Server error', details: error });
  }


});


//Add new member to database
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