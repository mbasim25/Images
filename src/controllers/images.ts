import { Request, Response } from "express";
import { v4 } from "uuid";
import { process } from "../utils";
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

// Create different sizes of the uploaded image
export const create = async (req: Request, res: Response) => {
  try {
    const id = v4();

    if (!req.file) {
      return res.status(400).json("An image must be provided");
    }

    // Process the images
    const images = await process(req, id);
    const { cover, thumb } = images!;

    // Save to DB
    await pool.query(
      `INSERT INTO images(id, cover, thumbnail) 
       VALUES ($1, $2, $3);`,
      [id, cover, thumb]
    );

    return res.status(201).json({ id, cover, thumb });
  } catch (e) {
    return res.status(400).json(e);
  }
};
