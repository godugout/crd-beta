import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import LightbulbPanel from '../card-effects/LightbulbPanel';
import { Card } from '@/lib/types';
import { CardFront } from '@/components/card/CardFront';
import { CardBack } from '@/components/card/CardBack';
import { ShareDialog } from '@/components/ShareDialog';
import { DeleteDialog } from '@/components/DeleteDialog';
import { useToast } from "@/hooks/use-toast";

interface CardViewerProps {
  card: Card;
  onUpdateCard: (card: Card) => void;
  onDeleteCard: (cardId: string) => void;
}

const CardViewer: React.FC<CardViewerProps> = ({ card, onUpdateCard, onDeleteCard }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showLightbulb, setShowLightbulb] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleApplyEffect = (effect: string) => {
    setActiveEffects(prev => {
      if (prev.includes(effect)) {
        return prev.filter(e => e !== effect);
      }
      return [...prev, effect];
    });
  };

  return (
    <div className="relative">
      <div className="absolute top-2 left-2 flex space-x-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFlip}
          title="Flip Card"
        >
          {isFlipped ? 'Front' : 'Back'}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowLightbulb(!showLightbulb)}
          className="relative"
          title="Creative Tools"
        >
          <Lightbulb className={showLightbulb ? "text-primary" : ""} />
        </Button>
      </div>

      <LightbulbPanel
        isOpen={showLightbulb}
        onClose={() => setShowLightbulb(false)}
        onApplyEffect={handleApplyEffect}
      />

      <div className="relative w-64 h-96 transform-style preserve-3d transition-transform duration-500">
        <div className={`absolute inset-0 ${isFlipped ? 'rotate-y-180' : ''} transform-style preserve-3d transition-transform duration-500`}>
          <CardFront
            card={card}
            activeEffects={activeEffects}
            onFlip={handleFlip}
            onShare={handleShare}
            onDelete={handleDelete}
          />
          <CardBack card={card} />
        </div>
      </div>

      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        cardId={card.id}
      />

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        card={card}
        onDelete={onDeleteCard}
      />
    </div>
  );
};

export default CardViewer;
