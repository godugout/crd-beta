
import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/lib/types';

interface ArCardItemProps {
  card: Card;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

interface Position {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotation: number;
}

const ArCardItem: React.FC<ArCardItemProps> = ({
  card,
  index,
  isSelected,
  onSelect
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0,
    z: -100 - (index * 20), // stagger initial position
    scale: 1,
    rotation: 0
  });
  
  // Touch gesture variables
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchPosition, setLastTouchPosition] = useState({ x: 0, y: 0 });
  const [initialTouchDistance, setInitialTouchDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);
  
  // Handle selection
  const handleSelect = () => {
    onSelect(card.id);
  };

  // Calculate distance between two touch points
  const getTouchDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - prepare for dragging
      setIsDragging(true);
      setLastTouchPosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    } else if (e.touches.length === 2) {
      // Two touches - prepare for pinch zoom
      setInitialTouchDistance(getTouchDistance(e.touches));
      setInitialScale(position.scale);
    }
    
    // Select the card when touched
    handleSelect();
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSelected) return;
    
    if (isDragging && e.touches.length === 1) {
      // Handle dragging
      const touch = e.touches[0];
      const dx = touch.clientX - lastTouchPosition.x;
      const dy = touch.clientY - lastTouchPosition.y;
      
      setPosition(prev => ({
        ...prev,
        x: prev.x + dx * 0.5, // Scale down movements for more precise control
        y: prev.y + dy * 0.5
      }));
      
      setLastTouchPosition({
        x: touch.clientX,
        y: touch.clientY
      });
    } else if (e.touches.length === 2) {
      // Handle pinch zoom
      const currentDistance = getTouchDistance(e.touches);
      const scaleFactor = currentDistance / initialTouchDistance;
      
      setPosition(prev => ({
        ...prev,
        scale: Math.max(0.5, Math.min(2, initialScale * scaleFactor))
      }));
    }
    
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Double tap to reset position
  const handleDoubleTap = () => {
    if (isSelected) {
      setPosition({
        x: 0,
        y: 0,
        z: -100 - (index * 20),
        scale: 1,
        rotation: 0
      });
    }
  };

  // Apply rotation when requested through parent controls
  useEffect(() => {
    if (isSelected && cardRef.current) {
      // Any effects that should happen when card is selected
    }
  }, [isSelected]);

  return (
    <div 
      ref={cardRef}
      className={`absolute transition-shadow ${isSelected ? 'shadow-lg ring-2 ring-blue-500' : ''}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px) scale(${position.scale}) rotate(${position.rotation}deg)`,
        width: '120px',
        height: '168px',
        transformOrigin: 'center',
        touchAction: 'none',
        zIndex: isSelected ? 10 : 1,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleTap}
    >
      <img 
        src={card.imageUrl} 
        alt={card.title}
        className="w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
    </div>
  );
};

export default ArCardItem;
