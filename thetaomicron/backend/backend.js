import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import {Server} from 'socket.io';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { connectDB, asyncHandler } from './functions.js';
import { check } from 'express-validator';
import { addEvent, addMember } from './apiFuncs/create.js';
import { getCommittee, getBros, getBro, getEvents, getCommittees, getLocations, getEventCreation, getEventDetails, getPortalEvents, getChairmen } from './apiFuncs/read.js';
import { updateEvent, approveEvent, rejectEvent } from './apiFuncs/update.js';
import { removeEvent } from './apiFuncs/delete.js';
import { login, auth } from './apiFuncs/authentication.js';


const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Storing files in memory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json(), express.urlencoded({ extended: true }), express.static(path.join(__dirname, 'public')), cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this as needed
    methods: ["GET", "POST"]
  }
});

io.on('',socket => {
	console.log('a user connected');

	socket.on('disconnect', () => {
	  console.log('user disconnected');
	});
  }
);

//connect to db, then listen to port
(async () => {
  try {
    const [port, host] = await connectDB();
    server.listen(port, host, () => {
      console.log(`Server running on http://${host}:${port}`);
    });
  } catch (error) {
    console.log('Error connecting to database: ' + error.message);
  };
})();


/* ================== Login / Authorization ================== */
app.post('/login', 
[
  check('email').trim().isEmail(),
  //check('password').isLength({ min: 5 }) // Will implement when we eventually add length requirement
], asyncHandler(login));


app.post('/auth', asyncHandler(auth));

/* ================== Create ================== */
app.post('/addMember', [
	check(['password', 'email', 'fname', 'lname', 'phone', 'street', 'city', 'address', 'state']).not().isEmpty().isString(),
	check('email', 'Invalid email').isEmail(),
	check('phone', 'Invalid phone number').isMobilePhone(),
	check('state', 'Invalid state').isLength({ min: 2, max: 2 }),
	check('zip', 'Invalid zip code').isLength({ min: 5, max: 5 }).isNumeric(),
	check('gradYear', 'Invalid graduation year').isNumeric(),
], asyncHandler(addMember));

app.post('/addEvent', upload.single('image'), [
  check(['name', 'description', 'committeeId', 'visibility'], 'All form fields are required').not().isEmpty().isString(),
  check(['start', 'end'], 'All form fields are required').not().isEmpty().isDate(),
], asyncHandler(addEvent));

/* ================== Read ================== */
app.post('/getCommittee', asyncHandler(getCommittee));

app.post("/getBros", asyncHandler(getBros));

app.post("/getBro", asyncHandler(getBro));

app.post("/getEvents", [
  check('vis').optional().trim(),
  check('days').optional().isNumeric(),
  check('mandatory').optional().isBoolean()
], asyncHandler(getEvents));

app.post("/getCommittees", asyncHandler(getCommittees));

app.post('/getLocations', asyncHandler(getLocations));

app.post("/getEventCreation", asyncHandler(getEventCreation));

app.post("/getEventDetails", asyncHandler(getEventDetails));

app.post('/getPortalEvents', asyncHandler(getPortalEvents));

app.post('/getChairmen', asyncHandler(getChairmen));

/* ================== Update ================== */
app.post('/updateEvent', upload.single('image'), asyncHandler(updateEvent));

app.post('/approveEvent', asyncHandler(approveEvent));

app.post('/rejectEvent', asyncHandler(rejectEvent));

/* ================== Delete ================== */
app.post('/rmEvent', [check('id').not().isEmpty()], asyncHandler(removeEvent));