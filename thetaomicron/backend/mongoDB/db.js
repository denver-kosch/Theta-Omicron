import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const uri = process.env.MONGODBURI;
const dbname = process.env.MONGODBNAME;
const client = new MongoClient(uri);
let dbConnection;

const connectDB = async () => {
    try {
        await client.connect();
        dbConnection = client.db(dbname);
        console.log('Database connected successfully!');
    } catch (error) {
        console.log('Could not connect to database:', error);
        process.exit(1);
    }
};
const getDB = () => dbConnection;

export {connectDB, getDB };