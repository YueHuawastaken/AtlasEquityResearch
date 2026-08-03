import { type NextFunction, type Response, Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/authMiddleware.js";

export const watchlistRouter = Router();

watchlistRouter.use(requireAuth);

watchlistRouter.get("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const items = await prisma.watchlistItem.findMany({
      where: { userId: req.user.id },
      orderBy: [{ createdAt: "desc" }],
      include: {
        company: {
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
        }
      }
    });

    res.json({ items });
  } catch (error) {
    next(error);
  }
});

watchlistRouter.post("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const companyId = typeof req.body?.companyId === "string" ? req.body.companyId : "";
    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }

    const item = await prisma.watchlistItem.upsert({
      where: { userId_companyId: { userId: req.user.id, companyId } },
      update: {},
      create: {
        userId: req.user.id,
        companyId
      }
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

watchlistRouter.delete("/:companyId", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;

    await prisma.watchlistItem.delete({
      where: {
        userId_companyId: {
          userId: req.user.id,
          companyId
        }
      }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
