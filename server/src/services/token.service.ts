import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signAccessToken = (payload: {
  id: string;
  role: string;
  email: string;
}) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "15m" });
};

export const signRefreshToken = (payload: {
  id: string;
  role: string;
  email: string;
}) => {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: "7d" });
};
