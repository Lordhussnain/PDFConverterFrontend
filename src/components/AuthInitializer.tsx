import { useAuth } from '@/hooks/useAuth';

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  useAuth();
  return <>{children}</>;
};

export default AuthInitializer;