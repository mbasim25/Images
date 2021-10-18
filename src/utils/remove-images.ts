import fs from "fs";
import { BASE_URL } from "./secrets";

export const remove = async (data: any) => {
  try {
    // Get the data
    const { thumbnail, cover } = data.rows[0];

    const length = BASE_URL?.length;

    // Remove base url
    const thumbName = await thumbnail.substr(length);
    const coverName = await cover.substr(length);

    // Delete the images
    fs.unlinkSync(`./storage/${thumbName}`);
    fs.unlinkSync(`./storage/${coverName}`);
  } catch (e) {
    console.log("Error deleting images", e);
  }
};
