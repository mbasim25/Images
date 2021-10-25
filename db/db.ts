import { Pool } from "pg";
import {
  DATABASE_SSL,
  DATABASE_URL as connectionString,
  DB_CONFIG as config,
} from "../src/utils/secrets";

// DB ssl
const ssl = DATABASE_SSL;

// DB connection string for heroku or config for running
// the pg image inside docker-compose
const connection = connectionString ? { connectionString } : { ...config };

// Options to be passed to the pool
const options = {
  ...connection,
  ssl: { rejectUnauthorized: false },
};

// Conditional ssl option
if (ssl !== "true") {
  delete options.ssl;
}

const pool = new Pool({ ...options }).on("connect", () =>
  console.log("Connected")
);

export default pool;
