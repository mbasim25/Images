import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

// Fetch important data from .env file

const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;
const BASE_URL = process.env.BASE_URL;

export { PORT, DATABASE_URL, BASE_URL };
