
import React, { useState, useRef } from 'react';
import { CardData } from '../types/BaseballCard';
import CardDisplay from './CardDisplay';
import CardDetails from './CardDetails';
import CardStats from './CardStats';
import CardNavigation from './CardNavigation';
import CardHeader from './CardHeader';

interface CardContainerProps {
  cardData: CardData;
  allCards: CardData[];
}

const CardContainer: React.FC<CardContainerProps> = ({ cardData, allCards }) => {
  // For debugging
  console.log("Rendering CardContainer with cardData:", cardData);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      <CardHeader cardData={cardData} />
      
      <CardDisplay 
        cardData={cardData}
        isFlipped={isFlipped}
        rotateX={rotateX}
        rotateY={rotateY}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        toggleFlip={toggleFlip}
        cardContainerRef={cardContainerRef}
      />

      <CardDetails card={cardData} />
      {cardData.stats && <CardStats stats={cardData.stats} />}
      <CardNavigation cards={allCards} currentCardId={cardData.id} />
    </div>
  );
};

export default CardContainer;
