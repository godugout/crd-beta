
import React from 'react';
import LoadingSpinner from './loading-spinner';

export interface LoadingStateProps {
  text?: string;
  message?: string; // Added message property 
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable loading state component
 */
export function LoadingState({ text, message, className = '', size = 'md' }: LoadingStateProps) {
  // Use message if provided, otherwise fall back to text, or default to "Loading..."
  const displayText = message || text || 'Loading...';
  
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size={size} className="mb-3" />
      <p className="text-gray-500 dark:text-gray-400">{displayText}</p>
    </div>
  );
}

export default LoadingState;
