import { config } from "dotenv";
import { dirname as _dirname } from 'path';
import { fileURLToPath } from 'url';
import { getLocalIP } from "./start.js";

config();

export const tokenSecret = process.env.SESSION_SECRET;
export const dirname = _dirname(fileURLToPath(import.meta.url));
export const mongodbUri = process.env.MONGODB_URI;
export const port = process.env.PORT || 3001;
export const host = getLocalIP() || 'localhost';