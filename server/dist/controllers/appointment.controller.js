import dayjs from "dayjs";
import { z } from "zod";
import { Appointment } from "../models/appointment.model.js";
import { Employee } from "../models/employee.model.js";
import { Service } from "../models/service.model.js";
import { buildSlots, overlaps } from "../utils/calendar.js";
const createAppointmentSchema = z.object({
    employee: z.string().min(1),
    service: z.string().min(1),
    date: z.string().min(8),
    startTime: z.string().min(4),
    notes: z.string().optional(),
});
const updateAppointmentSchema = z.object({
    date: z.string().min(8).optional(),
    startTime: z.string().min(4).optional(),
    notes: z.string().optional(),
    status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
});
export const getAvailableSlots = async (req, res) => {
    const employeeId = String(req.query.employee ?? "");
    const serviceId = String(req.query.service ?? "");
    const date = String(req.query.date ?? "");
    if (!employeeId || !serviceId || !date) {
        return res
            .status(400)
            .json({ message: "Parametres employee, service et date requis" });
    }
    const [employee, service] = await Promise.all([
        Employee.findById(employeeId),
        Service.findById(serviceId),
    ]);
    if (!employee || !service) {
        return res.status(404).json({ message: "Employee ou service introuvable" });
    }
    const weekday = dayjs(date).day();
    const workingDay = employee.workingDays.find((w) => w.day === weekday && !w.isOff);
    if (!workingDay) {
        return res.json({ slots: [] });
    }
    const allSlots = buildSlots(workingDay.start, workingDay.end, 30);
    const appointments = await Appointment.find({
        employee: employeeId,
        date,
        status: { $in: ["pending", "confirmed"] },
    }).select("startTime endTime");
    const available = allSlots.filter((slot) => {
        const endSlot = dayjs(`2000-01-01 ${slot}`).add(service.duration, "minute").format("HH:mm");
        if (endSlot > workingDay.end) {
            return false;
        }
        return appointments.every((appt) => !overlaps(slot, endSlot, appt.startTime, appt.endTime));
    });
    return res.json({ slots: available });
};
export const createAppointment = async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: "Non autorise" });
    }
    const parsed = createAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Donnees invalides", issues: parsed.error.issues });
    }
    const { employee, service, date, startTime, notes } = parsed.data;
    const serviceDoc = await Service.findById(service);
    if (!serviceDoc) {
        return res.status(404).json({ message: "Service introuvable" });
    }
    const endTime = dayjs(`2000-01-01 ${startTime}`)
        .add(serviceDoc.duration, "minute")
        .format("HH:mm");
    const existing = await Appointment.find({
        employee,
        date,
        status: { $in: ["pending", "confirmed"] },
    }).select("startTime endTime");
    const hasOverlap = existing.some((appt) => overlaps(startTime, endTime, appt.startTime, appt.endTime));
    if (hasOverlap) {
        return res.status(400).json({ message: "Creneau indisponible" });
    }
    const appointment = await Appointment.create({
        client: req.user.id,
        employee,
        service,
        date,
        startTime,
        endTime,
        notes,
        totalPrice: serviceDoc.price,
        status: "confirmed",
    });
    return res.status(201).json(appointment);
};
export const getAppointments = async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: "Non autorise" });
    }
    const query = req.user.role === "admin" ? {} : { client: req.user.id };
    const appointments = await Appointment.find(query)
        .populate({ path: "client", select: "firstName lastName email" })
        .populate({ path: "employee", populate: { path: "user", select: "firstName lastName" } })
        .populate({ path: "service", select: "name duration price" })
        .sort({ date: -1, startTime: -1 });
    return res.json(appointments);
};
export const updateAppointment = async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: "Non autorise" });
    }
    const parsed = updateAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Donnees invalides", issues: parsed.error.issues });
    }
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        return res.status(404).json({ message: "Rendez-vous introuvable" });
    }
    const isOwner = appointment.client.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Acces refuse" });
    }
    const nextDate = parsed.data.date ?? appointment.date;
    const nextStart = parsed.data.startTime ?? appointment.startTime;
    if (parsed.data.date || parsed.data.startTime) {
        const serviceDoc = await Service.findById(appointment.service);
        if (!serviceDoc) {
            return res.status(404).json({ message: "Service introuvable" });
        }
        const nextEnd = dayjs(`2000-01-01 ${nextStart}`)
            .add(serviceDoc.duration, "minute")
            .format("HH:mm");
        const collisions = await Appointment.find({
            _id: { $ne: appointment._id },
            employee: appointment.employee,
            date: nextDate,
            status: { $in: ["pending", "confirmed"] },
        }).select("startTime endTime");
        const hasOverlap = collisions.some((appt) => overlaps(nextStart, nextEnd, appt.startTime, appt.endTime));
        if (hasOverlap) {
            return res.status(400).json({ message: "Creneau indisponible" });
        }
        appointment.date = nextDate;
        appointment.startTime = nextStart;
        appointment.endTime = nextEnd;
    }
    if (parsed.data.notes !== undefined) {
        appointment.notes = parsed.data.notes;
    }
    if (parsed.data.status !== undefined) {
        appointment.status = parsed.data.status;
    }
    await appointment.save();
    return res.json(appointment);
};
export const cancelAppointment = async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: "Non autorise" });
    }
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        return res.status(404).json({ message: "Rendez-vous introuvable" });
    }
    const isOwner = appointment.client.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Acces refuse" });
    }
    appointment.status = "cancelled";
    await appointment.save();
    return res.json(appointment);
};
