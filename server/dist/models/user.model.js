import { Schema, model } from "mongoose";
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    role: {
        type: String,
        enum: ["client", "admin", "staff"],
        default: "client",
    },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String, default: null },
}, { timestamps: true });
export const User = model("User", userSchema);
