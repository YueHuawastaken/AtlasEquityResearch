import { Router } from "express";
import multer from "multer";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { deleteFromCloudinary, isCloudinaryReady, uploadBufferToCloudinary } from "../services/cloudinary.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

type AttachmentScope = "company" | "memo" | "industryReport" | "marketOutlook" | "researchJournal";

function resolveScopeField(scope: AttachmentScope) {
  switch (scope) {
    case "company":
      return "companyId";
    case "memo":
      return "memoId";
    case "industryReport":
      return "industryReportId";
    case "marketOutlook":
      return "marketOutlookId";
    case "researchJournal":
      return "researchJournalId";
  }
}

function resolveScopeWhere(scope: AttachmentScope, parentId: string) {
  const key = resolveScopeField(scope);
  return { [key]: parentId } as Record<string, string>;
}

function isAttachmentScope(value: unknown): value is AttachmentScope {
  return value === "company" || value === "memo" || value === "industryReport" || value === "marketOutlook" || value === "researchJournal";
}

export const adminAttachmentRouter = Router();

adminAttachmentRouter.use(requireAuth, requireRole(["admin", "editor"]));

adminAttachmentRouter.get("/", async (req: any, res: any, next: any) => {
  try {
    const scope = typeof req.query.scope === "string" ? req.query.scope : undefined;
    const parentId = typeof req.query.parentId === "string" ? req.query.parentId : undefined;

    if (!scope || !parentId || !isAttachmentScope(scope)) {
      return res.status(400).json({ message: "scope and parentId are required" });
    }

    const items = await prisma.attachment.findMany({
      where: resolveScopeWhere(scope, parentId),
      orderBy: [{ createdAt: "desc" }]
    });

    res.json({ items });
  } catch (error) {
    next(error);
  }
});

adminAttachmentRouter.post("/", upload.single("file"), async (req: any, res: any, next: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    if (!isCloudinaryReady()) {
      const missing = [
        !env.CLOUDINARY_CLOUD_NAME ? "CLOUDINARY_CLOUD_NAME" : null,
        !env.CLOUDINARY_API_KEY ? "CLOUDINARY_API_KEY" : null,
        !env.CLOUDINARY_API_SECRET ? "CLOUDINARY_API_SECRET" : null
      ].filter(Boolean);

      return res.status(503).json({
        message: "Cloudinary is not configured",
        missing
      });
    }

    const scope = req.body.scope as AttachmentScope | undefined;
    const parentId = typeof req.body.parentId === "string" ? req.body.parentId : undefined;

    if (!scope || !parentId) {
      return res.status(400).json({ message: "scope and parentId are required" });
    }

    if (!isAttachmentScope(scope)) {
      return res.status(400).json({ message: "Invalid attachment scope" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      fileName: req.file.originalname.replace(/\.[^.]+$/, ""),
      mimeType: req.file.mimetype
    });

    const data = {
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      url: result.secure_url,
      publicId: result.public_id,
      ...(resolveScopeField(scope) === "companyId" ? { companyId: parentId } : {}),
      ...(resolveScopeField(scope) === "memoId" ? { memoId: parentId } : {}),
      ...(resolveScopeField(scope) === "industryReportId" ? { industryReportId: parentId } : {}),
      ...(resolveScopeField(scope) === "marketOutlookId" ? { marketOutlookId: parentId } : {}),
      ...(resolveScopeField(scope) === "researchJournalId" ? { researchJournalId: parentId } : {})
    };

    const item = await prisma.attachment.create({ data });

    res.status(201).json({ item });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cloudinary")) {
      return res.status(502).json({ message: error.message });
    }

    next(error);
  }
});

adminAttachmentRouter.delete("/:attachmentId", async (req: any, res: any, next: any) => {
  try {
    const attachment = await prisma.attachment.findUnique({ where: { id: req.params.attachmentId } });

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    await deleteFromCloudinary(attachment.publicId, attachment.fileType);
    await prisma.attachment.delete({ where: { id: attachment.id } });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
