import fs from "fs";

export const remove = async (data: any) => {
  try {
    // Get the data
    const { thumbnail, cover } = data.rows[0];

    // Remove base url
    const thumbName = await thumbnail.substr(22);
    const coverName = await cover.substr(22);

    // Delete the images
    fs.unlinkSync(`./storage/${thumbName}`);
    fs.unlinkSync(`./storage/${coverName}`);
  } catch (e) {
    console.log("Error deleting images", e);
  }
};
