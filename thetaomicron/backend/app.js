import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Define routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});