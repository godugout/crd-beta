
import React from 'react';
import { Loader } from 'lucide-react';

interface AuthLoadingIndicatorProps {
  isLoading: boolean;
}

const AuthLoadingIndicator: React.FC<AuthLoadingIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white">
      <div className="flex items-center gap-2">
        <Loader className="h-4 w-4 animate-spin" />
        <span className="text-sm">Checking authentication...</span>
      </div>
    </div>
  );
};

export default AuthLoadingIndicator;
