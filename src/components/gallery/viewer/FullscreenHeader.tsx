
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullscreenHeaderProps {
  onClose: () => void;
}

const FullscreenHeader: React.FC<FullscreenHeaderProps> = ({ onClose }) => {
  return (
    <div className="absolute top-4 right-4">
      <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-gray-800">
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default FullscreenHeader;
