import { z } from "zod";
import { Service } from "../models/service.model.js";
const createServiceSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    duration: z.number().int().min(10),
    price: z.number().min(0),
    category: z.enum(["homme", "femme", "enfant", "barbe", "soin", "coloration"]),
    isActive: z.boolean().optional(),
});
export const getServices = async (_req, res) => {
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json(services);
};
export const createService = async (req, res) => {
    const parsed = createServiceSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Donn�es invalides", issues: parsed.error.issues });
    }
    const service = await Service.create(parsed.data);
    return res.status(201).json(service);
};
