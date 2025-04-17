
// Create a missing CardDetailView component to fix error in Experiences.tsx
import React from 'react';
import { Card } from '@/lib/types';
import { useCards } from '@/hooks/useCards';
import { Button } from '@/components/ui/button';
import { Share2, Download } from 'lucide-react';
import CardViewer from '@/components/card-viewer/CardViewer';

interface CardDetailViewProps {
  cardId: string;
  onBack?: () => void;
}

const CardDetailView: React.FC<CardDetailViewProps> = ({ cardId, onBack }) => {
  const { getCard } = useCards();
  const card = getCard ? getCard(cardId) : null;
  
  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-white mb-4">Card not found</p>
        <Button onClick={onBack} variant="outline">
          Back to Gallery
        </Button>
      </div>
    );
  }
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: card.description,
        url: window.location.href,
      }).catch(err => console.error('Error sharing card:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      // In a real app, show a toast notification here
      alert('Link copied to clipboard');
    }
  };
  
  return (
    <div className="container px-4 py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-white">{card.title}</h1>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-[2.5/3.5] bg-black/20 rounded-lg overflow-hidden">
          <CardViewer 
            card={card}
            activeEffects={card.effects || []}
            isFullscreen={false}
            onBack={onBack}
          />
        </div>
        
        <div className="space-y-4 text-white">
          <div>
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <div className="space-y-1 text-gray-300">
              {card.player && <p>Player: {card.player}</p>}
              {card.team && <p>Team: {card.team}</p>}
              {card.year && <p>Year: {card.year}</p>}
              <p>Rarity: {card.rarity || 'Common'}</p>
            </div>
          </div>
          
          {card.description && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-300">{card.description}</p>
            </div>
          )}
          
          {card.tags && card.tags.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDetailView;
