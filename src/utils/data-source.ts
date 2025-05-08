import { DataSource } from "typeorm";
import { getConfig } from "../config";
const DB_HOST = getConfig().DB_HOST;
const DB_PORT = getConfig().DB_PORT;
const DB_NAME = getConfig().DB_NAME;
const DB_USER = getConfig().DB_USER;
const DB_PASSWORD = getConfig().DB_PASSWORD;
const SQL_ECHO = getConfig().SQL_ECHO;
export const AppDataSource = new DataSource({
    "type": "mysql",
    "host": DB_HOST,
    "port": DB_PORT,
    "username": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "synchronize": false,
    "logging": SQL_ECHO,
    "entities": ["src/modules/**/entities/**/*.ts"]
})
AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error))