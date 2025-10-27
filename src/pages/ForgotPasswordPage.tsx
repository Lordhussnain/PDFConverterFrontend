import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';
import { toast } from "sonner";

import { useState } from "react";
import { Mail } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001/api/v1';
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email: email,
      }, {
        withCredentials: true,
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast.success("Password Reset Email Sent", {
          description: "Please check your email for instructions to reset your password.",
        });
        // Optionally, you could automatically redirect after a few seconds
        // setTimeout(() => navigate('/login'), 5000);
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
    
      toast.error("Request Failed", {
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
            <AlertTitle>Instructions Sent</AlertTitle>
            <AlertDescription>
              Please check your email (including spam/junk folder) for a link to reset your password.
            </AlertDescription>
          </Alert>
          <Button asChild variant="outline">
            <Link to="/login">Back to Login</Link>
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
          <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
          <p className="text-muted-foreground">Enter your email to receive a password reset link.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            </div>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordPage;