import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const signAccessToken = (payload) => {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: "15m" });
};
export const signRefreshToken = (payload) => {
    return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: "7d" });
};
