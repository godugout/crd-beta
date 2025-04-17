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
import { CardTransitionEffects } from '@/components/card-effects/CardTransitionEffects';

interface CardViewerProps {
  card: Card;
  onUpdateCard?: (updatedCard: Partial<Card>) => void;
  onDeleteCard?: (cardId: string) => void;
  fullscreen?: boolean;
  onFullscreenToggle?: () => void;
  onShare?: () => void;
  onCapture?: () => void;
  onBack?: () => void;
  onClose?: () => void;
}

const CardViewer: React.FC<CardViewerProps> = ({ 
  card, 
  onUpdateCard, 
  onDeleteCard,
  fullscreen = false,
  onFullscreenToggle,
  onShare,
  onCapture,
  onBack,
  onClose
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showLightbulb, setShowLightbulb] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>(card.effects || []);
  const { toast } = useToast();
  const [showTransition, setShowTransition] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      setIsShareOpen(true);
    }
  };

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleApplyEffect = (effect: string) => {
    const updatedEffects = activeEffects.includes(effect) 
      ? activeEffects.filter(e => e !== effect)
      : [...activeEffects, effect];
    
    setActiveEffects(updatedEffects);
    
    if (onUpdateCard) {
      onUpdateCard({ 
        id: card.id, 
        effects: updatedEffects 
      });
    }
  };

  const handleDeleteCard = (cardId: string) => {
    if (onDeleteCard) {
      onDeleteCard(cardId);
    } else {
      toast({
        title: "Action not available",
        description: "Delete functionality is not available in this view.",
        variant: "destructive"
      });
    }
  };

  const handleStyleChange = () => {
    setShowTransition(true);
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    // Here you can trigger any post-transition updates
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

      <div 
        className={`relative w-64 h-96 transform-style preserve-3d transition-transform duration-500`}
      >
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
        
        <CardTransitionEffects 
          isActive={showTransition}
          onComplete={handleTransitionComplete}
        />
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
        onDelete={handleDeleteCard}
      />
    </div>
  );
};

export default CardViewer;
