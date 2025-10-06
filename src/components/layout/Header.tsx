import { NavLink, Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import MobileNav from './MobileNav';

const navLinks = [
  { to: '/features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' },
];

const Header = () => {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <MobileNav />
        <Link to="/" className="flex items-center mr-6">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold hidden sm:block">PDF Converter</h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;