import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

// Error handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializedErrors() });
  }

  console.error(err);

  let message = err.message || "something went wrong";
  return res.status(400).json({ errors: [{ message }] });
};
