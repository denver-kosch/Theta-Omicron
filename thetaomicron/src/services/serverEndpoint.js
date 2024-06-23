const port = process.env.REACT_APP_SERVERPORT || 3001;
const host = window.location.hostname || 'localhost';

const ENDPOINT = `http://${host}:${port}/`;

export default ENDPOINT;
export {port, host};