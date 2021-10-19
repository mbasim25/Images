import { Request, Response } from "express";
import { v4 } from "uuid";
import { ImageHandler } from "../utils";
import { pool } from "../../db";
import { QueryResult } from "pg";
import { BASE_URL } from "../utils/secrets";
import { Query } from "../types";

// Get all images
export const list = async (req: Request, res: Response) => {
  try {
    // Pagination
    const query: Query = req.query;
    const limit = query.limit || 20;
    const page = query.page || 1;
    const offset = (page - 1) * limit;

    // Get all images and manipulate cover and thumbnail
    const results: QueryResult = await pool.query(
      `SELECT *,
       CONCAT($1 :: VARCHAR,cover) AS cover,
       CONCAT($1,thumbnail) AS thumbnail
       FROM images OFFSET $2 LIMIT $3;`,
      [BASE_URL, offset, limit]
    );

    const images = results.rows;

    return res.status(200).json(images);
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};

// Get a single image by id
export const retrieve = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const image = await pool.query(
      `SELECT *,
       CONCAT($1 :: VARCHAR,cover) AS cover,
       CONCAT($1,thumbnail) AS thumbnail
       FROM images WHERE id = $2`,
      [BASE_URL, id]
    );

    if (!image.rows[0]) {
      return res.status(404).json("Image not found");
    }

    return res.status(200).json(image.rows[0]);
  } catch (e) {
    console.log(e);
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

    // Save to DB and return the values after concatenation
    const results = await pool.query(
      `INSERT INTO images(id, cover, thumbnail) 
       VALUES ($1, $2, $3) RETURNING *, 
       CONCAT($4 :: VARCHAR,cover) AS cover,
       CONCAT($4,thumbnail) AS thumbnail;`,
      [id, cover, thumbnail, BASE_URL]
    );

    const image = results.rows[0];

    return res.status(201).json(image);
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
    const { rows } = await pool.query(`SELECT * FROM images WHERE id = $1;`, [
      id,
    ]);

    if (!rows[0]) {
      return res.status(404).json("Image not found");
    }

    // Remove the old images
    await ImageHandler.remove(rows[0]);

    // Process the new images
    const processed = await ImageHandler.process(req, id);
    const { cover, thumbnail } = processed!;

    // Update, Save to DB, Return results after concatenation
    const results = await pool.query(
      `UPDATE images SET cover = $1, thumbnail = $2 
       WHERE id = $3 RETURNING *, 
       CONCAT($4 :: VARCHAR,cover) AS cover,
       CONCAT($4,thumbnail) AS thumbnail; ;`,
      [cover, thumbnail, id, BASE_URL]
    );

    const image = results.rows[0];

    return res.status(200).json(image);
  } catch (e) {
    return res.status(400).json(e);
  }
};

// Delete an image
export const destroy = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Check that the image exists
    const { rows } = await pool.query(`SELECT * FROM images WHERE id = $1;`, [
      id,
    ]);

    if (!rows[0]) {
      return res.status(404).json("Image not found");
    }

    // Remove the images
    await ImageHandler.remove(rows[0]);

    // Delete from DB
    await pool.query(`DELETE FROM images WHERE id = $1;`, [id]);

    return res.status(204).json();
  } catch (e) {
    return res.status(400).json(e);
  }
};
