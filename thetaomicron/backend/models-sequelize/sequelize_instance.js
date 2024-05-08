import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    port: DB_PORT,
    logging: false,
    pool: {
        max: 10,        // Maximum number of connections in pool
        acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
        idle: 10000     // The maximum time, in milliseconds, that a connection can be idle before being released
    }
});
  
export default sequelize;