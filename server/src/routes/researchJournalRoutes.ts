import { type NextFunction, type Request, type Response, Router } from "express";
import { prisma } from "../config/prisma.js";
import { parsePagination } from "../utils/pagination.js";

export const researchJournalRouter = Router();

researchJournalRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
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
              { body: { contains: search, mode: "insensitive" as const } },
              { reflections: { contains: search, mode: "insensitive" as const } }
            ]
          }
        : {}),
      ...(companyId ? { companyId } : {})
    };

    const [total, items] = await Promise.all([
      prisma.researchJournal.count({ where }),
      prisma.researchJournal.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          slug: true,
          prompt: true,
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

researchJournalRouter.get("/:journalId", async (req: Request<{ journalId: string }>, res: Response, next: NextFunction) => {
  try {
    const item = await prisma.researchJournal.findFirst({
      where: { id: req.params.journalId, status: "published" },
      include: {
        company: true,
        author: { select: { id: true, name: true, email: true } },
        attachments: true
      }
    });

    if (!item) {
      return res.status(404).json({ message: "Research journal not found" });
    }

    res.json({ item });
  } catch (error) {
    next(error);
  }
});
