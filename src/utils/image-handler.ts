import { Request } from "express";
import fs from "fs";
import sharp from "sharp";
import { BASE_URL } from "./secrets";

class ImageHandler {
  // Process and save the images
  static process = async (req: Request, id: string) => {
    // check if the folder exists
    fs.access("./storage", (e) => {
      if (e) {
        fs.mkdirSync("./storage");
      }
    });

    // Image names
    const name = req.file?.originalname.split(" ").join("-");
    const thumbnail = `${id}-thumbnail-${name}`;
    const cover = `${id}-cover-${name}`;

    try {
      // Resize Thumbnail image
      await sharp(req.file?.path)
        .resize({ width: 285, height: 380 })
        .toFile(`./storage/${thumbnail}`);

      // Cover image
      // Fill, Contain or Inside, options for covers
      await sharp(req.file?.path)
        .resize({ width: 820, height: 312 })
        .toFile(`./storage/${cover}`);

      return { thumbnail, cover };
    } catch (e) {
      console.log("Image processing failed", e);
    }
  };

  // Delete images
  static remove = async (data: any) => {
    try {
      // Get the data
      const { thumbnail, cover } = data.rows[0];

      // Delete the images
      fs.unlinkSync(`./storage/${thumbnail}`);
      fs.unlinkSync(`./storage/${cover}`);
    } catch (e) {
      console.log("Error deleting images", e);
    }
  };

  // Return the full path for the images
  static urlify = async (data: any) => {
    data.thumbnail = BASE_URL + data.thumbnail;
    data.cover = BASE_URL + data.cover;

    return data;
  };
}

export default ImageHandler;
