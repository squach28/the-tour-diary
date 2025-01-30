import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const db = new pg.Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});
