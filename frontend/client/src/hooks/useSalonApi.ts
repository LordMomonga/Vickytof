import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Appointment, Employee, Service } from "../types";

export const useServices = () => {
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await api.get("/services");
      return data;
    },
  });
};

export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data } = await api.get("/employees");
      return data;
    },
  });
};

export const useAvailableSlots = (employeeId?: string, serviceId?: string, date?: string) => {
  return useQuery<string[]>({
    queryKey: ["slots", employeeId, serviceId, date],
    enabled: Boolean(employeeId && serviceId && date),
    queryFn: async () => {
      const { data } = await api.get("/appointments/slots", {
        params: { employee: employeeId, service: serviceId, date },
      });
      return data.slots as string[];
    },
  });
};

export const useAppointments = () => {
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data } = await api.get("/appointments");
      return data;
    },
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      employee: string;
      service: string;
      date: string;
      startTime: string;
      notes?: string;
    }) => {
      const { data } = await api.post("/appointments", payload);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/appointments/${id}/cancel`);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useDashboardStats = () => {
  return useQuery<{
    todayAppointments: number;
    activeClients: number;
    weekRevenue: number;
    fillRate: number;
  }>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/stats");
      return data;
    },
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      duration: number;
      price: number;
      category: Service["category"];
      description?: string;
    }) => {
      const { data } = await api.post("/services", payload);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
