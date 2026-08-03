import { type Request, type Response, Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { isCloudinaryReady, uploadBufferToCloudinary } from "../services/cloudinary.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

export const uploadRouter = Router();

uploadRouter.post("/", requireAuth, requireRole(["admin", "editor"]), upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  if (!isCloudinaryReady()) {
    return res.status(503).json({ message: "Cloudinary is not configured" });
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, {
    fileName: req.file.originalname.replace(/\.[^.]+$/, ""),
    mimeType: req.file.mimetype
  });

  return res.status(201).json({
    item: {
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type
    }
  });
});
