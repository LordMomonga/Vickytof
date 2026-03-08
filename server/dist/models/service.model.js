import { Schema, model } from "mongoose";
const serviceSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    category: {
        type: String,
        enum: ["homme", "femme", "enfant", "barbe", "soin", "coloration"],
        required: true,
    },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export const Service = model("Service", serviceSchema);
