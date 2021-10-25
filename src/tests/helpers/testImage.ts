import sharp from "sharp";

export const testImage = () => {
  const image = sharp({
    create: {
      width: 300,
      height: 200,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 0.5 },
    },
  })
    .png()
    .toBuffer();

  return image;
};
