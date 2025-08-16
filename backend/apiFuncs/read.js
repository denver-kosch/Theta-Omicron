import { Committee, Member, Location, Event, Minutes } from "../mongoDB/models.js";
import { appendImgPath, decodeUserSlug } from "../functions.js";
import { ObjectId } from "mongodb";
import { dirname, host, port } from "../config.js";
import { ApiError, generateUserSlug } from "../functions.js";
import { extractToken } from "./authentication.js";


export const getCommittee = async (req) => {
    const { identifier } = req.params;
    const { pics, emails, link } = req.query;
    console.log(link, "Link query param:", identifier);

    const committeeProjections = {supervisingOfficer: 1, members: 1};
    if (link) committeeProjections['link'] = 1;
    const committee = await Committee.findOne({name: { $regex: identifier, $options: "i" }}, committeeProjections);

    const projections = {firstName: 1, lastName: 1, position: "$positions"};
    if (emails) projections["contactInfo.schoolEmail"] = 1;

    let members = await Member.aggregate([
    { $match: { _id: {$in: [...committee.members, committee.supervisingOfficer]}} },
    { $unwind: "$positions" },  // Flatten the positions array
    { $match: { $or: [{"positions.committeeId": committee._id}, {'positions.committeeName': "Executive Committee"}] } },
    { $project: projections }
    ]);
    
    if (pics) members = members.map(doc => appendImgPath(doc, dirname, 'profilePics'));
    const data = { members };
    if (link) data.link = committee.link;

    if (members.length > 0) return {status:200, content: data};
    else throw new ApiError(404, "Committee not found");
};

export const getBros = async (req) => {
  const { chairmen, slugs } = req.query;
  const bros = chairmen ? await getChairmen() : (await Member.find({status: "Initiate"}, {firstName: 1,lastName: 1,positions: 1 }).sort({lastName: 1, firstName: 1}))
    .map(doc => appendImgPath(doc.toJSON(), dirname, 'profilePics')).map(d => {
      const arr = d.positions.map(p => 
        p.committeeName === "Executive Committee" ? 
        p.role : (/Committee/.test(p.committeeName) && p.role === "Chairman" ?
        `${p.committeeName.split(" ")[0]} Chairman` : p.committeeName)
      );

      const slug = slugs ? generateUserSlug(d) : null;

      return {
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        imageUrl: d.imageUrl,
        positions: arr,
        slug: slug
      }
    });
    if (bros) return {status: 200, content: { bros }, bros};
    else throw new ApiError(404, "Brothers not found");
};

export const getBro = async (req) => {
  const [firstName, lastName, idSuffix] = decodeUserSlug(req.params.slug);
  const matches = await Member.find({firstName, lastName}, {_id: 1, status:1, lastName:1, positions:1});
  const match = matches.find(b => b._id.toString().endsWith(idSuffix));
  const {_id, ...info} = match.toJSON();
  if (!info) throw new ApiError(404, "Brother not found");
  return {status: 200, content: {info}};
};

export const getSelf = async (req) => {
  const { _id } = extractToken(req);
  if (!_id) throw new ApiError(401, "Unauthorized");

  const { admin } = req.query;
  const returnFields = admin ? { privileges: 1 } : { firstName: 1, lastName: 1, status: 1, positions: 1, contactInfo: 1 };
  const info = await Member.findById(_id, returnFields);
  if (!info) throw new ApiError(404, "Brother not found");
  return {status: 200, content: {info}};
};
  
export const regularEvents = async (req) => {
  const { vis, days, mandatory, status, month, year, limit } = req.query;
  const query = [];
  if (vis) query.push({visibility: vis});
  if (typeof mandatory == 'boolean') query.push({mandatory});
  if (status) query.push({status});
  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    query.push({"time.start": {$gte: start, $lte: end}});
  } else if (days) {
    query.push({ "time.start": { $gte: new Date(), $lte: new Date(new Date().setDate(new Date().getDate() + days)) }});
  }

  let eventsQuery = Event.find((query.length > 0) ? {$and: query} : {}, { name: 1, description: 1, time: 1, location: "$location.name" });
  if (limit) eventsQuery = eventsQuery.limit(Number(limit));

  const events = (await eventsQuery)
    .map(doc => appendImgPath(doc.toJSON(), dirname, 'events'));

  if (events) return {status:200, content: { events }, events};
  else throw new ApiError(404, "Events not found");
};

export const getCommittees = async (req) => {
    // Will return false if invalid id or no id provided
  try {
    const { _id } = extractToken(req);

    const committees = await Committee.find(_id ? {members: _id} : {});

    if (committees) return {status: 200, content: { committees: committees }};
    else throw new ApiError(404, "Committees not found");
  } catch (error) {
		console.error(error);
		throw new ApiError(401, "Invalid token");
  }
};
  
export const getLocations = async () => {
    const locations = await Location.find({});
    if (locations) return {status:200, content: { locations: locations }, locations};
    else throw Error("Locations not found");
};
  
export const getEventCreation = async (req) => {
    const {_id, isAdmin} = extractToken(req);
    const committees = isAdmin
        ? await Committee.find({}, { name: 1 })
        : await Committee.find({ members: _id }, { name: 1 });
    const officer = isAdmin
        ? []
        : await Committee.find({ supervisingOfficer: _id }, { name: 1 });
    const locations = await Location.find({});
    if (committees && locations) {
        return {status: 200, content: {committees: { member: committees, officer }, locations }};
    } else throw new ApiError(401, "Committees or Locations not found");
};

