
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { DetectedCard } from '../types';

interface DetectionTabProps {
  image: string | null;
  detectedCards: DetectedCard[];
  isProcessing: boolean;
  showEdges: boolean;
  showContours: boolean;
  onDetectCards: () => void;
  onClearDetection: () => void;
  onToggleEdges: (value: boolean) => void;
  onToggleContours: (value: boolean) => void;
}

const DetectionTab: React.FC<DetectionTabProps> = ({
  image,
  detectedCards,
  isProcessing,
  showEdges,
  showContours,
  onDetectCards,
  onClearDetection,
  onToggleEdges,
  onToggleContours
}) => {
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          variant="default" 
          onClick={onDetectCards}
          disabled={!image || isProcessing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
          Detect Cards
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onClearDetection}
          disabled={!image || detectedCards.length === 0}
        >
          <Trash className="mr-2 h-4 w-4" />
          Clear Detection
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <Toggle
          pressed={showEdges}
          onPressedChange={onToggleEdges}
          variant="outline"
          aria-label="Show edges"
        >
          Show Edges
        </Toggle>
        
        <Toggle
          pressed={showContours}
          onPressedChange={onToggleContours}
          variant="outline"
          aria-label="Show contours"
        >
          Show Contours
        </Toggle>
      </div>
      
      {detectedCards.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Detection Results:</h3>
          <pre className="text-xs bg-neutral-100 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(detectedCards, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};

export default DetectionTab;
