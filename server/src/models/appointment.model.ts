import { Schema, model, Types } from "mongoose";

export interface IAppointment {
  client: Types.ObjectId;
  employee: Types.ObjectId;
  service: Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  totalPrice: number;
}

const appointmentSchema = new Schema<IAppointment>(
  {
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
  },
  { timestamps: true },
);

appointmentSchema.index({ employee: 1, date: 1, startTime: 1, endTime: 1 });

export const Appointment = model<IAppointment>("Appointment", appointmentSchema);
