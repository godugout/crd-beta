
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingState;
