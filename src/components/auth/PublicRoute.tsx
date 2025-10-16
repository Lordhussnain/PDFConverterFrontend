import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;