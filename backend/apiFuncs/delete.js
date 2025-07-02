import { ApiError } from "../functions.js";
import { Committee, Event, Member, Minutes } from "../mongoDB/models.js";
import { extractToken } from "./authentication.js";
import { ObjectId } from "mongodb";
import fs from 'fs';
import { join } from 'path';
import { dirname } from "../config.js";

export const removeEvent = async (req) => {
  const {id:e, committeeId} = req.body;
  const id = extractToken(req);
  const members = (await Committee.findById(committeeId, {_id:0, members:1})).members;
  if (!members.includes(id)) throw new ApiError(401, 'Unauthorized User');

  const event = await Event.findByIdAndDelete(e);
  if (event.status !== "Approved") throw new ApiError(500, 'Error approving event');
  return {status: 200};
};

export const deleteMinutes = async (req) => {
  const { minutesId } = req.body;
  const userId = extractToken(req);
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const permissions = await Member.findById(userId, {_id:0, positions:1, privileges:1});
  const committeesAllowed = [ new ObjectId("6658162d3ff76a90701ab5db"), new ObjectId("6658162d3ff76a90701ab5d8") ];
  const allowed = permissions.positions.some(pos => committeesAllowed.some(id => id.toString() === pos.committeeId.toString())) 
  || /Admin/.test(permissions.privileges);

  if (!allowed) throw new ApiError(401, 'Unauthorized User');

  const minutes = await Minutes.findById(minutesId, {_id:0, filePath:1});
  if (!minutes) throw new ApiError(404, 'Minutes not found');

  const fullPath = join(dirname, 'secure', 'documents', 'minutes', minutes.filePath);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

  await Minutes.findByIdAndDelete(minutesId);

  return { status: 200 };
};