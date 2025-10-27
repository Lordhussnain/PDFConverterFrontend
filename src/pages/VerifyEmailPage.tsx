import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { MailCheck, RefreshCw } from 'lucide-react';

import { authApi } from '@/lib/api';
import useAuthStore from '@/stores/authStore';
import axios from 'axios';












const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001/api/v1';
const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email;
  console.log(emailFromState);
  const [isVerificationSuccessful, setIsVerificationSuccessful] = useState(false); // New state
  const { isAuthenticated, isVerified, signupInProgress, signupEmail, login } = useAuthStore();
  const email = emailFromState || signupEmail; // Prioritize state, then store
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);






  // Restrict access and manage auth store state
  useEffect(() => {
    // If verification was successful, navigate to home. This takes precedence.
    if (isVerificationSuccessful) {
      navigate('/', { replace: true });
      return;
    }

    // If already authenticated and verified (e.g., user refreshed after verification), go home.
    if (isAuthenticated && isVerified) {
      navigate('/', { replace: true });
      toast.info("You are already logged in and verified.");
      return;
    }
    
    // If no email context and not in signup flow, redirect to signup.
    // This handles cases where user lands on /verify-email without proper context.
    if (!signupInProgress || !email) {
      console.log("Please sign up to verify your email.")
      toast.error("Access Denied", {
        description: "Please sign up to verify your email.",
      });
      navigate('/signup', { replace: true });
      return;
    }
  }, [email, navigate, isAuthenticated, isVerified, signupInProgress, isVerificationSuccessful]);

  



  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const code = otp.join('');
    if (code.length === 6) {
      try {
        setIsVerifying(true);
        const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, {
          code:code
        }, {
          withCredentials: true,
        });
  
        if (response.data.success) {
          setIsVerificationSuccessful(true);
          toast.success("Email verified successfully!", { description: "You can now access your account." });
          login(response.data.user, false); // <-- suppress login toast (we already showed verify toast)
          
        }
      } catch (error: any) {
        let errorMessage = "An unexpected error occurred during verification. Please try again.";
        if (axios.isAxiosError(error) && error.response) {
          errorMessage = error.response.data.message || errorMessage;
        }
       
        toast.error("Verification Failed", {
          description: errorMessage,
        });
      }
      finally {
        setIsVerifying(false);
      }
    } else {
      toast.error('Please enter a valid 6-digit code.');
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Error", { description: "No email found to resend code." });
      return;
    }
    setIsResending(true);
    
    try {
      const response = await authApi.resendVerificationCode({ email });
      if (response.success) {
        toast.success("Code Resent", {
          description: "A new verification code has been sent to your email.",
        });
      }
    } catch (error: any) {
      let errorMessage = "Failed to resend code. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      toast.error("Resend Failed", {
        description: errorMessage,
      });
    } finally {
      setIsResending(false);
    }
   
  };
    // If email is not present or already verified, the useEffect will handle redirection, so we don't render the form
    if (!email && !signupInProgress) { // Ensure we don't render if no context
      return null; 
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
          <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MailCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-muted-foreground">
            We've sent a 6-digit code to {email}. Please enter it below.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputsRef.current[index] = el; }}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-lg font-semibold"
                required
              />
            ))}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isVerifying || isResending}>
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Didn't receive the code?{' '}
            <Button
              variant="link"
              onClick={handleResend}
              disabled={isResending}
              className="p-0 h-auto"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              {isResending ? 'Resending...' : 'Resend Code'}
            </Button>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default VerifyEmailPage;