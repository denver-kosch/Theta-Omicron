import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import Member from './models-sequelize/models.js';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
const dbport = process.env.DB_PORT || 8888;
const port = process.env.SERVERPORT  || 3001;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: dbport
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.listen(port, () => console.log(`Server is running on http://${process.env.DB_HOST}:${port}`));

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
app.post("/getRush", (req, res) => {
  try {
    const getRushCommittee = `
      SELECT M.memberId, M.firstName, M.lastName, M.schoolEmail, C.title FROM Members AS M 
      JOIN Chairmen AS CM ON CM.memberId=M.memberId 
      JOIN Chairs AS C ON C.chairId = CM.chairId
      WHERE C.chairId IN (3, 15, 16) 
      ORDER BY C.chairId ASC
    `;
    db.query(getRushCommittee, [], (err, result) => {
      if (err) res.status(200).json({ error: 'Failed to retrieve members', details: err });
      else res.status(200).json({members: result, msg: "Got Rush Committee!"});
    });
  } catch (error) {
    res.status(200).json({ error: 'Server error', details: error });
  }
});

app.post("/getEC", (req, res) => {
  try {
    const ECQuery = `SELECT M.memberId, M.firstName, M.lastName, C.title FROM Members AS M 
    JOIN Chairmen AS CM ON CM.memberId=M.memberId 
    JOIN Chairs AS C ON C.chairId=CM.chairId
    WHERE C.chairId BETWEEN 1 AND 5 
    ORDER BY C.chairId ASC`;
    db.query(ECQuery, [], (err, results) => {
      if (err) res.status(200).json({ error: 'Failed to retrieve members', details: err })
      else res.status(200).json({members: results, msg: "Got EC!"});
    });
  } catch (error) {
    res.status(200).json({ error: 'Server error', details: error });
  }
});

app.post("/getBros", async (req, res) => {
  try {
    const brothersQuery = `
      SELECT memberId, firstName, lastName, initiationYear FROM Members
      WHERE status='Initiate'
      ORDER BY lastName ASC
    `;
    const chairQuery = `
      SELECT C.title FROM Chairs AS C
      JOIN Chairmen AS CM USING (chairId)
      WHERE CM.memberId=?
      ORDER BY C.chairId ASC
    `;

    let bros = await new Promise((resolve, reject) => {
      db.query(brothersQuery, [], (err, results) => err ? reject (err): resolve(results))
    });

    for (let i = 0; i < bros.length;  i++) {
      bros[i].positions = await new Promise ((resolve, reject) => {
        db.query(chairQuery, [bros[i].memberId], (err, results) => err ? reject (err): resolve(results))
      });
    }
    res.status(200).json({brothers: bros, msg: "Got Chapter!"});
  } catch (error) {
    res.status(200).json({ error: 'Server error', details: error });
  }
});

app.post("/getBro", (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  const id = (jwt.verify(token, process.env.SESSION_SECRET)).memberId;
  
  const query = `
  SELECT status, lastName FROM Members WHERE memberId=?
  `;

  db.query(query, [id],  (err, result) => {
    if (err || !result.length || result.length>1) return res.status(200).json({error: "Error Getting Information"});
    else res.status(200).json({info: result[0]});
  });



});


//Add new member to database
app.post('/addMember', async (req, res) => {
  console.log('Request received for /add-member');
  const {email, password, fName, lName, status, phone, street, city, state, zip, initiation, graduation} = req.body;
  try {
    const insertMem =  `
      INSERT INTO Members (email, password, firstName, lastName, status, phoneNum, streetAddress, city, state, postalCode, initiationYear, graduationYear)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    let hash = await bcrypt.hash(password, 10);
    db.query(insertMem, [email, hash, fName, lName, status, phone, street, city, state, zip, initiation, graduation], (err, result) => {
      if (err) throw err;
      return res.status(200).json({ success: true});
    });
  } catch (error) {
    res.status(200).json({ error: 'Server error', details: error });
  }
});