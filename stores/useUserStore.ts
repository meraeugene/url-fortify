import { AuthenticatedUserData } from "@/types";
import { create } from "zustand";

interface UserStore {
  userData: AuthenticatedUserData | null;
  setUserData: (data: AuthenticatedUserData) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  setUserData: (data) => set({ userData: data }),
}));
