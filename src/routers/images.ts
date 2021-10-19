import { Request, Response, Router } from "express";
import { images } from "../controllers/";
import { upload } from "../utils/";
import { validateRequest } from "../middlewares";
import { validate } from "../validators";
import { NotFoundError } from "../errors";

const router = Router();

// Get all images
router.get("/", validate.pagination, validateRequest, images.list);

// Get an image by id
router.get("/:id", validate.id, validateRequest, images.retrieve);

// Create images
router.post("/create", upload.single("image"), images.create);

// Update images
router.patch(
  "/:id",
  validate.id,
  validateRequest,
  upload.single("image"),
  images.update
);

// Delete images
router.delete("/:id", validate.id, validateRequest, images.destroy);

// Returns a 404 for not found routes
router.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

export default router;
