import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserState } from "@/types/store";

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      token: null,
      statut: "online",
      setStatut: (statut: "online" |"spy") => set({ statut }),
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: "user-storage",
    }
  )
);