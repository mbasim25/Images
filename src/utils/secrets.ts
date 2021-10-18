import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

// Fetch important data from .env file

const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL;
const BASE = process.env.BASE;
const BASE_URL = BASE! + ":" + PORT + "/";

export { PORT, DB_URL, BASE_URL };
