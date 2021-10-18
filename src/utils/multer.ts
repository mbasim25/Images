import multer from "multer";

const storage = multer.diskStorage({});

// Multer storage and validation for image type
export const upload = multer({
  storage,
  // File type
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Please enter a supported image type"));
    }
  },
  // File size
  limits: { fileSize: 2 * 1024 * 1024 },
});
