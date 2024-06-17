import { ApiError } from "../functions.js";
import { Committee, Event } from "../mongoDB/models.js";
import { extractToken } from "./authentication.js";

export const removeEvent = async (req) => {
  const {id:e, committeeId} = req.body;
  const id = extractToken(req);
  const members = (await Committee.findById(committeeId, {_id:0, members:1})).members;
  if (!members.includes(id)) throw new ApiError(401, 'Unauthorized User');

  const event = await Event.findByIdAndDelete(e);
  if (event.status !== "Approved") throw new ApiError(500, 'Error approving event');
  return {status: 200};
};