# Overview
This repository stores a WIP web application designed for usage by the Brothers of the Theta-Omicron Chapter of the Kappa Sigma Fraternity for both advertisement of the Chapter and utility for officers and chairmen/committees. The app contains/will contain various pages and will, in due time, also include a mobile app for Brothers' utility.

This project is currently being developed by (as new contributors arise, they will be included here, along with their contributions):
* Brother Denver Kosch '22 (Full Stack)

## Technologies Used
* MERN Stack
* Front End: React
* Back End: Node.js
  * Custom-built APIs for educational purposes and customized security
* Database: MongoDB
* Mobile App: React Native


## To reproduce on your own system:

1. Clone the repository:
   ```bash
   git clone https://github.com/denver-kosch/Theta-Omicron.git
   cd Theta-Omicron
   ```
   
2. Install dependencies:
   ```bash
   npm install
   ```
   
3. Set up .env files
   - Front End (.env file in the thetaomicron directory)
   ```bash
   REACT_APP_GOOGLE_API_KEY=yourApiKeyHere
   REACT_APP_GEO_API_KEY=yourApiKeyHere
   REACT_APP_SERVERPORT=YourBackendPort
   ```
   Users can set up keys for Google APIs at the [Google Cloud Console](https://console.cloud.google.com/welcome)
   
   
   - Back End (.env file in the thetaomicron/backend directory)
   ```bash
   MONGODB_URI=mongodb+srv://reader:readonlypassword@theta-omicron.xuxlcgy.mongodb.net/sampledb
   SESSION_SECRET=yourSessionSecret
   ```
   The URI provided allows read-only access to a sample copy of the database and is permitted for general usage.

4. Run the application
   - In one terminal, starting from the root directory, run:
     ```bash
     cd thetaomicron/
     npm start
     ```
     
   - In another terminal, run:
     ```bash
     cd thetaomicron/backend/
     node backend.js
     ```
> [!TIP]
> I run using nodemon when developing to update after changes, but no changes should be actively happening in general usage by viewers
