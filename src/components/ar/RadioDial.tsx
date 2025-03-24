
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/lib/types';
import { RotateCcw } from 'lucide-react';

interface RadioDialProps {
  cards: Card[];
  activeCardId: string | null;
  onSelectCard: (id: string) => void;
}

const RadioDial: React.FC<RadioDialProps> = ({ cards, activeCardId, onSelectCard }) => {
  const dialRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  
  // Calculate which card to select based on rotation
  useEffect(() => {
    if (cards.length === 0) return;
    
    // Map 360 degrees to the number of cards
    const anglePerCard = 360 / cards.length;
    // Normalize rotation to positive values between 0-360
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    // Find the card index based on rotation
    const cardIndex = Math.floor(normalizedRotation / anglePerCard);
    
    // Select the appropriate card
    if (cards[cardIndex] && cards[cardIndex].id !== activeCardId) {
      onSelectCard(cards[cardIndex].id);
    }
  }, [rotation, cards, activeCardId, onSelectCard]);

  const getCenter = () => {
    if (!dialRef.current) return { x: 0, y: 0 };
    const rect = dialRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  };

  const calculateAngle = (x: number, y: number) => {
    const center = getCenter();
    // Calculate angle in radians
    const angleRad = Math.atan2(y - center.y, x - center.x);
    // Convert to degrees
    return (angleRad * 180) / Math.PI;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartAngle(calculateAngle(e.clientX, e.clientY) - rotation);
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const currentAngle = calculateAngle(e.clientX, e.clientY);
      const newRotation = currentAngle - startAngle;
      
      // Calculate rotation speed for animation
      const speed = Math.abs(newRotation - rotation) * 0.5;
      document.documentElement.style.setProperty('--dial-speed', `${speed}s`);
      
      setRotation(newRotation);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
  };

  useEffect(() => {
    // Clean up cursor style when component unmounts
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <div 
      className="absolute bottom-24 right-6 z-50 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="relative w-24 h-24 bg-black/40 backdrop-blur-md rounded-full border-2 border-white/20 flex items-center justify-center shadow-lg">
        {/* Card indicators around the dial */}
        {cards.map((card, index) => {
          const angle = (index * 360) / cards.length;
          const isActive = card.id === activeCardId;
          return (
            <div 
              key={card.id}
              className={`absolute w-2 h-2 rounded-full transition-colors duration-300 ${isActive ? 'bg-blue-500' : 'bg-white/40'}`}
              style={{
                transform: `rotate(${angle}deg) translateY(-36px) rotate(-${angle}deg)`,
                top: '50%',
                left: '50%',
              }}
            />
          );
        })}
        
        {/* Rotating knob */}
        <div 
          ref={dialRef}
          className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center shadow-inner cursor-grab relative"
          style={{ transform: `rotate(${rotation}deg)` }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800"></div>
          </div>
          
          {/* Knob indicator */}
          <div className="absolute top-2 w-2 h-6 bg-white/80 rounded-full" />
          
          {/* Center graphic */}
          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
            <RotateCcw className="h-5 w-5 text-white/70" />
          </div>
        </div>
      </div>
      
      {/* Active card name */}
      {activeCardId && (
        <div className="mt-2 text-center text-xs text-white/90 bg-black/30 rounded-md px-3 py-1 backdrop-blur-sm">
          {cards.find(c => c.id === activeCardId)?.title.split(' ').slice(0, 3).join(' ')}
        </div>
      )}
    </div>
  );
};

export default RadioDial;
