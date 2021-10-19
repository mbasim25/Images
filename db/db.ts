import { Pool } from "pg";
import { secrets } from "../src/utils/";

// DB connection variables
const connectionString = secrets.DATABASE_URL;
const ssl = secrets.DATABASE_SSL;

// Options to be passed to the pool
const options = {
  connectionString,
  ssl: { rejectUnauthorized: false },
};

// Conditional ssl option
if (ssl !== "true") {
  delete options.ssl;
}

console.log(options);

const pool = new Pool({ ...options }).on("connect", () =>
  console.log("Connected")
);

export default pool;
