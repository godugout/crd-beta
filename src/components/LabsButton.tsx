
import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LabsButtonProps {
  variant?: 'default' | 'subtle' | 'icon' | 'spectrum';
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
                <span className="sr-only">Cardshow Labs</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cardshow Labs - Experimental Features</p>
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
  
  if (variant === 'spectrum') {
    return (
      <Link to="/labs">
        <CrdButton 
          variant="featured" 
          size="sm" 
          className={`gap-2 ${className}`}
        >
          <FlaskConical className="h-4 w-4 text-amber-400" />
          <span className="font-medium">Labs</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
        </CrdButton>
      </Link>
    );
  }

  return (
    <Link to="/labs">
      <Button 
        variant="featured" 
        size="sm" 
        className={`gap-2 ${className}`}
      >
        <FlaskConical className="h-4 w-4" />
        Cardshow Labs
      </Button>
    </Link>
  );
};

export default LabsButton;
