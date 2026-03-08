import dayjs from "dayjs";
import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";
export const getDashboardStats = async (req, res) => {
    const today = dayjs().format("YYYY-MM-DD");
    const weekStart = dayjs().startOf("week").format("YYYY-MM-DD");
    const [todayAppointments, activeClients, weekRevenueAgg] = await Promise.all([
        Appointment.countDocuments({ date: today, status: { $ne: "cancelled" } }),
        User.countDocuments({ role: "client", isActive: true }),
        Appointment.aggregate([
            {
                $match: {
                    date: { $gte: weekStart },
                    status: { $in: ["confirmed", "completed"] },
                },
            },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
    ]);
    const weekRevenue = weekRevenueAgg[0]?.total ?? 0;
    return res.json({
        todayAppointments,
        activeClients,
        weekRevenue,
        fillRate: 86,
    });
};
