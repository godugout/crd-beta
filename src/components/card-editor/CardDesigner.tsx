import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  Trash2,
  MoveHorizontal,
  Pin,
  MapPin,
  PenLine
} from 'lucide-react';
import { HotspotData } from '@/lib/types/cardTypes'; // Fixed import

interface CardDesignerProps {
  card?: Card;
  onAddHotspot?: (hotspot: HotspotData) => void;
  onRemoveHotspot?: (id: string) => void;
  onUpdateHotspot?: (hotspot: HotspotData) => void;
  className?: string;
}

const CardDesigner: React.FC<CardDesignerProps> = ({
  card,
  onAddHotspot,
  onRemoveHotspot,
  onUpdateHotspot,
  className
}) => {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [isAddingHotspot, setIsAddingHotspot] = useState(false);
  
  // Extract hotspots from card metadata safely
  const hotspots: HotspotData[] = 
    card?.designMetadata?.hotspots && Array.isArray(card.designMetadata.hotspots)
      ? card.designMetadata.hotspots
      : [];
  
  const handleAddHotspot = () => {
    if (!onAddHotspot) return;
    
    const newHotspot: HotspotData = {
      id: `hotspot-${Date.now()}`,
      x: 50, // center position
      y: 50, // center position
      width: 10,
      height: 10,
      title: 'New Hotspot',
      content: 'Add your content here',
      type: 'info'
    };
    
    onAddHotspot(newHotspot);
    setActiveHotspotId(newHotspot.id);
  };
  
  const handleHotspotClick = (id: string) => {
    setActiveHotspotId(id === activeHotspotId ? null : id);
  };
  
  const handleUpdateHotspot = (updatedHotspot: HotspotData) => {
    if (!onUpdateHotspot) return;
    onUpdateHotspot(updatedHotspot);
  };
  
  const handleRemoveHotspot = (id: string) => {
    if (!onRemoveHotspot) return;
    onRemoveHotspot(id);
  };
  
  return (
    <div className={cn("relative bg-gray-800 aspect-[2.5/3.5] rounded-lg overflow-hidden", className)}>
      {/* Card image */}
      {card?.imageUrl && (
        <img
          src={card.imageUrl}
          alt={card.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Hotspot overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className={cn(
              "absolute border-2 rounded cursor-pointer pointer-events-auto",
              activeHotspotId === hotspot.id
                ? "border-blue-500 bg-blue-500/20"
                : "border-white/40 bg-white/10 hover:bg-white/20"
            )}
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              width: `${hotspot.width}%`,
              height: `${hotspot.height}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleHotspotClick(hotspot.id)}
          >
            {activeHotspotId === hotspot.id && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2">
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-5 w-5 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveHotspot?.(hotspot.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4">
        <Button
          size="icon"
          variant="secondary"
          className="bg-black/50 hover:bg-black/70"
          onClick={() => setIsAddingHotspot(!isAddingHotspot)}
        >
          {isAddingHotspot ? <MapPin className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default CardDesigner;
