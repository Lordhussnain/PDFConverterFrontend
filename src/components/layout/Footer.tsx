import { Link } from 'react-router-dom';
import { FileText, Twitter, Facebook, Linkedin, Github, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import React from 'react';

const Footer = () => {
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
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Branding Section */}
          <div className="lg:col-span-4 mb-6 lg:mb-0">
            <Link to="/" className="flex items-center mb-4">
              <FileText className="h-7 w-7 mr-2 text-primary" />
              <span className="text-2xl font-bold">PDF Converter</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              The simplest way to convert your PDF files. Fast, secure, and free for everyone.
            </p>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 tracking-wide">Product</h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 tracking-wide">Company</h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 tracking-wide">Legal</h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li><Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
             <div>
              <h3 className="font-semibold mb-4 tracking-wide">Resources</h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li><Link to="/" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">API Docs</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Help Center</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t my-8"></div>

        {/* Newsletter and Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="w-full md:w-auto text-center md:text-left">
                <h3 className="font-semibold mb-2">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mb-4">Get the latest news and feature updates.</p>
                <form className="flex items-center gap-2 max-w-sm mx-auto md:mx-0" onSubmit={handleNewsletterSubmit}>
                    <Input type="email" name="email" placeholder="Enter your email" required className="flex-grow" />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
            <div className="text-center md:text-right">
                <h3 className="font-semibold mb-2">Follow Us</h3>
                <div className="flex justify-center md:justify-end items-center gap-4 mt-2">
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
                </div>
            </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PDF Converter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;