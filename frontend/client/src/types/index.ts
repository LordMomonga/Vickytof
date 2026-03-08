export type Role = "client" | "admin" | "staff";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface Service {
  _id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category: "homme" | "femme" | "enfant" | "barbe" | "soin" | "coloration";
}

export interface Employee {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  bio?: string;
  specialties: string[];
}

export interface Appointment {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  service?: Service;
  employee?: Employee;
}
