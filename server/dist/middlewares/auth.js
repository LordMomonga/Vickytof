import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Non autoris�" });
    }
    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        req.user = decoded;
        return next();
    }
    catch {
        return res.status(401).json({ message: "Token invalide" });
    }
};
