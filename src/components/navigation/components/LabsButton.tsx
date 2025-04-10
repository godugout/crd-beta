
import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LabsButtonProps {
  variant?: 'default' | 'subtle' | 'icon' | 'highlight';
  className?: string;
}

const LabsButton: React.FC<LabsButtonProps> = ({ 
  variant = 'default',
  className = '' 
}) => {
  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/labs">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`relative ${className}`}
              >
                <FlaskConical className="h-5 w-5 text-amber-500" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="sr-only">Dugout Labs</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Dugout Labs - Experimental Features</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'subtle') {
    return (
      <Link to="/labs">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 ${className}`}
        >
          <FlaskConical className="h-4 w-4 text-amber-500" />
          <span>Labs</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </Button>
      </Link>
    );
  }
  
  if (variant === 'highlight') {
    return (
      <Link to="/labs">
        <Button 
          variant="default" 
          size="sm" 
          className={`gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg ${className}`}
        >
          <FlaskConical className="h-4 w-4" />
          <span>Dugout Labs</span>
          <Sparkles className="h-3 w-3 ml-1" />
        </Button>
      </Link>
    );
  }

  return (
    <Link to="/labs">
      <Button 
        variant="outline" 
        size="sm" 
        className={`gap-2 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800 ${className}`}
      >
        <FlaskConical className="h-4 w-4" />
        Dugout Labs
      </Button>
    </Link>
  );
};

export default LabsButton;
