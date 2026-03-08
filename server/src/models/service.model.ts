import { Schema, model } from "mongoose";

export interface IService {
  name: string;
  description?: string;
  duration: number;
  price: number;
  category: "homme" | "femme" | "enfant" | "barbe" | "soin" | "coloration";
  isActive: boolean;
}

const serviceSchema = new Schema<IService>(
  {
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
  },
  { timestamps: true },
);

export const Service = model<IService>("Service", serviceSchema);
