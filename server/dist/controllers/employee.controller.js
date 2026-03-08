import { z } from "zod";
import { Employee } from "../models/employee.model.js";
import { User } from "../models/user.model.js";
const createEmployeeSchema = z.object({
    userId: z.string().min(1),
    bio: z.string().optional(),
    specialties: z.array(z.string()).default([]),
    avatar: z.string().optional(),
    workingDays: z
        .array(z.object({
        day: z.number().int().min(0).max(6),
        start: z.string().min(4),
        end: z.string().min(4),
        isOff: z.boolean().default(false),
    }))
        .default([]),
});
export const getEmployees = async (_req, res) => {
    const employees = await Employee.find().populate({
        path: "user",
        select: "firstName lastName email phone role",
    });
    return res.json(employees);
};
export const createEmployee = async (req, res) => {
    const parsed = createEmployeeSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Donn�es invalides", issues: parsed.error.issues });
    }
    const user = await User.findById(parsed.data.userId);
    if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    user.role = "staff";
    await user.save();
    const employee = await Employee.create({
        user: parsed.data.userId,
        bio: parsed.data.bio,
        specialties: parsed.data.specialties,
        avatar: parsed.data.avatar,
        workingDays: parsed.data.workingDays,
    });
    const populated = await employee.populate({
        path: "user",
        select: "firstName lastName email phone role",
    });
    return res.status(201).json(populated);
};
