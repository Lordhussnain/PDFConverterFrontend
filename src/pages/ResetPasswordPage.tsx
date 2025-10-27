import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useParams, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';










const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001/api/v1';
const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const { token } = useParams<{ token: string }>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }
    setIsSubmitting(true);
    try {
      // The token is passed as a URL parameter
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password/${token}`, {
        password: password,
      }, {
        withCredentials: true,
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast.success("Password Reset Successful", {
          description: "Your password has been updated. You can now log in with your new password.",
        });
        // Optionally, you could automatically redirect after a few seconds
        // setTimeout(() => navigate('/login'), 5000);
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      toast.error("Reset Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
   
  };
  if (isSuccess) {
    return (
      <main className="container mx-auto px-4 py-12">
      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <Alert className="mb-6">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              You can now log in with your new password.
            </AlertDescription>
          </Alert>
          <Button asChild>
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
        </motion.div>
    </main>
    );
  }
  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
          <p className="text-muted-foreground">Enter your new password below.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
        Remember your password?{" "}
        <Link to="/login" className="underline">
          Log in
        </Link>
      </div>
      </motion.div>
    </main>
  );
};

export default ResetPasswordPage;