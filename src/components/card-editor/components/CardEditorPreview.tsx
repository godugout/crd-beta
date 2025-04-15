
import React from 'react';
import { Card } from '@/components/ui/card';
import { useCardEditor } from '@/lib/state/card-editor/context';

interface CardEditorPreviewProps {
  className?: string;
}

const CardEditorPreview: React.FC<CardEditorPreviewProps> = ({ className }) => {
  const { design, effectsApplied } = useCardEditor();
  
  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="p-4 bg-gray-50 border">
        <div className="text-center">
          <h3 className="text-sm font-medium mb-1">Card Preview</h3>
          <p className="text-xs text-muted-foreground mb-3">Live preview of your card</p>
        </div>
        
        <div className="aspect-[2.5/3.5] border rounded-lg overflow-hidden flex items-center justify-center">
          <div 
            className="relative w-full h-full"
            style={{
              borderRadius: design.borderRadius,
              backgroundColor: design.backgroundColor,
              border: `2px solid ${design.borderColor}`,
              overflow: 'hidden'
            }}
          >
            {design.imageUrl ? (
              <div className="absolute inset-0">
                <img
                  src={design.imageUrl}
                  alt={design.title}
                  className="w-full h-full object-cover"
                  style={{
                    filter: effectsApplied.includes('vintage')
                      ? 'sepia(0.5) contrast(1.2)'
                      : effectsApplied.includes('chrome')
                      ? 'contrast(1.2) brightness(1.1)'
                      : 'none',
                  }}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <p className="text-gray-400 text-center p-4">Upload an image</p>
              </div>
            )}
            
            {/* Title overlay */}
            {design.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-center">
                <p className="text-white font-semibold">{design.title}</p>
                {design.player && (
                  <p className="text-white text-sm opacity-80">{design.player}</p>
                )}
                {design.team && design.year && (
                  <p className="text-white text-xs opacity-70">{design.team} · {design.year}</p>
                )}
              </div>
            )}
            
            {/* Effect indicators */}
            {effectsApplied.length > 0 && (
              <div className="absolute top-1 right-1 flex flex-col gap-1">
                {effectsApplied.map(effect => (
                  <div key={effect} className="bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded">
                    {effect}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Card details summary */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-2">Card Details</h3>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Title:</span>
            <span>{design.title || '-'}</span>
          </div>
          
          {design.player && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Player:</span>
              <span>{design.player}</span>
            </div>
          )}
          
          {design.team && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Team:</span>
              <span>{design.team}</span>
            </div>
          )}
          
          {design.year && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Year:</span>
              <span>{design.year}</span>
            </div>
          )}
          
          {design.tags && design.tags.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tags:</span>
              <span>{design.tags.join(', ')}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CardEditorPreview;