export const getEventDetails = async (req) => {
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) throw new ApiError(400, "Invalid event ID");
	// Fetch event details, committee info, and location info
    let event = (await Event.aggregate([
		{ $match: { _id: new ObjectId(String(id)) } },
		{ 
			$lookup: { 
				from: "committees", 
				localField: "committee.id", 
				foreignField: "_id",
				as: "committeeInfo"
			}
		},
		{
			$lookup: {
				from: "locations",
				localField: "location.id",
				foreignField: "_id",
				as: "locationInfo"
			}
		},
		{ $unwind: "$locationInfo" },
		{ $unwind: "$committeeInfo" },
		{
			$project: {
				name: 1,
				description: 1,
				time: 1,
				status: 1,
				location: {
					name: "$locationInfo.name",
					address: "$locationInfo.address",
					city: "$locationInfo.city",
					state: "$locationInfo.state",
					zip: "$locationInfo.zip",
					country: "$locationInfo.country"
				},
				committee: {
					type: "$committeeInfo.eventType",
					id: "$committeeInfo._id",
					members: "$committeeInfo.members",
					officer: "$committeeInfo.supervisingOfficer",
				},
				rejDetails: 1
			}
		}
    ]))[0];

    if (!event) throw ApiError(404, "Event not found");
    //Get poster and similar events (Same committee, but not the same id)
    let similar = [];
  
    const params = {'committee.id': event.committee.id, _id: {$ne: new Object(event._id)}, status: "Approved", "time.start": {$gte: new Date()}};
    similar = (await Event.find(params, {name: 1, time: 1}).limit(5)).map(d => appendImgPath(d.toJSON(), dirname, 'events'));
    event = appendImgPath(event, dirname, 'events');

    const token = extractToken(req);
    const isOfficer = event.committee.officer.equals(token);
    const isCommittee = !isOfficer && event.committee.members.some(e => e.equals(token));
    const isChairman = false; // Placeholder, logic not added yet

    if (!(isOfficer || isCommittee)) delete event.rejDetails;
    if (!token) delete event.status;
    delete event.committee.members;
    delete event.committee.officer;
    return {status: 200, content: { event, similar, isOfficer, isCommittee, isChairman}};
};
  
export const portalEvents = async (req) => {
    const { _id } = extractToken(req);
    const events = {};
    const committees = (await Committee.find({$or: [{members: _id}, {supervisingOfficer: _id}]}, {})).map(e=>e._id);
  
    const inclusions = {
      name: 1,
      description: 1,
      visibility: 1,
      mandatory: 1,
      start: '$time.start',
      end: '$time.end',
      committeeName: "$committee.name",
      locationName: "$location.name"
    };
  
    events.approved = await Event.find({
      status: "Approved", 
      "time.start": {$gte: new Date()},
      $nor: [{$and: [{visibility: "Committee"}, {"committee.id" : {$in: committees}}]}]
    }, inclusions);
    events.past = await Event.find({
      status: "Approved", 
      "time.start": {$lt: new Date()},
      $nor: [{$and: [{visibility: "Committee"}, {"committee.id" : {$in: committees}}]}]
    }, inclusions);
    inclusions.status = 1;
    events.comEvents = await Event.find({'committee.id' : {$in: committees}}, inclusions);
    events.rejEvents = await Event.find({'committee.id' : {$in: committees}, status: 'Rejected'}, inclusions);
    
    return {status:200, content: {events}, events};
};

export const getChairmen = async () => {
    const chairmen = (await Member.aggregate([
      {$unwind: "$positions"},
      {$match: {"positions.role": "Chairman"}}, 
      {
        $group: {
          _id: "$_id",
          firstName: {$first: "$firstName"},
          lastName: {$first: "$lastName"},
          positions: {$addToSet: "$positions"}
        }
      },
      {
        $project: {
          firstName: 1, 
          lastName: 1, 
          positions: 1
        }
      }
    ])).map(doc => appendImgPath(doc, dirname, 'profilePics'));
    const ec = await Member.find({positions: {$elemMatch: {name: "Executive Committee"}}}, {firstName: 1, lastName: 1, positions: 1});
    if (chairmen) return {chairmen, ec};
    else throw new ApiError(404, "Chairmen not found");
};

export const getNotes = async (req) => {
	const notes = await Member.find({_id: extractToken(req)}, {notepad: 1});
	if (notes) return {status: 200, content: {notes}};
	else throw new ApiError(404, "Notes not found");
};

export const getPositions = async (req) => {
	const { _id, isAdmin } = extractToken(req);
	const { positions } = await Member.findById(_id, {positions: 1});
  console.log("Positions:", positions);
	if (positions?.length > 0 || isAdmin) return {status: 200, content: {positions}};
	else throw new ApiError(404, "Positions not found");
};

export const getMinutes = async (req) => {
  // Get minutes, sorted by date with most recent first, limited to 50 minutes (TBD for the rest of the minutes)
  try {
    const { _id } = extractToken(req);
    if (!_id) throw new ApiError(401, 'Unauthorized');

    const { numMinutes } = req.body;
    const query = Minutes.find({}, { date: 1, type: 1, filePath: 1 }).sort({ date: -1 });
    if (numMinutes) query.limit(numMinutes);
    const minutes = await query;

    minutes.forEach(minute => {
      minute.filePath = `http://${host}:${port}/secure/minutes/${minute.filePath}`;
    });
    if (minutes) return {status: 200, content: {minutes}};
    else throw new ApiError(404, 'Minutes not found');
  } catch (error) {
    console.error('Error fetching minutes:', error);
    throw  new ApiError(500, 'Internal server error');
  }
};

export const getEvents = async (req) => {
  const { portal } = req.query;
  if (portal) return await portalEvents(req);
  else return await regularEvents(req);
}