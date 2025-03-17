
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Layers } from 'lucide-react';
import { DetectedCard } from '../types';

interface TracingTabProps {
  image: string | null;
  manualTraces: DetectedCard[];
  onAddTrace: () => void;
  onClearTraces: () => void;
  onCompareResults: () => void;
}

const TracingTab: React.FC<TracingTabProps> = ({ 
  image, 
  manualTraces, 
  onAddTrace, 
  onClearTraces, 
  onCompareResults 
}) => {
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          variant="outline" 
          onClick={onAddTrace}
          disabled={!image}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Card Frame
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onClearTraces}
          disabled={!image || manualTraces.length === 0}
        >
          <Trash className="mr-2 h-4 w-4" />
          Clear Traces
        </Button>
        
        <Button 
          variant="default" 
          onClick={onCompareResults}
          disabled={!image || manualTraces.length === 0}
        >
          <Layers className="mr-2 h-4 w-4" />
          Compare with Detection
        </Button>
      </div>
      
      {manualTraces.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Traces ({manualTraces.length}):</h3>
          <pre className="text-xs bg-neutral-100 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(manualTraces, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};

export default TracingTab;
