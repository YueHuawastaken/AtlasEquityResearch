import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

const contactMessageSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().min(2).max(180),
  message: z.string().min(20).max(5000)
});

export const contactRouter = Router();

contactRouter.post("/", async (req, res, next) => {
  try {
    const parsed = contactMessageSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid contact payload", issues: parsed.error.flatten() });
    }

    const item = await prisma.contactMessage.create({
      data: parsed.data
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});
