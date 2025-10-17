import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';

const ConditionalRoute = () => {
  const location = useLocation();
  const { isAuthenticated, user, emailForVerification } = useAuthStore();

  // 1. If the user is not authenticated, they cannot verify an email.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. If the user is authenticated AND verified, they should not be here.
  if (user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  // 3. If the user is authenticated but NOT verified, they should be allowed access.
  // We keep the `emailForVerification` check as a fallback/safety measure, 
  // but the primary check is isAuthenticated && !user?.isVerified.
  
  // We also check if they are coming from a valid flow (signup/login) to prevent direct URL access 
  // by an unverified user who navigated away and came back without the store state.
  const cameFromAuthFlow = location.state?.from === '/signup' || location.state?.from === '/login';

  if (!user?.isVerified && (cameFromAuthFlow || emailForVerification)) {
    return <Outlet />;
  }
  
  // If authenticated but unverified, and somehow lost the state, redirect to login to restart flow.
  return <Navigate to="/login" replace />;
};

export default ConditionalRoute;