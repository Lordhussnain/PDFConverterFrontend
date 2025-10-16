import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { MailCheck, RefreshCw } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import useAuthStore from '@/stores/authStore';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { emailForVerification, setUser, setEmailForVerification } = useAuthStore();

  const { mutate: verifyMutate, isPending: isVerifying } = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (data) => {
      toast.success(data.message);
      setUser(data.user);
      setEmailForVerification(null);
      queryClient.invalidateQueries({ queryKey: ['checkAuth'] });
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: resendMutate, isPending: isResending } = useMutation({
    mutationFn: authApi.resendVerificationCode,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length === 6) {
      verifyMutate({ code });
    } else {
      toast.error('Please enter a valid 6-digit code.');
    }
  };

  const handleResend = () => {
    if (emailForVerification) {
      resendMutate({ email: emailForVerification });
    } else {
      toast.error("Could not find email to resend code. Please try logging in again.");
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
            <MailCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-muted-foreground">
            We've sent a 6-digit code to {emailForVerification}. Please enter it below.
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

          <Button type="submit" className="w-full" size="lg" disabled={isVerifying}>
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