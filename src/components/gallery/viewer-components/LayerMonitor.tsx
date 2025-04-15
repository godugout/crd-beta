
import React from 'react';
import { Layers } from 'lucide-react';

interface LayerStatus {
  name: string;
  loaded: boolean;
  timestamp: number;
}

interface LayerMonitorProps {
  isVisible: boolean;
  layers: LayerStatus[];
}

const LayerMonitor: React.FC<LayerMonitorProps> = ({ isVisible, layers }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-xs shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <Layers size={14} />
        <span className="font-medium">Layer Monitor</span>
      </div>
      <div className="space-y-1 max-h-32 overflow-auto">
        {layers.map((layer, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className={`w-2 h-2 rounded-full ${
                layer.loaded ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
              }`}
            />
            <span>{layer.name}</span>
            {layer.loaded && (
              <span className="text-gray-400 ml-auto">
                {layer.timestamp.toFixed(0)}ms
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerMonitor;
