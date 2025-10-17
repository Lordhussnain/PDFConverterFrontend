import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';

const VerificationGuard = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

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

  // If authenticated but not verified, and not already on the verification page, redirect.
  const isUnverified = isAuthenticated && user && !user.isVerified;
  const isVerificationPage = location.pathname === '/verify-email';

  if (isUnverified && !isVerificationPage) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default VerificationGuard;