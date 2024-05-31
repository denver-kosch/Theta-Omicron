import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';


const port = process.env.PORT || 3001;
const host = process.env.HOST || 'localhost';

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