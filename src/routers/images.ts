import { Router } from "express";
import { images } from "../controllers/";
import { upload } from "../utils/";

const router = Router();

// Get all images
router.get("/", images.list);

// Upload images
router.post("/create", upload.single("image"), images.create);

// Get an image by id
router.get("/:id", images.retrieve);

export default router;
