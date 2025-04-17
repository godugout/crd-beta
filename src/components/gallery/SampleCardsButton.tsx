
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCards } from '@/context/CardContext';
import { addSampleCards } from '@/lib/sampleCards';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SampleCardsButtonProps {
  onComplete?: () => void;
  variant?: "default" | "commonsLink";
}

const SampleCardsButton: React.FC<SampleCardsButtonProps> = ({ 
  onComplete,
  variant = "default" 
}) => {
  const { addCard } = useCards();
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  
  const handleAddSampleCards = async () => {
    if (variant === "commonsLink") {
      navigate('/collections/commons');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const addedCards = await addSampleCards(addCard);
      
      if (addedCards.length > 0) {
        toast.success(`Added ${addedCards.length} sample cards to your collection!`);
        if (onComplete) {
          onComplete();
        }
      } else {
        toast.error('Failed to add sample cards');
      }
    } catch (error) {
      console.error('Error adding sample cards:', error);
      toast.error('An unexpected error occurred while adding sample cards');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      onClick={handleAddSampleCards}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      size="lg"
    >
      <Sparkles className="h-4 w-4" />
      {isLoading ? 'Adding Sample Cards...' : variant === "commonsLink" ? 'Generate Commons Cards' : 'Add Sample Cards'}
    </Button>
  );
};

export default SampleCardsButton;
