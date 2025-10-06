import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import React from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    if (email) {
      toast.success("You've subscribed!", {
        description: `A confirmation has been sent to ${email}.`,
      });
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <section className="border-t bg-muted/50">
      <motion.div 
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Stay Ahead of the Curve
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Subscribe to our newsletter for the latest updates on new features, conversion tips, and exclusive offers.
          </p>
          <form className="flex items-center gap-2 max-w-md mx-auto" onSubmit={handleNewsletterSubmit}>
            <Input type="email" name="email" placeholder="Enter your email address" required className="flex-grow text-base" />
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default Newsletter;