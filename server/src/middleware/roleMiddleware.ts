import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./authMiddleware.js";

const roleRank = {
  viewer: 0,
  editor: 1,
  admin: 2
} as const;

export function requireRole(allowedRoles: Array<"admin" | "editor" | "viewer">) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRank = roleRank[req.user.role];
    const hasAccess = allowedRoles.some((role) => roleRank[role] <= userRank);

    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
}
