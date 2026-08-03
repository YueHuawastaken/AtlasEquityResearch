import { type NextFunction, type Request, type Response, Router } from "express";
import { prisma } from "../config/prisma.js";
import { normalizeEntityStatus } from "../utils/filters.js";
import { parsePagination } from "../utils/pagination.js";

export const marketOutlookRouter = Router();

marketOutlookRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const companyId = typeof req.query.companyId === "string" ? req.query.companyId.trim() : "";
    const status = normalizeEntityStatus(typeof req.query.status === "string" ? req.query.status : null);
    const { page, pageSize } = parsePagination(new URLSearchParams(req.query as Record<string, string>));

    const where = {
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { slug: { contains: search, mode: "insensitive" as const } },
              { executiveSummary: { contains: search, mode: "insensitive" as const } }
            ]
          }
        : {}),
      ...(companyId ? { companyId } : {}),
      ...(status ? { status } : {})
    };

    const [total, items] = await Promise.all([
      prisma.marketOutlook.count({ where }),
      prisma.marketOutlook.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          month: true,
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

marketOutlookRouter.get("/:outlookId", async (req: Request<{ outlookId: string }>, res: Response, next: NextFunction) => {
  try {
    const item = await prisma.marketOutlook.findUnique({
      where: { id: req.params.outlookId },
      include: {
        company: true,
        author: { select: { id: true, name: true, email: true } },
        attachments: true
      }
    });

    if (!item) {
      return res.status(404).json({ message: "Market outlook not found" });
    }

    res.json({ item });
  } catch (error) {
    next(error);
  }
});
