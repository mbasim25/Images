import { Request, Response } from "express";
import { v4 } from "uuid";
import { ImageHandler, paginate } from "../utils";
import { pool } from "../../db";
import { QueryResult } from "pg";
import { BASE_URL } from "../utils/secrets";
import { Image } from "../types";
import { sql } from ".";

// Get all images
export const list = async (req: Request, res: Response) => {
  try {
    // Pagination
    const query = await paginate(req);

    // Get all images
    const results: QueryResult<Image> = await pool.query(sql.list, [
      BASE_URL,
      query.offset,
      query.limit,
    ]);

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

    // Get the image
    const image: QueryResult<Image> = await pool.query(sql.retrieve, [
      BASE_URL,
      id,
    ]);

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
    const results: QueryResult<Image> = await pool.query(sql.create, [
      id,
      cover,
      thumbnail,
      BASE_URL,
    ]);

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
    const { rows } = await pool.query(sql.retrieve, [id]);

    if (!rows[0]) {
      return res.status(404).json("Image not found");
    }

    // Remove the old images
    await ImageHandler.remove(rows[0]);

    // Process the new images
    const { cover, thumbnail } = await ImageHandler.process(req, id)!;

    // Update, Save to DB, Return results after concatenation
    const results: QueryResult<Image> = await pool.query(sql.update, [
      cover,
      thumbnail,
      id,
      BASE_URL,
    ]);

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
    const { rows } = await pool.query(sql.retrieve, [id]);

    if (!rows[0]) {
      return res.status(404).json("Image not found");
    }

    // Remove the images
    await ImageHandler.remove(rows[0]);

    // Delete from DB
    await pool.query(sql.destroy, [id]);

    return res.status(204).json();
  } catch (e) {
    return res.status(400).json(e);
  }
};
