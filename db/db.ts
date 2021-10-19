import { Pool } from "pg";
import { secrets } from "../src/utils/";

// DB connection

const connectionString = secrets.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("Connected");
});

export default pool;
