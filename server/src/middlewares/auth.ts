import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as {
      id: string;
      role: string;
      email: string;
    };

    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Token invalide" });
  }
};
