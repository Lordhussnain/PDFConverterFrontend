import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { authApi } from '@/lib/api';
import useAuthStore from '@/stores/authStore';

export const useAuth = () => {
  const { setUser, setLoading, user } = useAuthStore();

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['checkAuth'],
    queryFn: authApi.checkAuth,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (isSuccess && data?.user) {
      setUser(data.user);
    } else if (isError || (!isLoading && !data?.user)) {
      setUser(null);
    } else if (isLoading) {
      setLoading(true);
    }
  }, [data, isError, isLoading, isSuccess, setUser, setLoading]);

  return { user, isLoading: useAuthStore((s) => s.isLoading) };
};