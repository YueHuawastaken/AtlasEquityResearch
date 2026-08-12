import { Router } from "express";
import { companyRouter } from "./companyRoutes.js";
import { healthRouter } from "./healthRoutes.js";
import { industryReportRouter } from "./industryReportRoutes.js";
import { marketOutlookRouter } from "./marketOutlookRoutes.js";
import { memoRouter } from "./memoRoutes.js";
import { searchRouter } from "./searchRoutes.js";
import { valuationModelRouter } from "./valuationModelRoutes.js";
import { adminAttachmentRouter } from "./adminAttachmentRoutes.js";
import { contactRouter } from "./contactRoutes.js";
import { uploadRouter } from "./uploadRoutes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/companies", companyRouter);
apiRouter.use("/memos", memoRouter);
apiRouter.use("/industry-reports", industryReportRouter);
apiRouter.use("/market-outlooks", marketOutlookRouter);
apiRouter.use("/valuation-models", valuationModelRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/contact", contactRouter);
apiRouter.use("/uploads", uploadRouter);
apiRouter.use("/admin/attachments", adminAttachmentRouter);
