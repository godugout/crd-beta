
import React, { useEffect, useState } from 'react';
import { Card } from '@/lib/types';
import { useParams } from 'react-router-dom';
import { useCardContext } from '@/context/CardContext';
import { useToast } from '@/hooks/use-toast';

const ImmersiveCardViewer = ({ card: initialCard }: { card: Card }) => {
  const { id } = useParams();
  const { getCardById } = useCardContext();
  const [card, setCard] = useState<Card>(initialCard);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();
  
  // Fall back image for when the card image doesn't load
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
  
  useEffect(() => {
    if (id) {
      const foundCard = getCardById(id);
      if (foundCard) {
        console.log("Found card in context:", foundCard);
        setCard(foundCard);
      } else {
        console.warn("Card not found in context:", id);
      }
    }
  }, [id, getCardById]);

  useEffect(() => {
    if (card) {
      console.log("Current card data:", card);
      if (!card.imageUrl) {
        console.warn("Card has no image URL:", card.id);
        toast({
          title: "Image not available",
          description: "Using a fallback image for this card"
        });
      }
    }
  }, [card, toast]);
  
  const handleImageError = () => {
    console.error("Failed to load image:", card.imageUrl);
    setImageError(true);
    toast({
      title: "Image failed to load",
      description: "Using a fallback image",
      variant: "destructive"
    });
  };

  return (
    <div className="p-4 h-full flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4 text-white">{card.title}</h2>
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-auto">
        {/* Card image with fallback handling */}
        <div className="relative aspect-[3/4] w-full mb-4 bg-gray-700 rounded overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
          )}
          
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <div className="text-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 mx-auto mb-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
                <p>Failed to load image</p>
              </div>
            </div>
          )}
          
          <img 
            src={card.imageUrl || fallbackImage} 
            alt={card.title} 
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              // Try the fallback image if the original fails
              if (e.currentTarget.src !== fallbackImage) {
                e.currentTarget.src = fallbackImage;
              } else {
                handleImageError();
              }
            }}
          />
        </div>
        
        {card.description && (
          <p className="text-gray-300 mb-4">{card.description}</p>
        )}
        
        {/* Display card stats if available */}
        {card.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {card.stats.battingAverage && (
              <div className="stat-item">
                <span className="text-sm text-gray-400">Batting Average</span>
                <span className="block text-lg font-medium text-white">{card.stats.battingAverage}</span>
              </div>
            )}
            {card.stats.homeRuns && (
              <div className="stat-item">
                <span className="text-sm text-gray-400">Home Runs</span>
                <span className="block text-lg font-medium text-white">{card.stats.homeRuns}</span>
              </div>
            )}
            {card.stats.rbis && (
              <div className="stat-item">
                <span className="text-sm text-gray-400">RBIs</span>
                <span className="block text-lg font-medium text-white">{card.stats.rbis}</span>
              </div>
            )}
            {card.stats.era && (
              <div className="stat-item">
                <span className="text-sm text-gray-400">ERA</span>
                <span className="block text-lg font-medium text-white">{card.stats.era}</span>
              </div>
            )}
            {card.stats.wins && (
              <div className="stat-item">
                <span className="text-sm text-gray-400">Wins</span>
                <span className="block text-lg font-medium text-white">{card.stats.wins}</span>
              </div>
            )}
            {card.stats.strikeouts && (
              <div className="stat-item">
                <span className="text-sm text-gray-400">Strikeouts</span>
                <span className="block text-lg font-medium text-white">{card.stats.strikeouts}</span>
              </div>
            )}
            {card.stats.careerYears && (
              <div className="stat-item">
                <span className="text-sm text-gray-400">Career Years</span>
                <span className="block text-lg font-medium text-white">{card.stats.careerYears}</span>
              </div>
            )}
            {card.stats.ranking && (
              <div className="stat-item">
                <span className="text-sm text-gray-400">Ranking</span>
                <span className="block text-lg font-medium text-white">{card.stats.ranking}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImmersiveCardViewer;
