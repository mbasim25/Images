import { Request } from "express";
import { Query } from "images";

// returns the pagination results
export const paginate = async (req: Request) => {
  const query: Query = req.query;
  const limit = query.limit || 20;
  const page = query.page || 1;
  const offset = (page - 1) * limit;

  return { limit, offset };
};
