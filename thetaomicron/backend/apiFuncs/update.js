import { Location, Event } from "../mongoDB/models.js";
import fs from 'fs';
import { dirname } from "../config.js";
import { join, extname } from "path";
import sharp from "sharp";



export const updateEvent = async (req, res) => {
    let {eventId, name, description, start, end, type, visibility, location} = req.body;
    if (location == 0) {
        const {newLocName, newLocAddress} = req.body;
        const [address, city, sz] = newLocAddress.split(', ');
        const [state, zipCode] = sz.split(' ');
        location = (await Location.create({ address, city, state, zipCode, name: newLocName }))._id;
    }
    const updates = {};
    updates.name ??= name;
    updates.description ??= description;
    updates.start ??= start;
    updates.end ??= end;
    updates.type ??= type;
    updates.visibility ??= visibility;
    updates.location ??= location;

    try{
        const folderPath = join(dirname, 'public', 'images', 'events');

        // Delete existing image if it exists
        const existingFiles = fs.readdirSync(folderPath).filter(f => f.startsWith(`${eventId}.`));
        existingFiles.forEach(file => fs.unlinkSync(join(folderPath, file)));

        // Save the new image if provided
        if (req.file) {
            const newImagePath = join(folderPath, `${eventId}${extname(req.file.originalname)}`);
            await sharp(req.file.buffer)
            .jpeg({ quality: 90 })
            .toFile(newImagePath);
        }

        const event = await Event.findByIdAndUpdate(eventId, updates);

        return {status: 200};
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
  
export const approveEvent = async (req) => {
    
};