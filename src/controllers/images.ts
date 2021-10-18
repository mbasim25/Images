import { Request, Response } from "express";
import { pool } from "../../db";
import { QueryResult } from "pg";

// Get all images
export const list = async (req: Request, res: Response) => {
  try {
    const results: QueryResult = await pool.query(`SELECT * FROM images;`);

    const images = results.rows;

    return res.status(200).json(images);
  } catch (e) {
    return res.status(400).json(e);
  }
};
