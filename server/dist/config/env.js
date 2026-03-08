import dotenv from "dotenv";
dotenv.config();
export const env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 5000),
    mongoUri: process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/salon-app",
    jwtSecret: process.env.JWT_SECRET ?? "super_secret_key",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? "super_refresh_secret_key",
    clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
};
