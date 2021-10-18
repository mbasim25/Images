import { param, query } from "express-validator";

// Validate the id
export const id = [param("id").isUUID().withMessage("Must provide a valid id")];

// Validate pagination
export const pagination = [
  query("limit").optional().isInt().withMessage("Limit must be a valid number"),
  query("page").optional().isInt().withMessage("Page must be a valid number"),
];
