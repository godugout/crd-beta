
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface ArSettingsPanelProps {
  scale: number;
  setScale: (scale: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
}

const ArSettingsPanel: React.FC<ArSettingsPanelProps> = ({
  scale,
  setScale,
  rotation,
  setRotation
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">AR Settings</h3>
        <p className="text-gray-600 mb-4">
          Adjust how cards appear in augmented reality.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Scale ({scale}%)</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="50" 
                max="150" 
                value={scale}
                onChange={(e) => setScale(parseInt(e.target.value))}
                className="w-full" 
              />
              <span className="ml-2 text-sm w-12 text-right">{scale}%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Rotation ({rotation}°)</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0" 
                max="359" 
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full" 
              />
              <span className="ml-2 text-sm w-12 text-right">{rotation}°</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <input id="auto-rotate" type="checkbox" className="mr-2" />
            <label htmlFor="auto-rotate" className="text-sm">Auto-rotate card in AR mode</label>
          </div>
          
          <div className="flex items-center">
            <input id="show-stats" type="checkbox" className="mr-2" defaultChecked />
            <label htmlFor="show-stats" className="text-sm">Show card stats in AR</label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Device Settings</h3>
        <p className="text-gray-600 mb-4">
          Configure your device for optimal AR experience.
        </p>
        
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-between">
            Camera Calibration
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Button>
          
          <Button variant="outline" className="w-full justify-between">
            Test Device Compatibility
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArSettingsPanel;
