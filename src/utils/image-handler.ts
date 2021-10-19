import { Request } from "express";
import fs from "fs";
import sharp from "sharp";
import { Image } from "../types";

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
        .resize({ width: 285, height: 380, fit: "fill" })
        .toFile(`./storage/${thumbnail}`);

      // Cover image
      await sharp(req.file?.path)
        .resize({ width: 820, height: 312, fit: "fill", position: "entropy" })
        .toFile(`./storage/${cover}`);

      return { thumbnail, cover };
    } catch (e) {
      console.log("Image processing failed", e);
    }
  };

  // Delete images
  static remove = async (data: Image) => {
    try {
      // Get the data
      const { thumbnail, cover } = data;

      // Delete the images
      fs.unlinkSync(`./storage/${thumbnail}`);
      fs.unlinkSync(`./storage/${cover}`);
    } catch (e) {
      console.log("Error deleting images", e);
    }
  };
}

export default ImageHandler;
