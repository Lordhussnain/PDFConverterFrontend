import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Phone } from 'lucide-react';

import useAuthStore from '@/stores/authStore';
import axios from 'axios';
import { set } from 'date-fns';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  
  const { isAuthenticated, isVerified, signupInProgress, signupEmail, setSignupProgress } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && isVerified) {
      navigate('/', { replace: true });
      console.log("You are already logged in and verified.")
      toast.info("You are already logged in and verified.");
    } else if (signupInProgress && signupEmail) {
      navigate('/verify-email', { state: { email: signupEmail }, replace: true });
      console.log("Redirecting to email verification...");
      toast.info("Please verify your email to continue.");
    }
  }, [navigate, isAuthenticated, isVerified, signupInProgress, signupEmail]);
  
  
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   setIsPending(true);
    try {
       // Update auth store
      const response = await axios.post('http://localhost:3001/api/v1/auth/signup',formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Account created successfully!", {
          description: "Please check your email to verify your account.",
        });
        setSignupProgress(formData.email);
        navigate('/verify-email', { state: { email: formData.email }, replace: true });
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      toast.error("Signup Failed", {
        description: errorMessage,
      });
    }
    finally {
      setIsPending(false);
    }

  };

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Join PDF Converter to unlock all features.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              name="userName"
              type="text"
              placeholder="Your username"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+1 (123) 456-7890"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
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

          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default SignUpPage;