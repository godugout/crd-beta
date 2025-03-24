
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BASEBALL_CARDS } from './hooks/useBaseballCard';
import { useBaseballCard } from './hooks/useBaseballCard';
import CardDetails from './components/CardDetails';
import CardStats from './components/CardStats';
import CardNavigation from './components/CardNavigation';

const BaseballCardRenderer: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const { cardData, isLoading } = useBaseballCard();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current) return;
    
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const maxRotation = 12;
    
    const newRotateY = ((x - centerX) / centerX) * maxRotation;
    const newRotateX = ((centerY - y) / centerY) * maxRotation;
    
    setRotateX(newRotateX);
    setRotateY(newRotateY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  if (isLoading || !cardData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-64 h-96 bg-gray-800 rounded-lg"></div>
          <div className="mt-4 h-4 bg-gray-800 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-red-600 border-none text-white uppercase font-bold px-3 py-1">
                Live
              </Badge>
              <span className="text-xs text-gray-300">Card Showcase</span>
            </div>
            <div className="text-xs text-gray-300">
              {cardData.manufacturer} • {cardData.year}
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">{cardData.title}</h1>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          ref={cardContainerRef}
          className="perspective-1000 w-64 md:w-80 h-96 md:h-[480px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
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
            <div 
              className="backface-hidden absolute w-full h-full rounded-lg shadow-2xl bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `url(${cardData.imageUrl})` }}
            >
              <div className="card-shine absolute inset-0"></div>
            </div>
            
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
      </div>

      <CardDetails card={cardData} />
      {cardData.stats && <CardStats stats={cardData.stats} />}
      <CardNavigation cards={BASEBALL_CARDS} currentCardId={cardData.id} />

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

export default BaseballCardRenderer;

