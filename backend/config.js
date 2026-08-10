import { config } from "dotenv";
import { fileURLToPath } from 'url';
import { networkInterfaces } from "os";
import { dirname } from 'path';

config({ path: `../.env` });

const getLocalIP = () => {
	const interfaces = networkInterfaces();
	for (const interfaceName in interfaces) for (const alias of interfaces[interfaceName]) if (alias.family === 'IPv4' && !alias.internal) return alias.address;
	return "127.0.0.1";
};

export const tokenSecret = process.env.SESSION_SECRET;
export const __dirname = dirname(fileURLToPath(import.meta.url));
export const mongodbUri = process.env.MONGODB_URI;
export const port = process.env.DB_PORT || 3307;
export const host = getLocalIP() || 'localhost';