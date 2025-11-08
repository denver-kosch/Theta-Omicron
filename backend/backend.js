import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import {Server} from 'socket.io';
import { createServer } from 'https';
import { fileURLToPath } from 'url';
import { key, cert } from './config.js';
import fs from 'fs';
import { connectDB, asyncHandler } from './functions.js';
import { check, body, validationResult } from 'express-validator';
import { addEvent, addMember, uploadMinutes } from './apiFuncs/create.js';
import { getCommittee, getBros, getBro, getEvents, getCommittees, getLocations, getEventCreation, getEventDetails, getChairmen, getNotes, getPositions, getMinutes, getSelf } from './apiFuncs/read.js';
import { updateEvent, approveEvent, rejectEvent, updateCommittee } from './apiFuncs/update.js';
import { removeEvent, deleteMinutes } from './apiFuncs/delete.js';
import { login, auth, extractToken, checkAdmin } from './apiFuncs/authentication.js';

console.log('Starting server...');
console.time('Server Startup');

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Storing files in memory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json(), express.urlencoded({ extended: true }), cors());

app.use('/images', express.static(path.join(__dirname, 'public/images')));

const server = createServer({ key, cert }, app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this as needed
    methods: ["GET", "POST"],
    credentials: true,
    
  }
});

io.on('connection',socket => {
	console.log('a user connected');
	socket.on('disconnect', () => {
	  console.log('user disconnected');
	});
});

//connect to db, then listen to port
(async () => {
  try {
    const [port, host] = await connectDB();
    server.listen(port, host, () => {
      console.log(`Server running on https://${host}:${port}`);
      console.timeEnd('Server Startup');
    });
  } catch (error) {
    console.log('Error connecting to database: ' + error.message);
  };
})();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}


/* ================== Login / Authorization ================== */
app.post('/login', 
[
  check('email').trim().isEmail(),
  validateRequest
], asyncHandler(login));


app.post('/auth', asyncHandler(auth));

/* ================== Create ================== */
app.post('/members', [
	check(['password', 'email', 'fname', 'lname', 'phone', 'street', 'city', 'address', 'state']).not().isEmpty().isString(),
	check('email', 'Invalid email').isEmail(),
	check('phone', 'Invalid phone number').isMobilePhone(),
	check('state', 'Invalid state').isLength({ min: 2, max: 2 }),
	check('zip', 'Invalid zip code').isLength({ min: 5, max: 5 }).isNumeric(),
	check('gradYear', 'Invalid graduation year').isNumeric(),
	validateRequest
], asyncHandler(addMember));

app.post('/events', upload.single('image'), [
  check(['name', 'description', 'committeeId', 'visibility'], 'All form fields are required').not().isEmpty().isString(),
  check(['start', 'end'], 'All form fields are required').not().isEmpty().isDate(),
  validateRequest
], asyncHandler(addEvent));

app.post('/minutes', upload.single('file'), asyncHandler(uploadMinutes));

/* ================== Read ================== */
app.get('/committees/:identifier', asyncHandler(getCommittee));

app.get("/brothers", asyncHandler(getBros));

app.get("/brothers/:slug", asyncHandler(getBro));

app.get("/me", asyncHandler(getSelf));

app.get("/me/admin", asyncHandler(checkAdmin));

app.get("/me/positions", asyncHandler(getPositions));

app.get("/events", [
  check('vis').optional().trim(),
  check('days').optional().isNumeric(),
  check('mandatory').optional().isBoolean(),
  validateRequest
], asyncHandler(getEvents));

app.get("/committees", asyncHandler(getCommittees));

app.get('/locations', asyncHandler(getLocations));

app.get("/eventCreation", asyncHandler(getEventCreation));

app.get("/events/:id", asyncHandler(getEventDetails));

app.get('/chairmen', asyncHandler(getChairmen));

app.get('/notes/:id', asyncHandler(getNotes));

app.get('/minutes/', asyncHandler(getMinutes));

/* ================== Update ================== */
app.put('/updateEvent/:id', upload.single('image'), asyncHandler(updateEvent));

app.put('/events/:id/approve', asyncHandler(approveEvent));

app.put('/events/:id/reject', asyncHandler(rejectEvent));

app.put('/committees/:name', [
  check('name').not().isEmpty().isString(),
  body('rushLink').optional().isURL(),
  validateRequest
], asyncHandler(updateCommittee));

/* ================== Delete ================== */
app.delete('/events/:id', asyncHandler(removeEvent));

app.delete('/minutes', [
  check('minutesId').not().isEmpty(),
  validateRequest
], asyncHandler(deleteMinutes));

/* ================== Miscellaneous ================== */
app.get('/secure/minutes/:filename', (req, res) => {
  if (!extractToken(req)) return res.status(401).send('Unauthorized');
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'secure', 'documents', 'minutes', filename);
  if (!filePath.startsWith(path.join(__dirname, 'secure', 'documents', 'minutes'))) return res.status(400).send('Invalid file path');
  if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
  res.sendFile(filePath);
});