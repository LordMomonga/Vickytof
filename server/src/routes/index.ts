import express from "express";
import { login, logout, me, refresh, register } from "../controllers/auth.controller.js";
import {
  cancelAppointment,
  createAppointment,
  getAppointments,
  getAvailableSlots,
  updateAppointment,
} from "../controllers/appointment.controller.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { createEmployee, getEmployees } from "../controllers/employee.controller.js";
import { createService, getServices } from "../controllers/service.controller.js";
import { auth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/refresh", refresh);
router.post("/auth/logout", auth, logout);
router.get("/auth/me", auth, me);

router.get("/services", getServices);
router.post("/services", auth, requireRole("admin"), createService);

router.get("/employees", getEmployees);
router.post("/employees", auth, requireRole("admin"), createEmployee);

router.get("/appointments/slots", getAvailableSlots);
router.get("/appointments", auth, getAppointments);
router.post("/appointments", auth, createAppointment);
router.patch("/appointments/:id", auth, updateAppointment);
router.patch("/appointments/:id/cancel", auth, cancelAppointment);

router.get("/dashboard/stats", auth, requireRole("admin", "staff"), getDashboardStats);

export default router;
