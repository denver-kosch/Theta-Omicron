import {networkInterfaces} from 'os';

export function getLocalIP() {
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
}