import { execSync } from "child_process";
import { networkInterfaces } from 'os';
import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';
import { config } from 'dotenv';

const getLocalIP = () => {
    const interfaces = networkInterfaces();
    for (const interfaceName in interfaces) for (const alias of interfaces[interfaceName]) if (alias.family === 'IPv4' && !alias.internal) return alias.address;
    return "127.0.0.1";
};

config({ path: path.resolve('../.env')});

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env');
const newApiUrl = `VITE_API_URL=http://${getLocalIP()}`;

let envContent = fs.readFileSync(envPath, 'utf8');

const regex = /^VITE_API_URL=.*$/gm;
envContent = regex.test(envContent) ? envContent.replace(regex, newApiUrl) : envContent += `\n${newApiUrl}\n`;

fs.writeFileSync(envPath, envContent);

execSync(`vite`, { stdio: 'inherit' });