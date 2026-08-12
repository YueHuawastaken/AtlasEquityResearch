import { type NextFunction, type Request, type Response, Router } from "express";
import { prisma } from "../config/prisma.js";

export const searchRouter = Router();

searchRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

    if (!query) {
      return res.json({ items: [] });
    }

    const [companies, memos, reports, outlooks, valuationModels] = await Promise.all([
      prisma.company.findMany({
        where: {
          status: "published",
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { ticker: { contains: query, mode: "insensitive" } },
            { industry: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 5,
        select: { id: true, name: true, ticker: true, status: true, createdAt: true }
      }),
      prisma.investmentMemo.findMany({
        where: {
          status: "published",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { executiveSummary: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 5,
        select: { id: true, title: true, slug: true, status: true, publishedAt: true, company: { select: { name: true, ticker: true } } }
      }),
      prisma.industryReport.findMany({
        where: {
          status: "published",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { executiveSummary: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 5,
        select: { id: true, title: true, slug: true, status: true, publishedAt: true, company: { select: { name: true, ticker: true } } }
      }),
      prisma.marketOutlook.findMany({
        where: {
          status: "published",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { executiveSummary: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 5,
        select: { id: true, title: true, slug: true, status: true, publishedAt: true, company: { select: { name: true, ticker: true } } }
      }),
      prisma.valuationModel.findMany({
        where: {
          status: "published",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { valuationConclusion: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 5,
        select: { id: true, title: true, slug: true, status: true, publishedAt: true, company: { select: { name: true, ticker: true } } }
      })
    ]);

    res.json({
      items: [
        ...companies.map((item: (typeof companies)[number]) => ({ id: item.id, type: "company" as const, title: item.name, subtitle: item.ticker, slug: item.ticker, status: item.status, publishedAt: item.createdAt.toISOString() })),
        ...memos.map((item: (typeof memos)[number]) => ({ id: item.id, type: "memo" as const, title: item.title, subtitle: `${item.company.name} (${item.company.ticker})`, slug: item.slug, status: item.status, publishedAt: item.publishedAt?.toISOString() ?? null })),
        ...reports.map((item: (typeof reports)[number]) => ({ id: item.id, type: "industry-report" as const, title: item.title, subtitle: item.company ? `${item.company.name} (${item.company.ticker})` : "Industry report", slug: item.slug, status: item.status, publishedAt: item.publishedAt?.toISOString() ?? null })),
        ...outlooks.map((item: (typeof outlooks)[number]) => ({ id: item.id, type: "market-outlook" as const, title: item.title, subtitle: item.company ? `${item.company.name} (${item.company.ticker})` : item.slug, slug: item.slug, status: item.status, publishedAt: item.publishedAt?.toISOString() ?? null })),
        ...valuationModels.map((item: (typeof valuationModels)[number]) => ({ id: item.id, type: "valuation-model" as const, title: item.title, subtitle: item.company ? `${item.company.name} (${item.company.ticker})` : item.slug, slug: item.slug, status: item.status, publishedAt: item.publishedAt?.toISOString() ?? null }))
      ]
    });
  } catch (error) {
    next(error);
  }
});
