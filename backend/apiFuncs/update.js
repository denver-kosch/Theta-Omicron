import { Location, Event, Committee, Member } from "../mongoDB/models.js";
import fs from 'fs';
import { dirname } from "../config.js";
import { join, extname } from "path";
import sharp from "sharp";
import { extractToken } from "./authentication.js";
import { ApiError } from "../functions.js";


export const updateEvent = async (req) => {
	let {eventId, name, description, start, end, type, visibility, location} = req.body;
	if (location == 0) {
		const {newLocName, newLocAddress} = req.body;
		const [address, city, sz] = newLocAddress.split(', ');
		const [state, zipCode] = sz.split(' ');
		location = (await Location.create({ address, city, state, zipCode, name: newLocName }))._id;
	}
	const updates = { name, description, start, end, type, visibility, location };

	try{
		const folderPath = join(dirname, 'public', 'images', 'events');

		// Delete existing image if it exists
		const existingFiles = fs.readdirSync(folderPath).filter(f => f.startsWith(`${eventId}.`));
		existingFiles.forEach(file => fs.unlinkSync(join(folderPath, file)));

		// Save the new image if provided
		if (req.file) {
			const newImagePath = join(folderPath, `${eventId}${extname(req.file.originalname)}`);
			await sharp(req.file.buffer).jpeg({ quality: 90 }).toFile(newImagePath);
		}

		const event = await Event.findByIdAndUpdate(eventId, updates, { returnDocument: 'after', runValidators: true });

		if (!event) throw new ApiError(404, 'Event not found');

		return {status: 200};
	} catch (error) {
		throw new ApiError(error.status || 500, error.message || 'Error updating event');
	}
};
	
export const approveEvent = async (req) => {
	const { id } = req.params;
	const {committeeId} = req.body;
	const _id = extractToken(req);
	const officer = (await Committee.findById(committeeId, {_id:0, supervisingOfficer:1})).supervisingOfficer;
	if (!_id.equals(officer)) throw new ApiError(401, 'Unauthorized User');

	const event = await Event.findById(id);

	if (!event) throw new ApiError(404, 'Event not found');

	event.status = "Approved";
	event.rejectionDetails = undefined;

	await event.save();
	
	return {status: 200};
};

export const rejectEvent = async (req) => {
	const { id } = req.params;
	const { committeeId, reason } = req.body;
	const _id = extractToken(req);
	const officer = (await Committee.findById(committeeId, {_id:0, supervisingOfficer:1})).supervisingOfficer;
	if (!_id.equals(officer)) throw new ApiError(401, 'Unauthorized User');

	const event = await Event.findById(id);

	if (!event) throw new ApiError(404, 'Event not found');

	event.status = "Rejected";
	event.rejectionDetails = { date: new Date(), reason };

	await event.save();

	return {status: 200};
};

export const updateAttendance = async (unexcusedList) => {
	await Promise.all(
		unexcusedList.map(async (member) => {
			const normalizedName = fullName.trim().replace(/\s+/g, ' ');
			const separatorIndex = normalizedName.lastIndexOf(' ');

			if (separatorIndex === -1) {
				console.error(`Invalid member name: ${fullName}`);
				return;
			}

			const firstName = normalizedName.slice(0, separatorIndex);
			const lastName = normalizedName.slice(separatorIndex + 1);

			const matches = await Member.find({ firstName, lastName, status: 'Initiate' }).select('_id');

			if (matches.length === 0) {
				console.error(`Active member not found: ${normalizedName}`);
				return;
			}

			if (matches.length > 1) {
				console.error(`Ambiguous member name: ${normalizedName}`);
				return;
			}

			await Member.updateOne({ _id: matches[0]._id }, { $inc: { unexcusedCount: 1 } });
		})
	);
};

export const updateCommittee = async (req) => {
	try {
		const committee = await Committee.findOneAndUpdate({ name: { $regex: req.params.name, $options: "i" } }, req.body);
		if (!committee) throw new ApiError(404, 'Committee not found');
		return {status: 200};
	} catch (error) {
		throw new ApiError(error.status || 500, error.message || 'Error updating committee');
	}
};