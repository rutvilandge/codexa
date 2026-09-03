import { create } from "zustand";
import type { User } from "../types/auth";
import { getCurrentUser, logoutUser } from "../api/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isRestoringSession: boolean;

  setUser: (user: User) => void;
  setToken: (token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  restoreSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isRestoringSession: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  setToken: (token) =>
    set({
      token,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),

  updateUser: (user) => set({ user }),

  restoreSession: async () => {
    try {
      const { user } = await getCurrentUser();
      set({ user, isAuthenticated: true, isRestoringSession: false });
    } catch {
      set({ user: null, token: null, isAuthenticated: false, isRestoringSession: false });
    }
  },

  signOut: async () => {
    try {
      await logoutUser();
    } finally {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
