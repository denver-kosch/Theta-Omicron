import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import {Server} from 'socket.io';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { connectDB, asyncHandler } from './functions.js';
import { check } from 'express-validator';
import { addEvent, addMember, uploadMinutes } from './apiFuncs/create.js';
import { getCommittee, getBros, getBro, getEvents, getCommittees, getLocations, getEventCreation, getEventDetails, getPortalEvents, getChairmen, getNotes, getPositions, getMinutes } from './apiFuncs/read.js';
import { updateEvent, approveEvent, rejectEvent } from './apiFuncs/update.js';
import { removeEvent, deleteMinutes } from './apiFuncs/delete.js';
import { login, auth, extractToken } from './apiFuncs/authentication.js';

console.log('Starting server...');
console.time('Server Startup');

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Storing files in memory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json(), express.urlencoded({ extended: true }), cors());

// Only expose public/images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this as needed
    methods: ["GET", "POST"],
    credentials: true
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
      console.log(`Server running on http://${host}:${port}`);
      console.timeEnd('Server Startup');
    });
  } catch (error) {
    console.log('Error connecting to database: ' + error.message);
  };
})();


/* ================== Login / Authorization ================== */
app.post('/login', 
[
  check('email').trim().isEmail(),
  //check('password').isLength({ min: 8 }) // Will implement when we eventually add length requirement
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
], asyncHandler(addMember));

app.post('/events', upload.single('image'), [
  check(['name', 'description', 'committeeId', 'visibility'], 'All form fields are required').not().isEmpty().isString(),
  check(['start', 'end'], 'All form fields are required').not().isEmpty().isDate(),
], asyncHandler(addEvent));

app.post('/minutes', upload.single('file'), asyncHandler(uploadMinutes));

/* ================== Read ================== */
app.get('/committees/:identifier', asyncHandler(getCommittee));

app.get("/brothers", asyncHandler(getBros));

app.get("/brothers/:id", asyncHandler(getBro));

app.get("/events", [
  check('vis').optional().trim(),
  check('days').optional().isNumeric(),
  check('mandatory').optional().isBoolean()
], asyncHandler(getEvents));

app.get("/committees", asyncHandler(getCommittees));

app.get('/locations', asyncHandler(getLocations));

app.get("/eventCreation", asyncHandler(getEventCreation));

app.get("/events/:id", asyncHandler(getEventDetails));

app.get('/portalEvents', asyncHandler(getPortalEvents));

app.get('/chairmen', asyncHandler(getChairmen));

app.get('/notes/:id', asyncHandler(getNotes));

app.get('/positions/:id', asyncHandler(getPositions));

app.get('/minutes/', asyncHandler(getMinutes));

/* ================== Update ================== */
app.put('/updateEvent', upload.single('image'), asyncHandler(updateEvent));

app.put('/approveEvent', asyncHandler(approveEvent));

app.put('/rejectEvent', asyncHandler(rejectEvent));

/* ================== Delete ================== */
app.delete('/rmEvent', [check('id').not().isEmpty()], asyncHandler(removeEvent));

app.delete('/deleteMinutes', [check('minutesId').not().isEmpty()], asyncHandler(deleteMinutes));

/* ================== Miscellaneous ================== */
app.get('/secure/minutes/:filename', (req, res) => {
  if (!extractToken(req)) return res.status(401).send('Unauthorized');
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'secure', 'documents', 'minutes', filename);
  if (!filePath.startsWith(path.join(__dirname, 'secure', 'documents', 'minutes'))) return res.status(400).send('Invalid file path');
  if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
  res.sendFile(filePath);
});