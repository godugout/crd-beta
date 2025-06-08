
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onClose: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 text-white">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md text-center">
        <p className="mb-4">{error}</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default ErrorState;
