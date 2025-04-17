
import React from 'react';
import { Link } from 'react-router-dom';
import { Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LabsButtonProps {
  variant?: 'default' | 'subtle' | 'icon';
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
                className={className}
              >
                <Beaker className="h-5 w-5" />
                <span className="sr-only">CardShow Labs</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>CardShow Labs - Experimental Features</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link to="/labs">
      <Button 
        variant={variant === 'subtle' ? 'ghost' : 'default'}
        size="sm" 
        className={`gap-2 ${className}`}
      >
        <Beaker className="h-4 w-4" />
        Labs
      </Button>
    </Link>
  );
};

export default LabsButton;
