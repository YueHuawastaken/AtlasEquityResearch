import { type NextFunction, type Request, type Response, Router } from "express";
import { prisma } from "../config/prisma.js";
import { parsePagination } from "../utils/pagination.js";

export const industryReportRouter = Router();

industryReportRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const companyId = typeof req.query.companyId === "string" ? req.query.companyId.trim() : "";
    const { page, pageSize } = parsePagination(new URLSearchParams(req.query as Record<string, string>));

    const where = {
      status: "published" as const,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { slug: { contains: search, mode: "insensitive" as const } },
              { executiveSummary: { contains: search, mode: "insensitive" as const } }
            ]
          }
        : {}),
      ...(companyId ? { companyId } : {})
    };

    const [total, items] = await Promise.all([
      prisma.industryReport.count({ where }),
      prisma.industryReport.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          executiveSummary: true,
          status: true,
          publishedAt: true,
          company: { select: { id: true, name: true, ticker: true } }
        }
      })
    ]);

    res.json({ items, page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
  } catch (error) {
    next(error);
  }
});

industryReportRouter.get("/:reportId", async (req: Request<{ reportId: string }>, res: Response, next: NextFunction) => {
  try {
    const item = await prisma.industryReport.findFirst({
      where: { OR: [{ id: req.params.reportId }, { slug: req.params.reportId }], status: "published" },
      include: {
        company: true,
        author: { select: { id: true, name: true, email: true } },
        attachments: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            url: true
          }
        }
      }
    });

    if (!item) {
      return res.status(404).json({ message: "Industry report not found" });
    }

    res.json({ item });
  } catch (error) {
    next(error);
  }
});
