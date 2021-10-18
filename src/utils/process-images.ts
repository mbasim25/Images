import { Request } from "express";
import sharp from "sharp";
import fs from "fs";

export const process = async (req: Request, id: any) => {
  // check if the folder exists
  fs.access("./storage", (e) => {
    if (e) {
      fs.mkdirSync("./storage");
    }
  });

  // Image names
  const name = req.file?.originalname.split(" ").join("-");
  const thumbName = `${id}-thumb-${name}`;
  const coverName = `${id}-cover-${name}`;

  // Image urls
  const base = `http://localhost:8080`;
  const thumb = `${base}/${thumbName}`;
  const cover = `${base}/${coverName}`;

  try {
    // Resize the images

    await sharp(req.file?.buffer)
      .resize({ width: 285, height: 380 })
      .toFile(`./storage/${thumbName}`);

    await sharp(req.file?.buffer)
      .resize({ width: 820, height: 312 })
      .toFile(`./storage/${coverName}`);

    return { thumb, cover };
  } catch (e) {
    console.log("Image processing failed", e);
  }
};
