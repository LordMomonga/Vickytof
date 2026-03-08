import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

type AuthStore = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  setAuth: (payload: { user: User; token: string; refreshToken?: string }) => void;
  setToken: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      setAuth: ({ user, token, refreshToken }) => set({ user, token, refreshToken }),
      setToken: (token) => set((state) => ({ ...state, token })),
      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    {
      name: "salon-auth",
    },
  ),
);
