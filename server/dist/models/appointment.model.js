import { Schema, model } from "mongoose";
const appointmentSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "confirmed",
    },
    notes: String,
    totalPrice: { type: Number, required: true },
}, { timestamps: true });
appointmentSchema.index({ employee: 1, date: 1, startTime: 1, endTime: 1 });
export const Appointment = model("Appointment", appointmentSchema);
