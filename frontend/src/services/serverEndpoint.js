const port = import.meta.env.VITE_SERVERPORT || 3001;
const host = window.location.hostname || 'localhost';
const ENDPOINT = `https://${host}:${port}/`;
// const host = 'https://e346-173-88-76-222.ngrok-free.app';
// const ENDPOINT = `${host}/`;


export default ENDPOINT;
export {port, host};