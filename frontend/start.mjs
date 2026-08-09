import { execSync } from "child_process";
import { networkInterfaces } from 'os';
import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

const getLocalIP = () => {
        for (const interfaceName in networkInterfaces()) for (const alias of interfaces[interfaceName]) if (alias.family === 'IPv4' && !alias.internal) return alias.address;
        return "127.0.0.1";
};

(() => {
    dotenv.config({ path: path.resolve('../.env')});
    const ip = getLocalIP();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envPath = path.join(__dirname, '../.env');
    const newApiUrl = `VITE_API_URL=http://${ip}`;
    // Read the current content of the .env file
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Check if the VITE_API_URL variable already exists
    const regex = /^VITE_API_URL=.*$/gm;
    envContent = regex.test(envContent) ? envContent.replace(regex, newApiUrl) : envContent += `\n${newApiUrl}\n`;
    
    // Write the updated content back to the .env file
    fs.writeFileSync(envPath, envContent);

    // Set the HOST environment variable and start the server
    execSync(`vite`, { stdio: 'inherit' });
})();