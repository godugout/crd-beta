
import React from 'react';
import LoadingSpinner from './loading-spinner';

export interface LoadingStateProps {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable loading state component
 */
export function LoadingState({ text = 'Loading...', className = '', size = 'md' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size={size} className="mb-3" />
      <p className="text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  );
}

export default LoadingState;
