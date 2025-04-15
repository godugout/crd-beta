
import React from 'react';
import { cn } from '@/lib/utils';

interface CardBaseProps {
  children: React.ReactNode;
  className?: string;
  isFlipped?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}

const CardBase: React.FC<CardBaseProps> = ({
  children,
  className,
  isFlipped = false,
  isLoading = false,
  onClick
}) => {
  return (
    <div 
      className={cn(
        "relative w-full aspect-[2.5/3.5] rounded-lg transition-transform duration-500 transform-gpu",
        "hover:scale-[1.02] focus-within:scale-[1.02]",
        "shadow-lg hover:shadow-xl",
        isFlipped && "rotate-y-180",
        isLoading && "animate-pulse",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {isLoading ? (
        <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse" />
      ) : (
        children
      )}
    </div>
  );
};

export default CardBase;
