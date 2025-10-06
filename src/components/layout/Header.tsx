import { FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Header = () => {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold">PDF Converter</h1>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;