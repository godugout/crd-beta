
import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { X, AlertCircle, FileText, Layers, Image } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CardDiagnosticsProps {
  card: Card;
  isVisible: boolean;
  renderingStats: {
    imageLoaded: boolean;
    textureApplied: boolean;
    effectsApplied: string[];
    errors: string[];
    warnings: string[];
    renderTime: number;
  };
}

const CardDiagnostics: React.FC<CardDiagnosticsProps> = ({
  card,
  isVisible,
  renderingStats
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-4 right-4 w-80 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg z-50 shadow-xl border border-white/10">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/20">
        <h3 className="font-medium flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 text-yellow-400" />
          Card Diagnostics
        </h3>
      </div>
      
      <div className="space-y-3 text-sm">
        {/* Card Info */}
        <div>
          <h4 className="text-xs text-gray-400 mb-1">Card Details</h4>
          <div className="grid grid-cols-2 gap-1">
            <div className="truncate">ID:</div>
            <div className="truncate text-gray-300">{card.id.substring(0, 8)}...</div>
            <div>Title:</div>
            <div className="truncate text-gray-300">{card.title}</div>
          </div>
        </div>
        
        {/* Image Loading */}
        <div>
          <h4 className="text-xs text-gray-400 mb-1">Image Resources</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Front Image:</span>
              <Badge variant={card.imageUrl ? "success" : "destructive"} className="text-[10px] h-5">
                {card.imageUrl ? "✓ Available" : "✗ Missing"}
              </Badge>
            </div>
            <div className="text-[10px] text-gray-500 break-all">{card.imageUrl || "No URL"}</div>
            
            <div className="flex justify-between">
              <span>Texture Loading:</span>
              <Badge variant={renderingStats.imageLoaded ? "success" : "destructive"} className="text-[10px] h-5">
                {renderingStats.imageLoaded ? "✓ Loaded" : "✗ Failed"}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span>Texture Applied:</span>
              <Badge variant={renderingStats.textureApplied ? "success" : "destructive"} className="text-[10px] h-5">
                {renderingStats.textureApplied ? "✓ Applied" : "✗ Failed"}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Effects */}
        <div>
          <h4 className="text-xs text-gray-400 mb-1">Active Effects</h4>
          <div className="flex flex-wrap gap-1">
            {renderingStats.effectsApplied.length > 0 ? (
              renderingStats.effectsApplied.map((effect, index) => (
                <Badge key={index} variant="outline" className="text-[10px] bg-purple-900/50">
                  {effect}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 text-xs">No effects applied</span>
            )}
          </div>
        </div>
        
        {/* Errors & Warnings */}
        {renderingStats.errors.length > 0 && (
          <div>
            <h4 className="text-xs text-red-400 mb-1">Errors</h4>
            <ul className="text-[10px] text-red-300 list-disc pl-4 space-y-1">
              {renderingStats.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {renderingStats.warnings.length > 0 && (
          <div>
            <h4 className="text-xs text-yellow-400 mb-1">Warnings</h4>
            <ul className="text-[10px] text-yellow-300 list-disc pl-4 space-y-1">
              {renderingStats.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Render Stats */}
        <div>
          <h4 className="text-xs text-gray-400 mb-1">Performance</h4>
          <div className="flex justify-between text-xs">
            <span>Render Time:</span>
            <span className={renderingStats.renderTime > 16 ? "text-yellow-400" : "text-green-400"}>
              {renderingStats.renderTime.toFixed(2)} ms 
              {renderingStats.renderTime > 16 && " (slow)"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-white/20 text-xs text-gray-400">
        Press <kbd className="bg-gray-700 px-1.5 py-0.5 rounded">D</kbd> to hide diagnostics
      </div>
    </div>
  );
};

export default CardDiagnostics;
