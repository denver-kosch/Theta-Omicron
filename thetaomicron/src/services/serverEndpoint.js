const port = process.env.REACT_APP_SERVERPORT || 3001;
const host = window.location.hostname || 'localhost';
const ENDPOINT = `http://${host}:${port}/`;
// const host = 'https://e346-173-88-76-222.ngrok-free.app';
// const ENDPOINT = `${host}/`;


export default ENDPOINT;
export {port, host};