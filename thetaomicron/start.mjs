import { execSync } from "child_process";
import { networkInterfaces } from 'os';
import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

const getLocalIP = () => {
    const interfaces = networkInterfaces();
    for (const interfaceName in interfaces) {
      const iface = interfaces[interfaceName];
      for (const alias of iface) {
        if (alias.family === 'IPv4' && !alias.internal) {
          return alias.address;
        }
      }
    }
    return "127.0.0.1";
};

(() => {
  dotenv.config();
  const ip = getLocalIP();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const envPath = path.join(__dirname, '.env');
  const newApiUrl = `REACT_APP_API_URL=http://${ip}`;
  console.log(newApiUrl);

  // Read the current content of the .env file
  let envContent = fs.readFileSync(envPath, 'utf8');

  // Check if the REACT_APP_API_URL variable already exists
  const regex = /^REACT_APP_API_URL=.*$/gm;
  if (regex.test(envContent)) {
      // Replace the existing line
      envContent = envContent.replace(regex, newApiUrl);
  } else {
      // Append the new line if it does not exist
      envContent += `\n${newApiUrl}\n`;
  }

  // Write the updated content back to the .env file
  fs.writeFileSync(envPath, envContent);

  console.log(`Starting React development server on IP: ${ip}`);

  // Set the HOST environment variable and start the server
  execSync(`HOST=${ip} react-scripts start`, { stdio: 'inherit' });
})();