import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { AuthRequest } from "../middlewares/auth.js";
import { User } from "../models/user.model.js";
import { signAccessToken, signRefreshToken } from "../services/token.service.js";

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Données invalides", issues: parsed.error.issues });
  }

  const { firstName, lastName, email, password, phone } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email déjà utilisé" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashed,
    role: "client",
  });

  const payload = { id: user._id.toString(), role: user.role, email: user.email };
  const token = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return res.status(201).json({
    token,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Données invalides", issues: parsed.error.issues });
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const payload = { id: user._id.toString(), role: user.role, email: user.email };
  const token = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return res.json({
    token,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.body?.refreshToken as string | undefined;

  if (!token) {
    return res.status(401).json({ message: "Refresh token requis" });
  }

  try {
    const decoded = jwt.verify(token, env.jwtRefreshSecret) as {
      id: string;
      role: string;
      email: string;
    };

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: "Refresh token invalide" });
    }

    const newAccessToken = signAccessToken({
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    });

    return res.json({ token: newAccessToken });
  } catch {
    return res.status(401).json({ message: "Refresh token invalide" });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  const user = await User.findById(req.user.id).select("-password -refreshToken");
  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

  return res.json(user);
};

export const logout = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  await User.findByIdAndUpdate(req.user.id, { $unset: { refreshToken: 1 } });
  return res.status(204).send();
};
