import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const requireCreator = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  if (req.user.role !== "creator" && req.user.role !== "admin") {
    res.status(403).json({ message: "Creator access required" });
    return;
  }
  next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
};
