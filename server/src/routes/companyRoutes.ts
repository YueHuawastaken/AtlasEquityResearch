import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { parsePagination } from "../utils/pagination.js";

export const companyRouter = Router();

companyRouter.get("/", async (req, res, next) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const sector = typeof req.query.sector === "string" ? req.query.sector.trim() : "";
    const { page, pageSize } = parsePagination(new URLSearchParams(req.query as Record<string, string>));

    const where = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { ticker: { contains: search, mode: "insensitive" as const } },
              { industry: { contains: search, mode: "insensitive" as const } }
            ]
          }
        : {}),
      ...(sector ? { sector: { equals: sector, mode: "insensitive" as const } } : {}),
      status: "published" as const
    };

    const [total, companies] = await Promise.all([
      prisma.company.count({ where }),
      prisma.company.findMany({
        where,
        orderBy: [{ status: "asc" }, { name: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          ticker: true,
          exchange: true,
          sector: true,
          industry: true,
          status: true,
          description: true,
          _count: { select: { memos: true } }
        }
      })
    ]);

    res.json({
      items: companies,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    });
  } catch (error) {
    next(error);
  }
});

companyRouter.get("/:companyId", async (req, res, next) => {
  try {
    const company = await prisma.company.findFirst({
      where: { id: req.params.companyId, status: "published" },
      include: {
        _count: {
          select: {
            memos: true,
            reports: true,
            outlooks: true,
            valuationModels: true
          }
        },
        memos: {
          where: { status: "published" },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            recommendation: true,
            status: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true
          }
        },
        reports: {
          where: { status: "published" },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true
          }
        },
        outlooks: {
          where: { status: "published" },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            month: true,
            status: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true
          }
        },
        valuationModels: {
          where: { status: "published" },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            fairValue: true,
            currentSharePrice: true,
            upsideDownside: true,
            status: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ item: company });
  } catch (error) {
    next(error);
  }
});
