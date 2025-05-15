
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No items found",
  icon,
  buttonText,
  onButtonClick,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {icon && (
        <div className="text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <p className="text-gray-500 text-lg text-center mb-4">{message}</p>
      {buttonText && onButtonClick && (
        <Button variant="outline" onClick={onButtonClick}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
