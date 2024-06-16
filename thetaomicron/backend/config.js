import { config } from "dotenv";
import { dirname as _dirname } from 'path';
import { fileURLToPath } from 'url';

config();

export const tokenSecret = process.env.SESSION_SECRET;
export const dirname = _dirname(fileURLToPath(import.meta.url));