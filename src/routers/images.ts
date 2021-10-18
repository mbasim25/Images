import { Request, Response, Router } from "express";
import { images } from "../controllers/";
import { upload } from "../utils/";
import { validateRequest } from "../middlewares";
import { validateId } from "../validators/images";
import { NotFoundError } from "../errors";

const router = Router();

// Get all images
router.get("/", images.list);

// Upload images
router.post("/create", upload.single("image"), images.create);

// Get an image by id
router.get("/:id", validateId, validateRequest, images.retrieve);

// Update images
router.patch(
  "/:id",
  validateId,
  validateRequest,
  upload.single("image"),
  images.update
);

// Delete images
router.delete("/:id", validateId, validateRequest, images.destroy);

// Returns a 404 for not found routes
router.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

export default router;
