
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  color?: string;
}

const LoadingSpinner = ({
  className,
  size = 24,
  color = "currentColor"
}: LoadingSpinnerProps) => {
  return (
    <Loader2 
      className={cn("animate-spin", className)}
      size={size}
      color={color}
    />
  );
};

export default LoadingSpinner;
