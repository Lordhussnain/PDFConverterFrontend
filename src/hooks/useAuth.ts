import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { authApi } from '@/lib/api';
import useAuthStore from '@/stores/authStore';

export const useAuth = () => {
  const { login, logout, setLoading, isAuthenticated } = useAuthStore();

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['checkAuth'],
    queryFn: authApi.checkAuth,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    // Update global loading state based on query status
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (isSuccess && data?.user) {
      // Use the new login action (showToast=false for initial check)
      login(data.user, false); 
    } else if (isError || (!isLoading && !data?.user)) {
      // If check fails or returns no user, ensure we are logged out
      if (isAuthenticated) {
        // Only call logout if currently authenticated (logout handles toast/state clear)
        logout();
      } else {
        // If already logged out, just ensure loading is false
        setLoading(false);
      }
    }
  }, [data, isError, isLoading, isSuccess, login, logout, setLoading, isAuthenticated]);

  // Return the current state from the store
  return { user: useAuthStore.getState().user, isLoading: useAuthStore.getState().isLoading };
};