import { Request, Response } from "express";
import { v4 } from "uuid";
import { process, remove } from "../utils";
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

// Get a single image by id
export const retrieve = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const image = await pool.query(`SELECT * FROM images WHERE id = $1;`, [id]);

    if (!image.rows[0]) {
      return res.status(404).json("Image not found");
    }

    return res.status(200).json(image.rows[0]);
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

// Update an image
export const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!req.file) {
      return res.status(400).json("An image must be provided");
    }

    // Check that the image exists
    const unique = await pool.query(`SELECT * FROM images WHERE id = $1;`, [
      id,
    ]);

    if (!unique.rows[0]) {
      return res.status(404).json("Image not found");
    }

    // Remove the old images
    await remove(unique);

    // Process the new images
    const images = await process(req, id);
    const { cover, thumb } = images!;

    // Save to DB
    const results = await pool.query(
      `UPDATE images SET cover = $1, thumbnail = $2 Where id = $3 RETURNING * ;`,
      [cover, thumb, id]
    );

    return res.status(200).json(results.rows);
  } catch (e) {
    return res.status(400).json(e);
  }
};

// Delete an image
export const destroy = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Check that the image exists
    const image = await pool.query(`SELECT * FROM images WHERE id = $1;`, [id]);

    if (!image.rows[0]) {
      return res.status(404).json("Image not found");
    }

    // Remove the images
    await remove(image);

    // Delete from DB
    await pool.query(`DELETE FROM images WHERE id = $1;`, [id]);

    return res.status(204).json();
  } catch (e) {
    return res.status(400).json(e);
  }
};
