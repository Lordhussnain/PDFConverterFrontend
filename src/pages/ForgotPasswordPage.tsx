import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useState } from "react";
import { Mail } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message);
      setEmail('');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ email });
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
          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </motion.div>
    </main>
  );
};

export default ForgotPasswordPage;