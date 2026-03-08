import { Schema, model } from "mongoose";

export type Role = "client" | "admin" | "staff";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
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
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
