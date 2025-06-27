import fs from 'fs';
import path from 'path';
import { connect } from 'mongoose';
import { port, host, mongodbUri } from './config.js';

export const connectDB = async () => {
    try {
        console.log(`Attempting MongoDB connect`);
        await connect(mongodbUri);
        console.log(`MongoDB connected`);
        console.log('Connected to DB:', (await import('mongoose')).default.connection.name);
        return [port, host];
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export const appendImgPath = (obj, dirname, imgFolder) => {
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

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
};

const sendJsonResponse = (res, status, content = {}) => {
    content.success = (status >= 200 && status < 300) ? true : false;
    res.status(status).json(content);
};

const handleError = (error, res) => {
  if (error instanceof ApiError) sendJsonResponse(res, error.status, { error: error.message });
  else sendJsonResponse(res, 500, { error: 'Internal Server Error' });
};

export const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next, res))
  .then(({status, content = {}}) => sendJsonResponse(res, status, content))
  .catch(error => handleError(error, res));


