import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAccessTokenStore = create(
  persist<{ accessToken: string }>(
    (set) => ({
      accessToken: "",
      setAccessToken: (token: string) => set({ accessToken: token }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
