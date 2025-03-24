
import React from 'react';
import { Card } from '@/lib/types';

interface ArInfoOverlayProps {
  selectedCardId: string | null;
  activeCards: Card[];
}

const ArInfoOverlay: React.FC<ArInfoOverlayProps> = ({
  selectedCardId,
  activeCards
}) => {
  if (!selectedCardId) return null;

  const selectedCard = activeCards.find(c => c.id === selectedCardId);
  if (!selectedCard) return null;

  return (
    <div className="absolute bottom-20 left-4 right-4 z-40 bg-black/40 backdrop-blur-sm text-white p-3 rounded-lg animate-fadeIn">
      <div className="text-sm">
        <p className="font-semibold">{selectedCard.title}</p>
        <p className="text-xs text-white/70 mt-0.5">{selectedCard.description}</p>
      </div>
      <div className="text-xs text-white/70 mt-2">
        <p>Use the dial to cycle through cards • Drag to position • Move mouse quickly to spin</p>
      </div>
    </div>
  );
};

export default ArInfoOverlay;
