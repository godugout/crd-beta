
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import ImmersiveCardViewer from '@/components/card-viewer/ImmersiveCardViewer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Layers, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/lib/types';
import PageLayout from '@/components/navigation/PageLayout';

const EFFECTS = ['Holographic', 'Refractor', 'Shimmer', 'Vintage', 'Chrome'];

const ImmersiveCardViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, getCardById } = useCards();
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({
    Holographic: 0.5,
    Refractor: 0.5,
    Shimmer: 0.5,
    Vintage: 0.5,
    Chrome: 0.5,
  });

  const card = id ? getCardById(id) : undefined;
  const cardIndex = cards.findIndex(c => c.id === id);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && cardIndex > 0) {
        navigate(`/cards/${cards[cardIndex - 1].id}`);
      } else if (e.key === 'ArrowRight' && cardIndex < cards.length - 1) {
        navigate(`/cards/${cards[cardIndex + 1].id}`);
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFlipped(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cardIndex, cards, navigate]);

  // Add the card's default effects if available
  useEffect(() => {
    if (card?.effects && card.effects.length > 0) {
      setActiveEffects(card.effects);
    } else if (activeEffects.length === 0) {
      // Default effect if none set
      setActiveEffects(['Holographic']);
    }
  }, [card, activeEffects.length]);

  if (!card) {
    return (
      <PageLayout title="Card Not Found" description="The card you requested could not be found.">
        <div className="flex flex-col items-center justify-center py-32">
          <div className="bg-red-900/20 text-white p-8 rounded-lg text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
            <p className="mb-6">Sorry, we couldn't find the card you're looking for. It may have been deleted or never existed.</p>
            <Button onClick={() => navigate('/cards')}>Return to Gallery</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const handleEffectToggle = (effect: string) => {
    setActiveEffects(prev => 
      prev.includes(effect)
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    );
  };

  const handleEffectIntensityChange = (effect: string, value: number) => {
    setEffectIntensities(prev => ({
      ...prev,
      [effect]: value
    }));
  };

  const handleCardNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && cardIndex > 0) {
      navigate(`/cards/${cards[cardIndex - 1].id}`);
    } else if (direction === 'next' && cardIndex < cards.length - 1) {
      navigate(`/cards/${cards[cardIndex + 1].id}`);
    }
  };

  const handleCardSnapshot = () => {
    // Implementation for taking card snapshots will go here
    toast.success("Snapshot feature coming soon!");
  };

  const handleShareCard = () => {
    // Implementation for sharing card will go here
    if (navigator.share) {
      navigator.share({
        title: `Check out this card: ${card.title}`,
        text: card.description || `Check out this awesome card: ${card.title}`,
        url: window.location.href,
      })
        .then(() => toast.success('Card shared successfully'))
        .catch((error) => console.error('Error sharing card:', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  return (
    <PageLayout 
      title={card.title || 'Card Viewer'} 
      description={card.description || 'View your digital trading card in 3D'}
      backLink="/cards"
      backLinkText="Back to Gallery"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Card Viewer */}
          <div className="lg:w-3/4">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl">
              <ImmersiveCardViewer 
                card={card}
                isFlipped={isFlipped}
                activeEffects={activeEffects}
                effectIntensities={effectIntensities}
              />
            </div>
            
            {/* Card navigation controls */}
            <div className="flex justify-between mt-4">
              <Button
                variant="outline" 
                className="text-sm"
                disabled={cardIndex <= 0}
                onClick={() => handleCardNavigation('prev')}
              >
                <ChevronLeft className="mr-1" size={16} />
                Previous Card
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="text-sm"
                >
                  {isFlipped ? 'Show Front' : 'Show Back'}
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleCardSnapshot}
                  className="text-sm"
                >
                  <Download className="mr-1" size={16} />
                  Snapshot
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleShareCard}
                  className="text-sm"
                >
                  <Share2 className="mr-1" size={16} />
                  Share
                </Button>
              </div>
              
              <Button
                variant="outline" 
                className="text-sm"
                disabled={cardIndex >= cards.length - 1}
                onClick={() => handleCardNavigation('next')}
              >
                Next Card
                <ChevronRight className="ml-1" size={16} />
              </Button>
            </div>
          </div>
          
          {/* Right column - Card Info & Effects */}
          <div className="lg:w-1/4 space-y-6">
            {/* Card Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">{card.title}</h2>
              {card.description && (
                <p className="text-gray-300 text-sm mb-4">{card.description}</p>
              )}
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {card.player && (
                  <>
                    <div className="text-gray-400">Player:</div>
                    <div>{card.player}</div>
                  </>
                )}
                
                {card.team && (
                  <>
                    <div className="text-gray-400">Team:</div>
                    <div>{card.team}</div>
                  </>
                )}
                
                {card.year && (
                  <>
                    <div className="text-gray-400">Year:</div>
                    <div>{card.year}</div>
                  </>
                )}
              </div>
              
              {card.tags && card.tags.length > 0 && (
                <div className="mt-4">
                  <div className="text-gray-400 text-sm mb-2">Tags:</div>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-700 text-gray-200 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Effects Controls */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={16} />
                <h3 className="font-medium">Card Effects</h3>
              </div>
              
              <div className="space-y-3">
                {EFFECTS.map((effect) => (
                  <div key={effect} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeEffects.includes(effect)}
                          onChange={() => handleEffectToggle(effect)}
                          className="rounded border-gray-600 text-blue-500 mr-2"
                        />
                        {effect}
                      </label>
                      <span className="text-xs text-gray-400">
                        {Math.round(effectIntensities[effect] * 100)}%
                      </span>
                    </div>
                    
                    {activeEffects.includes(effect) && (
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={effectIntensities[effect]}
                        onChange={(e) => handleEffectIntensityChange(
                          effect, 
                          parseFloat(e.target.value)
                        )}
                        className="w-full"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setActiveEffects([])}
                >
                  Reset Effects
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ImmersiveCardViewerPage;
