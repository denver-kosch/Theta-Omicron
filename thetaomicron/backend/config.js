import { dirname as _dirname } from 'path';
import { networkInterfaces } from 'os';
import { fileURLToPath } from 'url';
import { config } from "dotenv";

config();

function getLocalIP() {
    const interfaces = networkInterfaces();
    for (const interfaceName in interfaces) {
      const iface = interfaces[interfaceName];
      for (const alias of iface)  if (alias.family === 'IPv4' && !alias.internal) return alias.address;
    }
    return "127.0.0.1";
}

export const tokenSecret = process.env.SESSION_SECRET;
export const dirname = _dirname(fileURLToPath(import.meta.url));
export const mongodbUri = process.env.MONGODB_URI;
export const port = process.env.PORT || 3001;
export const host = getLocalIP() || 'localhost';
