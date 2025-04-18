
import React, { useTransition } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
              className={`relative ${className}`}
              onClick={handleNavigate}
              disabled={isPending}
            >
              <FlaskConical className="h-5 w-5 text-amber-500" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="sr-only">Cardshow Labs</span>
              {isPending && (
                <span className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
                  <div className="h-3 w-3 border-2 border-t-transparent border-amber-500 rounded-full animate-spin" />
                </span>
              )}
            </Button>
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
      <Button 
        variant="ghost" 
        size="sm" 
        className={`gap-2 ${className}`}
        onClick={handleNavigate}
        disabled={isPending}
      >
        <FlaskConical className="h-4 w-4 text-amber-500" />
        <span>Labs</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        {isPending && (
          <span className="h-3 w-3 border-2 border-t-transparent border-amber-500 rounded-full animate-spin ml-1" />
        )}
      </Button>
    );
  }
  
  if (variant === 'spectrum') {
    return (
      <CrdButton 
        variant="featured" 
        size="sm" 
        className={`gap-2 ${className}`}
        onClick={handleNavigate}
        disabled={isPending}
      >
        <FlaskConical className="h-4 w-4 text-amber-400" />
        <span className="font-medium">Labs</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
        {isPending && (
          <span className="h-3 w-3 border-2 border-t-transparent border-amber-400 rounded-full animate-spin ml-1" />
        )}
      </CrdButton>
    );
  }

  return (
    <Button 
      variant="featured" 
      size="sm" 
      className={`gap-2 ${className}`}
      onClick={handleNavigate}
      disabled={isPending}
    >
      <FlaskConical className="h-4 w-4" />
      Cardshow Labs
      {isPending && (
        <span className="h-3 w-3 border-2 border-t-transparent border-white rounded-full animate-spin ml-1" />
      )}
    </Button>
  );
};

export default LabsButton;
