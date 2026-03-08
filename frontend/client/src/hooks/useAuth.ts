import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth.store";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post("/auth/login", payload);
      return data;
    },
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        token: data.token,
        refreshToken: data.refreshToken,
      });
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post("/auth/register", payload);
      return data;
    },
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        token: data.token,
        refreshToken: data.refreshToken,
      });
    },
  });
};
