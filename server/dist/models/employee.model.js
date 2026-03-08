import { Schema, model } from "mongoose";
const employeeSchema = new Schema({
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
}, { timestamps: true });
export const Employee = model("Employee", employeeSchema);
