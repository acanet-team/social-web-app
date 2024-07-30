import { create } from "zustand";

export const useAccessTokenStore = create<{ accessToken: string }>((set) => ({
  accessToken: "",
  setAccessToken: (accessToken: string) => set(() => ({ accessToken })),
  removeAccessToken: () => set({ accessToken: "" }),
}));
