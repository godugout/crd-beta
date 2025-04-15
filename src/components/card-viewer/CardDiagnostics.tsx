
import React from 'react';
import { Card } from '@/lib/types';
import { Html } from '@react-three/drei';

interface RenderingStats {
  imageLoaded: boolean;
  textureApplied: boolean;
  effectsApplied: string[];
  errors: string[];
  warnings: string[];
  renderTime: number;
}

interface CardDiagnosticsProps {
  card: Card;
  isVisible: boolean;
  renderingStats: RenderingStats;
}

const CardDiagnostics: React.FC<CardDiagnosticsProps> = ({ card, isVisible, renderingStats }) => {
  if (!isVisible) return null;
  
  return (
    <Html position={[3, 0, 0]} transform>
      <div className="bg-black/90 p-4 rounded text-white font-mono" style={{ width: '300px' }}>
        <h3 className="font-bold text-lg mb-2">Diagnostics</h3>
        
        <div className="mb-3">
          <p className="text-xs text-gray-400">Card Info:</p>
          <p className="text-sm">ID: {card.id}</p>
          <p className="text-sm">Title: {card.title}</p>
          <p className="text-sm truncate">Image: {card.imageUrl || 'N/A'}</p>
        </div>
        
        <div className="mb-3">
          <p className="text-xs text-gray-400">Status:</p>
          <p className="text-sm flex justify-between">
            <span>Image Loaded:</span> 
            <span className={renderingStats.imageLoaded ? "text-green-400" : "text-red-400"}>
              {renderingStats.imageLoaded ? "✓" : "✗"}
            </span>
          </p>
          <p className="text-sm flex justify-between">
            <span>Texture Applied:</span>
            <span className={renderingStats.textureApplied ? "text-green-400" : "text-red-400"}>
              {renderingStats.textureApplied ? "✓" : "✗"}
            </span>
          </p>
        </div>
        
        <div className="mb-3">
          <p className="text-xs text-gray-400">Effects:</p>
          {renderingStats.effectsApplied.length === 0 ? (
            <p className="text-sm text-yellow-400">No active effects</p>
          ) : (
            renderingStats.effectsApplied.map((effect, i) => (
              <p key={i} className="text-sm text-green-400">• {effect}</p>
            ))
          )}
        </div>
        
        {renderingStats.errors.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-400">Errors:</p>
            {renderingStats.errors.map((error, i) => (
              <p key={i} className="text-sm text-red-400">{error}</p>
            ))}
          </div>
        )}
        
        {renderingStats.warnings.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-400">Warnings:</p>
            {renderingStats.warnings.map((warning, i) => (
              <p key={i} className="text-sm text-yellow-400">{warning}</p>
            ))}
          </div>
        )}
        
        <div className="mt-2">
          <p className="text-xs text-gray-400">Performance:</p>
          <p className="text-sm">Render Time: {renderingStats.renderTime.toFixed(2)}ms</p>
        </div>
      </div>
    </Html>
  );
};

export default CardDiagnostics;
