import { Committee, Member, Location, Event } from "../mongoDB/models.js";
import { appendImgPath } from "../functions.js";
import { ObjectId } from 'mongodb';
import { dirname } from "../config.js";
import { ApiError } from "../functions.js";
import { extractToken } from "./authentication.js";


export const getCommittee = async (req) => {
    const { name, _id, emails, pics } = req.body;
    
    const projections = {firstName: 1, lastName: 1, position: "$positions"};
    if (emails) projections["contactInfo.schoolEmail"] = 1;
    
    const committee = name ? await Committee.findOne({name}, {supervisingOfficer: 1, members: 1}) : await Committee.findOne({_id}, {supervisingOfficer: 1, members: 1});
    
    let members = await Member.aggregate([
    { $match: { _id: {$in: [...committee.members, committee.supervisingOfficer]}} },
    { $unwind: "$positions" },  // Flatten the positions array
    { $match: { $or: [{"positions.committeeId": committee._id}, {'positions.committeeName': "Executive Committee"}] } },
    { $project: projections }
    ]);

    if (pics) members = members.map(doc => appendImgPath(doc, dirname, 'profilePics'));

    if (members.length > 0) return {status:200, content: {members}, members};
    else throw new ApiError(404, "Committee not found");
};
  
export const getBros = async () => {
    const bros = (await Member.find({status: "Initiate"}, {firstName: 1,lastName: 1,positions: 1 }).sort({lastName: 1, firstName: 1}))
      .map(doc => appendImgPath(doc.toJSON(), dirname, 'profilePics')).map(d => {
        const arr = [];
        d.positions.forEach(p => {
          if (p.committeeName === "Executive Committee") arr.push(p.role)
          else if (p.role === "Chairman") arr.push(`${p.committeeName.split(" ")[0]} Chairman`);
          else arr.push(p.committeeName);
        });
  
        return {
          firstName: d.firstName,
          lastName: d.lastName,
          email: d.email,
          imageUrl: d.imageUrl,
          positions: arr
        }
      });
      if (bros) return {status: 200, content: {bros}, bros};
      else throw new ApiError(404, "Brothers not found");
};
  
export const getBro = async (req) => {
  const _id = extractToken(req);
  const info = _id && (await Member.findById(_id, {status:1, lastName:1, positions:1}));
  if (info) return {status: 200, content: {info}};
  else throw new ApiError(404, "Brother not found");
};
  
export const getEvents = async (req) => {
    const { vis, days, mandatory, status } = req.body;
    const query = [];
    if (vis) query.push({visibility: vis});
    if (days) query.push({ "time.start": { $gte: new Date(), $lte: new Date(new Date().setDate(new Date().getDate() + days)) }});
    if (typeof mandatory == 'boolean') query.push({mandatory});
    if (status) query.push({status});
  
    const events = await Event.find((query.length > 0) ? {$and: query} : {}, { name: 1, description: 1, time: 1, location: "$location.name" });
  
    for (let i=0; i<events.length; i++) events[i] = appendImgPath(events[i].toJSON(), dirname, 'events');
  
    if (events) return {status:200, content: { events }, events};
    else throw new ApiError(404, "Events not found");
};

export const getCommittees = async (req) => {
    // Will return false if invalid id or no id provided
    _id = extractToken(req);
    const committees = await Committee.find(_id ? {members: {$in: _id}} : {});
  
    if (committees) return {status: 200, content: { committees: committees }};
    else throw ApiError(404, "Committees not found");
};
  
export const getLocations = async () => {
    const locations = await Location.find({});
    if (locations) return {status:200, content: { locations: locations }, locations};
    else throw Error("Locations not found");
};
  
export const getEventCreation = async (req) => {
    const _id = extractToken(req);
    const committees = await Committee.find({members: {$in: [_id]}}, {name: 1});
    const officer = await Committee.find({supervisingOfficer: _id}, {name: 1});
    const locations = await Location.find({});
    if (committees && locations) return {status:200, content: { committees: {member: committees, officer}, locations }};
    else throw ApiError(401, "Committees or Locations not found");
};

export const getEventDetails = async (req) => {
    const token = extractToken(req);
    let event = (await Event.aggregate([
      { 
        $match: { _id: new ObjectId(String(req.body.id)) }
      },
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
    //Get poster and similar events (Same Type, but not the same id)
    let similar = [];
    if (!event) throw ApiError(404, "Event not found");
  
    const params = {'committee.id': event.committee.id, _id: {$ne: new Object(event._id)}, status: "Approved"};
    similar = (await Event.find(params, {name: 1, time: 1})).map(d => appendImgPath(d.toJSON(), dirname, 'events'));
    event = appendImgPath(event, dirname, 'events');
  
    let isOfficer = false;
    let isCommittee = false;
    let isChairman = false;
    if (event.committee.officer.equals(token)) isOfficer = true;
    else if (event.committee.members.some(e => e.equals(token))) isCommittee = true;
    if (!(isOfficer || isCommittee)) delete event.rejDetails;
    if (!token) delete event.status;
    delete event.committee.members, event.committee.officer;
    return {status: 200, content: { event, similar, isOfficer, isCommittee, isChairman}};
};
  
export const getPortalEvents = async (req) => {
    const _id = extractToken(req);
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
    if (chairmen) return {status: 200, content: {chairmen, ec}};
    else throw new ApiError(404, "Chairmen not found");
};