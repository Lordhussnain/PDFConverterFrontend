import { Link } from 'react-router-dom';
import { FileText, Twitter, Facebook, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
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
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
            </div>
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
                <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 tracking-wide">Legal</h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
             <div>
              <h3 className="font-semibold mb-4 tracking-wide">Resources</h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">API Docs</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Help Center</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t my-6"></div>

        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PDF Converter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;