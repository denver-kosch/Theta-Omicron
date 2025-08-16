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
            sharp(req.file.buffer).jpeg({ quality: 90 }).toFile(newImagePath);
        }

        Event.findByIdAndUpdate(eventId, updates);

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

    const event = await Event.findByIdAndUpdate(id, {status: "Approved"});
    if (event.status !== "Approved") throw new ApiError(500, 'Error approving event');
    return {status: 200};
};

export const rejectEvent = async (req) => {
    const { id } = req.params;
    const { committeeId, reason } = req.body;
    const _id = extractToken(req);
    const officer = (await Committee.findById(committeeId, {_id:0, supervisingOfficer:1})).supervisingOfficer;
    if (!_id.equals(officer)) throw new ApiError(401, 'Unauthorized User');

    const event = await Event.findByIdAndUpdate(id, {status: "Rejected", rejDetails: {date: new Date(), reason}});
    if (event.status !== "Rejected") throw new ApiError(500, 'Error rejecting event');
    return {status: 200};
};

export const updateAttendance = async (unexcusedList) => {
    unexcusedList.forEach(async (member) => {
        const [firstName, lastName] = member.split(' ');
        const updatedMember = await Member.findOneAndUpdate(
            { firstName, lastName },
            { $inc: { unexcusedCount: 1 } }
        );
        if (!updatedMember) console.error(`Member not found: ${firstName} ${lastName}`);
    });
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