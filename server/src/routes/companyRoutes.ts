import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { normalizeEntityStatus } from "../utils/filters.js";
import { parsePagination } from "../utils/pagination.js";

export const companyRouter = Router();

companyRouter.get("/", async (req, res, next) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const sector = typeof req.query.sector === "string" ? req.query.sector.trim() : "";
    const status = normalizeEntityStatus(typeof req.query.status === "string" ? req.query.status : null);
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
      ...(status ? { status } : {})
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
    const company = await prisma.company.findUnique({
      where: { id: req.params.companyId },
      include: {
        memos: {
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
