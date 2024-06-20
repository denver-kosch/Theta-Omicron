const port = process.env.REACT_APP_SERVERPORT || 3001;
const host = window.location.hostname || 'localhost';

const serverEndpoint = `http://${host}:${port}/`;

export default serverEndpoint;
export {port, host};