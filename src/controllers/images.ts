import { Request, Response } from "express";
import { v4 } from "uuid";
import ImageHandler from "../utils/image-handler";
import { pool } from "../../db";
import { QueryResult } from "pg";

// Get all images
export const list = async (req: Request, res: Response) => {
  try {
    const limit: any = req.query.limit || 20;
    const page: any = req.query.page || 1;
    const offset = (page - 1) * limit;

    const results: QueryResult = await pool.query(
      `SELECT * FROM images OFFSET $1 LIMIT $2 ;`,
      [offset, limit]
    );

    for (const row of results.rows) {
      await ImageHandler.urlify(row);
    }

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

    return res.status(200).json(await ImageHandler.urlify(image.rows[0]));
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
    const processed = await ImageHandler.process(req, id);
    const { cover, thumbnail } = processed!;

    // Save to DB
    await pool.query(
      `INSERT INTO images(id, cover, thumbnail) 
       VALUES ($1, $2, $3);`,
      [id, cover, thumbnail]
    );

    const images = await ImageHandler.urlify({ id, cover, thumbnail });

    return res.status(201).json(images);
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
    await ImageHandler.remove(unique);

    // Process the new images
    const processed = await ImageHandler.process(req, id);
    const { cover, thumbnail } = processed!;

    // Save to DB
    const results = await pool.query(
      `UPDATE images SET cover = $1, thumbnail = $2 WHERE id = $3 RETURNING * ;`,
      [cover, thumbnail, id]
    );

    const images = await ImageHandler.urlify(results.rows[0]);

    return res.status(200).json(images);
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
    await ImageHandler.remove(image);

    // Delete from DB
    await pool.query(`DELETE FROM images WHERE id = $1;`, [id]);

    return res.status(204).json();
  } catch (e) {
    return res.status(400).json(e);
  }
};
