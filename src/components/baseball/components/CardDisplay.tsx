
import React from 'react';
import { CardData } from '../types/BaseballCard';
import { Button } from '@/components/ui/button';

interface CardDisplayProps {
  cardData: CardData;
  isFlipped: boolean;
  rotateX: number;
  rotateY: number;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  toggleFlip: () => void;
  cardContainerRef: React.RefObject<HTMLDivElement>;
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  cardData,
  isFlipped,
  rotateX,
  rotateY,
  onMouseMove,
  onMouseLeave,
  toggleFlip,
  cardContainerRef
}) => {
  // For debugging
  console.log("Rendering CardDisplay with data:", cardData);
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div 
        ref={cardContainerRef}
        className="perspective-1000 w-64 md:w-80 h-96 md:h-[480px]"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div 
          className="preserve-3d relative w-full h-full transition-transform duration-700 ease-out floating-card"
          style={{ 
            transform: `
              rotateX(${rotateX}deg) 
              rotateY(${rotateY}deg) 
              ${isFlipped ? 'rotateY(180deg)' : ''}
            `,
          }}
        >
          {/* Front of the card */}
          <div 
            className="backface-hidden absolute w-full h-full rounded-lg shadow-2xl bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: `url(${cardData.imageUrl})` }}
          >
            <div className="card-shine absolute inset-0"></div>
          </div>
          
          {/* Back of the card */}
          <div 
            className="backface-hidden absolute w-full h-full rounded-lg shadow-2xl bg-cover bg-center overflow-hidden"
            style={{ 
              transform: 'rotateY(180deg)',
              backgroundImage: cardData.backImageUrl ? `url(${cardData.backImageUrl})` : 'linear-gradient(45deg, #2c3e50, #34495e)'
            }}
          >
            {!cardData.backImageUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-4">{cardData.player}</h3>
                <p className="text-sm mb-6">{cardData.team} • {cardData.position}</p>
                
                {cardData.stats && (
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {cardData.stats.battingAverage && (
                      <div className="text-center">
                        <p className="text-xs mb-1">AVG</p>
                        <p className="text-lg font-bold">{cardData.stats.battingAverage}</p>
                      </div>
                    )}
                    {cardData.stats.homeRuns && (
                      <div className="text-center">
                        <p className="text-xs mb-1">HR</p>
                        <p className="text-lg font-bold">{cardData.stats.homeRuns}</p>
                      </div>
                    )}
                    {cardData.stats.rbis && (
                      <div className="text-center">
                        <p className="text-xs mb-1">RBI</p>
                        <p className="text-lg font-bold">{cardData.stats.rbis}</p>
                      </div>
                    )}
                    {cardData.stats.era && (
                      <div className="text-center">
                        <p className="text-xs mb-1">ERA</p>
                        <p className="text-lg font-bold">{cardData.stats.era}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
        <div className="container mx-auto flex justify-center">
          <Button 
            onClick={toggleFlip}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Flip Card
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
