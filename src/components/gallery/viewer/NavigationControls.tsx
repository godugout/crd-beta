
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationControlsProps {
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext
}) => {
  return (
    <>
      <div className="absolute left-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onPrev} 
          className="text-white hover:bg-gray-800"
          disabled={!canGoPrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute right-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onNext} 
          className="text-white hover:bg-gray-800"
          disabled={!canGoNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
};

export default NavigationControls;
