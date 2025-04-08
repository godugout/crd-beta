
import React from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedCropBoxProps, MemorabiliaType } from '@/components/card-upload/cardDetection';
import { Check, Trash2 } from 'lucide-react';

interface DetectionPanelProps {
  selectedAreas: EnhancedCropBoxProps[];
  onProcessArea: (index: number) => Promise<void>;
}

const DetectionPanel: React.FC<DetectionPanelProps> = ({
  selectedAreas,
  onProcessArea
}) => {
  return (
    <div>
      <h3 className="font-medium mb-4">Detected Areas</h3>
      
      {selectedAreas.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No items detected</p>
          <p className="text-sm mt-2">Try running detection again or manually add selection areas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {selectedAreas.map((area, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium" 
                  style={{ backgroundColor: area.color || '#00AAFF', color: 'white' }}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{area.memorabiliaType || 'Unknown'}</div>
                  <div className="text-xs text-gray-500">
                    {Math.round(area.width)}x{Math.round(area.height)}px
                  </div>
                </div>
              </div>
              
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onProcessArea(index)}
              >
                <Check className="h-4 w-4 mr-1" />
                Extract
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetectionPanel;
