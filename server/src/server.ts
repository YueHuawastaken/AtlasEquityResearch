import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { prisma } from "./config/prisma.js";
import { apiRouter } from "./routes/index.js";
import { authRouter } from "./routes/authRoutes.js";
import { adminRouter } from "./routes/adminRoutes.js";

export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL ?? "http://localhost:5173",
      credentials: true
    })
  );
  app.use(express.json({ limit: "2mb" }));

  app.use("/api", apiRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);

  app.get("/api/home", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [companyCount, memoCount, latestCompany, latestMemo] = await Promise.all([
        prisma.company.count(),
        prisma.investmentMemo.count(),
        prisma.company.findFirst({
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, ticker: true, sector: true, industry: true }
        }),
        prisma.investmentMemo.findFirst({
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            recommendation: true,
            company: { select: { name: true, ticker: true } }
          }
        })
      ]);

      res.json({
        stats: [
          { label: "Coverage", value: String(companyCount), detail: "Companies modeled" },
          { label: "Memos", value: String(memoCount), detail: "Published research notes" },
          { label: "Reports", value: "0", detail: "Industry and market views" },
          { label: "Downloads", value: "0", detail: "Files shared with users" }
        ],
        featured: {
          company: latestCompany,
          memo: latestMemo
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/healthz", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  return app;
}
