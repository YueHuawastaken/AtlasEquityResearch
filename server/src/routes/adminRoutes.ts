import { type NextFunction, type Request, type Response, Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  companyUpsertSchema,
  contactMessageStatusSchema,
  industryReportUpsertSchema,
  marketOutlookUpsertSchema,
  memoUpsertSchema,
  valuationModelUpsertSchema
} from "../validators/adminSchemas.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(["admin", "editor"]));

adminRouter.get("/overview", async (_req, res, next) => {
  try {
    const [companyCount, memoCount, reportCount, outlookCount, valuationModelCount, draftCount, contactCount] = await Promise.all([
      prisma.company.count(),
      prisma.investmentMemo.count(),
      prisma.industryReport.count(),
      prisma.marketOutlook.count(),
      prisma.valuationModel.count(),
      prisma.investmentMemo.count({ where: { status: "draft" } }),
      prisma.contactMessage.count()
    ]);

    res.json({
      stats: { companyCount, memoCount, reportCount, outlookCount, valuationModelCount, draftCount, contactCount }
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/contact-messages", async (req, res, next) => {
  try {
    const status = typeof req.query.status === "string" && req.query.status.trim() ? req.query.status.trim() : undefined;
    const search = typeof req.query.search === "string" && req.query.search.trim() ? req.query.search.trim() : undefined;

    const items = await prisma.contactMessage.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { subject: { contains: search, mode: "insensitive" } },
                { message: { contains: search, mode: "insensitive" } }
              ]
            }
          : {})
      },
      orderBy: [{ createdAt: "desc" }],
      take: 50
    });

    res.json({ items });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/contact-messages/:messageId", async (req, res, next) => {
  try {
    const parsed = contactMessageStatusSchema.safeParse(req.body?.status);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid message status", issues: parsed.error.flatten() });
    }

    const item = await prisma.contactMessage.update({
      where: { id: req.params.messageId },
      data: { status: parsed.data }
    });

    res.json({ item });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/companies", async (_req, res, next) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: [{ updatedAt: "desc" }],
      include: { _count: { select: { memos: true } } }
    });

    res.json({ items: companies });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/companies", async (req, res, next) => {
  try {
    const parsed = companyUpsertSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid company payload", issues: parsed.error.flatten() });
    }

    const company = await prisma.company.create({
      data: parsed.data
    });

    res.status(201).json({ item: company });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/companies/:companyId", async (req, res, next) => {
  try {
    const parsed = companyUpsertSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid company payload", issues: parsed.error.flatten() });
    }

    const company = await prisma.company.update({
      where: { id: req.params.companyId },
      data: parsed.data
    });

    res.json({ item: company });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/companies/:companyId", async (req: Request<{ companyId: string }>, res: Response, next: NextFunction) => {
  try {
    await prisma.company.delete({ where: { id: req.params.companyId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/memos", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const memos = await prisma.investmentMemo.findMany({
      orderBy: [{ updatedAt: "desc" }],
      include: {
        company: { select: { id: true, name: true, ticker: true } }
      }
    });

    res.json({ items: memos });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/memos", async (req, res, next) => {
  try {
    const parsed = memoUpsertSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid memo payload", issues: parsed.error.flatten() });
    }

    const memo = await prisma.investmentMemo.create({
      data: {
        ...parsed.data,
        targetPrice: parsed.data.targetPrice,
        currentPrice: parsed.data.currentPrice,
        expectedReturn: parsed.data.expectedReturn,
        publishedAt: parsed.data.status === "published" ? new Date(parsed.data.publishedAt ?? Date.now()) : parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null
      }
    });

    res.status(201).json({ item: memo });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/memos/:memoId", async (req, res, next) => {
  try {
    const parsed = memoUpsertSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid memo payload", issues: parsed.error.flatten() });
    }

    const memo = await prisma.investmentMemo.update({
      where: { id: req.params.memoId },
      data: {
        ...parsed.data,
        publishedAt: parsed.data.status === "published"
          ? new Date(parsed.data.publishedAt ?? Date.now())
          : parsed.data.publishedAt
            ? new Date(parsed.data.publishedAt)
            : undefined
      }
    });

    res.json({ item: memo });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/memos/:memoId", async (req, res, next) => {
  try {
    await prisma.investmentMemo.delete({ where: { id: req.params.memoId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

function parseNullablePublishedAt(value: string | null | undefined) {
  if (!value) return undefined;
  return new Date(value);
}

function parseCreatePublishedAt(status: string, value: string | null | undefined) {
  if (status !== "published") {
    return value ? new Date(value) : null;
  }

  return new Date(value ?? Date.now());
}

adminRouter.get("/industry-reports", async (_req, res, next) => {
  try {
    const items = await prisma.industryReport.findMany({
      orderBy: [{ updatedAt: "desc" }],
      include: { company: { select: { id: true, name: true, ticker: true } } }
    });

    res.json({ items });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/industry-reports", async (req, res, next) => {
  try {
    const parsed = industryReportUpsertSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid industry report payload", issues: parsed.error.flatten() });
    }

    const item = await prisma.industryReport.create({
      data: {
        ...parsed.data,
        companyId: parsed.data.companyId ?? null,
        authorId: parsed.data.authorId ?? null,
        publishedAt: parseCreatePublishedAt(parsed.data.status, parsed.data.publishedAt)
      }
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/industry-reports/:reportId", async (req, res, next) => {
  try {
    const parsed = industryReportUpsertSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid industry report payload", issues: parsed.error.flatten() });
    }

    const item = await prisma.industryReport.update({
      where: { id: req.params.reportId },
      data: {
        ...parsed.data,
        companyId: parsed.data.companyId === undefined ? undefined : parsed.data.companyId ?? null,
        authorId: parsed.data.authorId === undefined ? undefined : parsed.data.authorId ?? null,
        publishedAt: parsed.data.publishedAt === undefined ? undefined : parseNullablePublishedAt(parsed.data.publishedAt)
      }
    });

    res.json({ item });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/industry-reports/:reportId", async (req, res, next) => {
  try {
    await prisma.industryReport.delete({ where: { id: req.params.reportId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/market-outlooks", async (_req, res, next) => {
  try {
    const items = await prisma.marketOutlook.findMany({
      orderBy: [{ updatedAt: "desc" }],
      include: { company: { select: { id: true, name: true, ticker: true } } }
    });

    res.json({ items });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/market-outlooks", async (req, res, next) => {
  try {
    const parsed = marketOutlookUpsertSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid market outlook payload", issues: parsed.error.flatten() });
    }

    const item = await prisma.marketOutlook.create({
      data: {
        ...parsed.data,
        companyId: parsed.data.companyId ?? null,
        authorId: parsed.data.authorId ?? null,
        publishedAt: parseCreatePublishedAt(parsed.data.status, parsed.data.publishedAt)
      }
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/market-outlooks/:outlookId", async (req, res, next) => {
  try {
    const parsed = marketOutlookUpsertSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid market outlook payload", issues: parsed.error.flatten() });
    }

    const item = await prisma.marketOutlook.update({
      where: { id: req.params.outlookId },
      data: {
        ...parsed.data,
        companyId: parsed.data.companyId === undefined ? undefined : parsed.data.companyId ?? null,
        authorId: parsed.data.authorId === undefined ? undefined : parsed.data.authorId ?? null,
        publishedAt: parsed.data.publishedAt === undefined ? undefined : parseNullablePublishedAt(parsed.data.publishedAt)
      }
    });

    res.json({ item });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/market-outlooks/:outlookId", async (req, res, next) => {
  try {
    await prisma.marketOutlook.delete({ where: { id: req.params.outlookId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/valuation-models", async (_req, res, next) => {
  try {
    const items = await prisma.valuationModel.findMany({
      orderBy: [{ updatedAt: "desc" }],
      include: { company: { select: { id: true, name: true, ticker: true } } }
    });

    res.json({ items });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/valuation-models", async (req, res, next) => {
  try {
    const parsed = valuationModelUpsertSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid valuation model payload", issues: parsed.error.flatten() });
    }

    const item = await prisma.valuationModel.create({
      data: {
        ...parsed.data,
        authorId: parsed.data.authorId ?? null,
        publishedAt: parseCreatePublishedAt(parsed.data.status, parsed.data.publishedAt)
      }
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/valuation-models/:valuationModelId", async (req, res, next) => {
  try {
    const parsed = valuationModelUpsertSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid valuation model payload", issues: parsed.error.flatten() });
    }

    const item = await prisma.valuationModel.update({
      where: { id: req.params.valuationModelId },
      data: {
        ...parsed.data,
        authorId: parsed.data.authorId === undefined ? undefined : parsed.data.authorId ?? null,
        publishedAt: parsed.data.publishedAt === undefined ? undefined : parseNullablePublishedAt(parsed.data.publishedAt)
      }
    });

    res.json({ item });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/valuation-models/:valuationModelId", async (req, res, next) => {
  try {
    await prisma.valuationModel.delete({ where: { id: req.params.valuationModelId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
