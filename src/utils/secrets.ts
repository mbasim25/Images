import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

// Fetch important data from .env file
const PORT = process.env.NODE_ENV == "test" ? 4000 : process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_SSL = process.env.DATABASE_SSL;
const BASE_URL = process.env.BASE_URL;

const DB_CONFIG = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT),
};

export { PORT, DATABASE_URL, DB_CONFIG, DATABASE_SSL, BASE_URL };
