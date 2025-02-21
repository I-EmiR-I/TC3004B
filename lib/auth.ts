import { create } from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuth = create<AuthStore>((set) => ({
  isAuthenticated: false,
  login: (email: string, password: string) => {
    // Simple authentication - in production this would connect to a real auth system
    if (email === 'admin@example.com' && password === 'password123') {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false }),
}));