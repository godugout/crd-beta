
import React from 'react';
import { Card } from '@/lib/types/cardTypes';

export interface CardViewerProps {
  card: Card;
  onFullscreenToggle?: () => void;
  onShare?: () => void;
  onCapture?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  fullscreen?: boolean;
}

const CardViewer: React.FC<CardViewerProps> = ({
  card,
  onFullscreenToggle,
  onShare,
  onCapture,
  onBack,
  onClose
}) => {
  return (
    <div className="card-viewer">
      <div className="card-viewer-image">
        <img 
          src={card.imageUrl} 
          alt={card.title} 
          className="w-full h-auto rounded-lg"
        />
      </div>
      
      <div className="card-viewer-details mt-4">
        <h2 className="text-xl font-bold">{card.title}</h2>
        {card.description && <p className="text-gray-700 mt-2">{card.description}</p>}
        
        {card.player && (
          <div className="mt-4">
            <span className="text-sm font-medium">Player: </span>
            <span>{card.player}</span>
          </div>
        )}
        
        {card.team && (
          <div className="mt-1">
            <span className="text-sm font-medium">Team: </span>
            <span>{card.team}</span>
          </div>
        )}
        
        {card.year && (
          <div className="mt-1">
            <span className="text-sm font-medium">Year: </span>
            <span>{card.year}</span>
          </div>
        )}
        
        {card.tags && card.tags.length > 0 && (
          <div className="mt-4">
            <span className="text-sm font-medium">Tags: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {card.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="card-viewer-actions mt-6 flex space-x-2">
        {onBack && (
          <button 
            onClick={onBack}
            className="px-3 py-1 bg-gray-100 rounded-md text-sm"
          >
            Back
          </button>
        )}
        
        {onShare && (
          <button 
            onClick={onShare}
            className="px-3 py-1 bg-gray-100 rounded-md text-sm"
          >
            Share
          </button>
        )}
        
        {onCapture && (
          <button 
            onClick={onCapture}
            className="px-3 py-1 bg-gray-100 rounded-md text-sm"
          >
            Capture
          </button>
        )}
        
        {onFullscreenToggle && (
          <button 
            onClick={onFullscreenToggle}
            className="px-3 py-1 bg-gray-100 rounded-md text-sm"
          >
            Fullscreen
          </button>
        )}
        
        {onClose && (
          <button 
            onClick={onClose}
            className="px-3 py-1 bg-gray-100 rounded-md text-sm"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default CardViewer;
