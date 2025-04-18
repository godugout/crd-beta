
import React, { useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  
  const handleNavigate = () => {
    // Use startTransition for navigation to prevent Suspense errors
    startTransition(() => {
      navigate('/labs');
    });
  };
  
  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className={className}
              onClick={handleNavigate}
              disabled={isPending}
            >
              <Beaker className="h-5 w-5" />
              <span className="sr-only">CardShow Labs</span>
              {isPending && (
                <span className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
                  <div className="h-3 w-3 border-2 border-t-transparent border-current rounded-full animate-spin" />
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>CardShow Labs - Experimental Features</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button 
      variant={variant === 'subtle' ? 'ghost' : 'default'}
      size="sm" 
      className={`gap-2 ${className}`}
      onClick={handleNavigate}
      disabled={isPending}
    >
      <Beaker className="h-4 w-4" />
      Labs
      {isPending && (
        <span className="h-3 w-3 border-2 border-t-transparent border-current rounded-full animate-spin ml-1" />
      )}
    </Button>
  );
};

export default LabsButton;
