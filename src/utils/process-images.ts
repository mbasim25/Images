import { Request } from "express";
import sharp from "sharp";
import fs from "fs";
import { BASE_URL } from "./secrets";

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
  const thumb = `${BASE_URL}${thumbName}`;
  const cover = `${BASE_URL}${coverName}`;

  try {
    // Resize the images

    await sharp(req.file?.buffer)
      .resize({ width: 285, height: 380 })
      .toFile(`./storage/${thumbName}`);

    // Fill, Contain or Inside options may be added to cover images to give the desired results
    await sharp(req.file?.buffer)
      .resize({ width: 820, height: 312 })
      .toFile(`./storage/${coverName}`);

    return { thumb, cover };
  } catch (e) {
    console.log("Image processing failed", e);
  }
};
