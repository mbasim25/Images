import pool from "./db";

// Create the tables
const createTable = `
  CREATE TABLE IF NOT EXISTS
  images(id uuid NOT NULL PRIMARY KEY,
  cover VARCHAR NOT NULL, 
  thumbnail VARCHAR NOT NULL);
  TRUNCATE TABLE images;`;

pool.query(createTable, async (res, err) => {
  try {
    console.log(res, err);
  } catch (e) {
    console.log(e);
  }
});
