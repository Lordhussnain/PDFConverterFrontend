import { create } from 'zustand';
import type { User } from '@/types';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  signupInProgress: boolean;
  signupEmail: string | null;
  isLoading: boolean;
}


interface AuthActions {
  login: (user: User, showToast?: boolean) => void;
  logout: (showToast:boolean, reason?: string) => void;
  setSignupProgress: (email: string) => void;
  clearSignupProgress: () => void;
  markEmailVerified: () => void;
  updateUser: (updatedUser: User) => void;
  setLoading: (loading: boolean) => void;
}


export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  isVerified: false,
  signupInProgress: false,
  signupEmail: null,
  isLoading: true,
  
  login: (user, showToast = true) => {
    set((state) => {
      const isUserVerified = user.isVerified;
  
      // Only clear signup progress if the user is now verified
      const newSignupInProgress = isUserVerified ? false : state.signupInProgress;
      const newSignupEmail = isUserVerified ? null : state.signupEmail;
  
      return {
        user,
        isAuthenticated: true,
        isVerified: isUserVerified,
        signupInProgress: newSignupInProgress,
        signupEmail: newSignupEmail,
        isLoading: false, // ✅ put it inside the returned object
      };
    });
  
    if (showToast) {
      toast.success("Logged in successfully!", {
        description: `Welcome back, ${user.userName}!`,
      });
    }
  },
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  logout: (showToast=true,reason) => {
    // These calls are now safe here as they clear client-side state,
    // and AuthInitializer will re-initialize them on next successful login.
    // Dynamic import to avoid circular dependency issues if stores are not fully initialized yet.
   
    console.groupCollapsed('[authStore] logout called', reason || '');
    console.trace();
    console.groupEnd();
    set({
      user: null,
      isAuthenticated: false,
      isVerified: false,
      signupInProgress: false,
      signupEmail: null,
      isLoading: false,
    });
    if (showToast) {
      toast.info("You have been logged out.");
    }
  },

  setSignupProgress: (email) => {
    set({
      signupInProgress: true,
      signupEmail: email,
    });
  },

  clearSignupProgress: () => {
    set({
      signupInProgress: false,
      signupEmail: null,
    });
  },

  markEmailVerified: () => {
    set((state) => ({
      isVerified: true,
      user: state.user ? { ...state.user, isVerified: true } : null,
      signupInProgress: false,
      signupEmail: null,
    }));
  },

  updateUser: (updatedUser) => {
    set({
      user: updatedUser,
      isVerified: updatedUser.isVerified,
    });
  },
}));

export default useAuthStore;