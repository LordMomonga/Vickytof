import { Schema, model, Types } from "mongoose";

export interface IEmployee {
  user: Types.ObjectId;
  bio?: string;
  specialties: string[];
  avatar?: string;
  workingDays: {
    day: number;
    start: string;
    end: string;
    isOff: boolean;
  }[];
}

const employeeSchema = new Schema<IEmployee>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bio: String,
    specialties: [{ type: String }],
    avatar: String,
    workingDays: [
      {
        day: { type: Number, min: 0, max: 6, required: true },
        start: { type: String, required: true },
        end: { type: String, required: true },
        isOff: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
);

export const Employee = model<IEmployee>("Employee", employeeSchema);
