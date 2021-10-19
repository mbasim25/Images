import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

// Fetch important data from .env file

const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_SSL = process.env.DATABASE_SSL;
const BASE_URL = process.env.BASE_URL;

export { PORT, DATABASE_URL, DATABASE_SSL, BASE_URL };
