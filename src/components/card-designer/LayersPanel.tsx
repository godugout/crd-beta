import React from 'react';
import { CardLayer } from '@/lib/types/cardTypes';

interface LayersPanelProps {
  layers: CardLayer[];
  activeLayerId: string;
  onSelectLayer: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayerUp: (id: string) => void;
  onMoveLayerDown: (id: string) => void;
  onUpdateLayer?: (id: string, updates: Partial<CardLayer>) => void;
  onToggleLayerVisibility?: (id: string) => void;
  onToggleLayerLock?: (id: string) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  activeLayerId,
  onSelectLayer,
  onDeleteLayer,
  onMoveLayerUp,
  onMoveLayerDown,
  onUpdateLayer,
  onToggleLayerVisibility,
  onToggleLayerLock
}) => {
  // Replace with actual implementation
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Layers</h3>
      <div className="space-y-2">
        {layers.map(layer => (
          <div
            key={layer.id}
            className={`p-2 border rounded flex items-center justify-between ${
              layer.id === activeLayerId ? 'bg-gray-100 border-blue-500' : ''
            }`}
            onClick={() => onSelectLayer(layer.id)}
          >
            <div className="flex items-center">
              <span className="ml-2">{layer.type}</span>
            </div>
            <div className="flex space-x-1">
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleLayerVisibility) {
                    onToggleLayerVisibility(layer.id);
                  }
                }}
              >
                {layer.visible !== false ? '👁️' : '🔴'}
              </button>
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleLayerLock) {
                    onToggleLayerLock(layer.id);
                  }
                }}
              >
                {layer.locked ? '🔒' : '🔓'}
              </button>
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveLayerUp(layer.id);
                }}
              >
                ↑
              </button>
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveLayerDown(layer.id);
                }}
              >
                ↓
              </button>
              <button
                className="p-1 hover:bg-gray-100 rounded text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteLayer(layer.id);
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayersPanel;
