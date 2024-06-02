import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getLocalIP } from './start.js';
import { isObjectIdOrHexString } from 'mongoose';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

dotenv.config();
const port = process.env.PORT || 3001;
const host = getLocalIP() || 'localhost';

export const appendImgPath = (obj, dirname, imgFolder) => {
    obj = obj.toJSON();
    let id = null;
    for (const prop in obj) {
        if (/Id$/.test(prop)) {
            id = obj[prop];
            break;
        }
    }
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