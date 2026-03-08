import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.js";

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    return next();
  };
};
