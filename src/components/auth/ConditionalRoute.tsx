import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';

const ConditionalRoute = () => {
  const location = useLocation();
  const { emailForVerification } = useAuthStore();

  const canAccess = location.state?.from === '/signup' || location.state?.from === '/login' || emailForVerification;

  if (!canAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ConditionalRoute;