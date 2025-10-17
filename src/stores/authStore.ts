import { create } from 'zustand';
import type { User } from '@/types';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  emailForVerification: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setEmailForVerification: (email: string | null) => void;
  login: (user: User, showToast?: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true for the initial auth check
  emailForVerification: null,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setEmailForVerification: (email) => set({ emailForVerification: email }),

  login: (user, showToast = true) => {
    set({ 
      user, 
      isAuthenticated: true, 
      isLoading: false,
      // If user is verified, clear any pending verification state
      emailForVerification: user.isVerified ? null : useAuthStore.getState().emailForVerification,
    });
    if (showToast) {
      toast.success("Logged in successfully!", {
        description: `Welcome back, ${user.userName}!`,
      });
    }
  },

  logout: () => {
    // Perform client-side logout state update
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false, 
      emailForVerification: null 
    });
    toast.info("You have been logged out.");
  },
}));

export default useAuthStore;