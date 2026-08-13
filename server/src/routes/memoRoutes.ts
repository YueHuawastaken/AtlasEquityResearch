import { type NextFunction, type Request, type Response, Router } from "express";
import { prisma } from "../config/prisma.js";
import { normalizeRecommendation } from "../utils/filters.js";
import { parsePagination } from "../utils/pagination.js";

export const memoRouter = Router();

memoRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const companyId = typeof req.query.companyId === "string" ? req.query.companyId.trim() : "";
    const recommendation = normalizeRecommendation(typeof req.query.recommendation === "string" ? req.query.recommendation : null);
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
      ...(companyId ? { companyId } : {}),
      ...(recommendation ? { recommendation } : {})
    };

    const [total, memos] = await Promise.all([
      prisma.investmentMemo.count({ where }),
      prisma.investmentMemo.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          recommendation: true,
          targetPrice: true,
          currentPrice: true,
          expectedReturn: true,
          convictionLevel: true,
          status: true,
          publishedAt: true,
          company: {
            select: {
              id: true,
              name: true,
              ticker: true
            }
          }
        }
      })
    ]);

    res.json({
      items: memos,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    });
  } catch (error) {
    next(error);
  }
});

memoRouter.get("/:memoId", async (req: Request<{ memoId: string }>, res: Response, next: NextFunction) => {
  try {
    const memo = await prisma.investmentMemo.findFirst({
      where: { OR: [{ id: req.params.memoId }, { slug: req.params.memoId }], status: "published" },
      include: {
        company: true,
        tags: { include: { tag: true } },
        attachments: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            url: true
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!memo) {
      return res.status(404).json({ message: "Memo not found" });
    }

    res.json({ item: memo });
  } catch (error) {
    next(error);
  }
});
