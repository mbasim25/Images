import { Pool } from "pg";
import { secrets } from "../src/utils/";

// DB connection

const connectionString = secrets.DB_URL;

const pool = new Pool({
  connectionString,
});

pool.on("connect", () => {
  console.log("Connected");
});

export default pool;
