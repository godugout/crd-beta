
import React from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, X, Share, Camera, Maximize2 } from 'lucide-react';

export interface CardViewerProps {
  card: Card;
  fullscreen?: boolean;
  onFullscreenToggle?: () => void;
  onShare?: () => void;
  onCapture?: () => void;
  onClose?: () => void;
  onBack?: () => void;
}

const CardViewer: React.FC<CardViewerProps> = ({
  card,
  fullscreen = false,
  onFullscreenToggle,
  onShare,
  onCapture,
  onClose,
  onBack
}) => {
  if (!card) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg">
        <p className="text-gray-500">Card not found</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`relative ${fullscreen ? 'h-screen' : 'h-[70vh]'} w-full flex items-center justify-center bg-black`}>
        <div className={`relative aspect-[2.5/3.5] max-h-full max-w-full ${fullscreen ? 'scale-90' : 'scale-85'} transition-all duration-300`}>
          <img
            src={card.imageUrl}
            alt={card.title || "Card"}
            className="h-full w-full object-contain rounded-lg shadow-xl"
            style={{
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
            }}
          />
        </div>
        
        {/* Controls overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          {onFullscreenToggle && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onFullscreenToggle}
              className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
            >
              <Maximize2 size={18} />
            </Button>
          )}
          
          {onShare && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onShare}
              className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
            >
              <Share size={18} />
            </Button>
          )}
          
          {onCapture && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onCapture}
              className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
            >
              <Camera size={18} />
            </Button>
          )}
          
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
            >
              <X size={18} />
            </Button>
          )}
        </div>
        
        {onBack && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
          >
            <ArrowLeft size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CardViewer;
