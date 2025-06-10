
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingActionButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8">
      <Button
        asChild
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-[#006341] to-[#EFB21E] hover:from-[#004d32] hover:to-[#d49e1a] border-0 group transition-all duration-300 hover:scale-110"
      >
        <Link to="/cards/create" className="flex items-center justify-center">
          <PlusCircle className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-300" />
          <span className="sr-only">Create Card</span>
        </Link>
      </Button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Create Card
      </div>
    </div>
  );
};

export default FloatingActionButton;
