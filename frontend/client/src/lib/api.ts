import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as { _retry?: boolean; headers: { Authorization: string } };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const response = await api.post("/auth/refresh", { refreshToken });
          useAuthStore.getState().setToken(response.data.token as string);
          originalRequest.headers.Authorization = `Bearer ${String(response.data.token)}`;
          return api(originalRequest);
        } catch {
          useAuthStore.getState().logout();
        }
      }
    }

    return Promise.reject(error);
  },
);
