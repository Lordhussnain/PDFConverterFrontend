import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  emailForVerification: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setEmailForVerification: (email: string | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true for the initial auth check
  emailForVerification: null,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  setEmailForVerification: (email) => set({ emailForVerification: email }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false, emailForVerification: null }),
}));

export default useAuthStore;