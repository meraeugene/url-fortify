import { AuthenticatedUserData } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
  userData: AuthenticatedUserData | null;
  setUserData: (data: AuthenticatedUserData) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userData: null,
      setUserData: (data: AuthenticatedUserData) => set({ userData: data }),
    }),
    {
      name: "user-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
