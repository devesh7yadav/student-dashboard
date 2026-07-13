import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const requireEnvVar = [
    "PG_USER", "PG_HOST", "PG_DATABASE", "PG_PORT", "PG_PASSWORD"
];

const pool = new pg.Pool({
    user: process.env.PG_USER, 
    host: process.env.PG_HOST, 
    database: process.env.PG_DATABASE, 
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT)
});

pool.connect()
    .then(() => console.log("Database is connected"))
    .catch((err) => console.log("Connection denied", err))

export const query = (text, params) => pool.query(text, params);