import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

// Fetch important data from .env file

const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL;

export { PORT, DB_URL };
