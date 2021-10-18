import { param } from "express-validator";

// Validate the id
export const validateId = [
  param("id").isUUID().withMessage("Must provide a valid id"),
];
