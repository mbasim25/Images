import { Pool } from "pg";
import { secrets } from "../src/utils/";

// DB connection
const connectionString = secrets.DATABASE_URL;

console.log(secrets.DATABASE_SSL === "true");

const pool = new Pool({
  connectionString,
  ssl: secrets.DATABASE_SSL === "true",
});

pool.on("connect", () => {
  console.log("Connected");
});

export default pool;
