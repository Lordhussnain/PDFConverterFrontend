import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';

const ConditionalRoute = () => {
  const location = useLocation();
  const { emailForVerification, isAuthenticated, user } = useAuthStore();

  // 1. If user is authenticated and already verified, they shouldn't be here.
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  // 2. Check if access is granted (either via navigation state or email in store)
  const canAccess = location.state?.from === '/signup' || location.state?.from === '/login' || emailForVerification;

  if (!canAccess) {
    // If they try to access /verify-email directly without state or emailForVerification set, redirect them.
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ConditionalRoute;