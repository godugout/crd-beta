
import React from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Layers, Sunset, Maximize2, Users, Crop } from 'lucide-react';
import { EnhancedCropBoxProps } from '@/components/card-upload/cardDetection';

interface DetectionPanelProps {
  selectedAreas: EnhancedCropBoxProps[];
  autoEnhance: boolean;
  setAutoEnhance: (value: boolean) => void;
  onRunDetection: () => void;
  onAddSelection: () => void;
  onProcessAreas: () => void;
  onRemoveArea: (index: number) => void;
  isDetecting: boolean;
  isProcessing: boolean;
}

const DetectionPanel: React.FC<DetectionPanelProps> = ({
  selectedAreas,
  autoEnhance,
  setAutoEnhance,
  onRunDetection,
  onAddSelection,
  onProcessAreas,
  onRemoveArea,
  isDetecting,
  isProcessing
}) => {
  return (
    <>
      <h3 className="font-medium mb-3 flex items-center justify-between">
        <span>Detected Areas</span>
        <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-md">
          {selectedAreas.length}
        </span>
      </h3>
      
      <div className="overflow-auto flex-grow">
        {selectedAreas.length > 0 ? (
          <div className="space-y-3">
            {selectedAreas.map((area, index) => (
              <div 
                key={index}
                className="p-2 bg-white rounded-md border shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{area.memorabiliaType || 'Face'} #{index + 1}</span>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => onRemoveArea(index)}
                    >
                      <span className="sr-only">Remove</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(area.width)} x {Math.round(area.height)} px
                </div>
                <div className="text-xs text-gray-500">
                  Confidence: {Math.round((area.confidence || 0) * 100)}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Layers className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p>No areas detected</p>
            <p className="text-xs">Click "Run Detection" to find faces and items</p>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <Toggle
          pressed={autoEnhance}
          onPressedChange={setAutoEnhance}
          className="w-full justify-between px-3 mb-4"
        >
          <div className="flex items-center">
            <Sunset size={16} className="mr-2" />
            Stadium Light Enhancement
          </div>
        </Toggle>
        
        <Button 
          className="w-full" 
          disabled={selectedAreas.length === 0 || isProcessing}
          onClick={onProcessAreas}
        >
          <Maximize2 size={18} className="mr-2" />
          Process {selectedAreas.length} Selected Areas
        </Button>
      </div>
    </>
  );
};

export default DetectionPanel;
