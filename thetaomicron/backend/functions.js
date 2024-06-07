import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getLocalIP } from './start.js';
import { isObjectIdOrHexString, connect } from 'mongoose';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

dotenv.config();
const port = process.env.PORT || 3001;
const host = getLocalIP() || 'localhost';


export const connectDB = async () => {
    try {
        console.log(`Attempting MongoDB connect on ${host}`);
        await connect(process.env.MONGODBUR || 'mongodb+srv://reader:BSTb7oKp5dGdAMib@theta-omicron.xuxlcgy.mongodb.net/sampleDB');
        console.log(`MongoDB connected`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export const appendImgPathMongoDB = (obj, dirname, imgFolder) => {
  const id = obj._id.toString();
  const imagePath = `images/${imgFolder}/${id}`;
  let imageUrl = `/images/${imgFolder}/default.png`;

  for (let ext of ['jpg', 'png', 'jpeg']) {
    if (fs.existsSync(path.join(dirname, 'public', `${imagePath}.${ext}`))) {
      imageUrl = `/images/${imgFolder}/${id}.${ext}`;
      break;
    }
  }

  obj.imageUrl = `http://${host}:${port}${imageUrl}`;
  return obj;
};

export const extractToken = req => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  const _id = String((jwt.verify(token, process.env.SESSION_SECRET)).memberId);
  return isObjectIdOrHexString(_id) && new ObjectId(_id);
}

export const abbrSt = state => {
  const abbrs = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY"
  };
  return abbrs[state] ?? state;
};