
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
  
  const handleAddSampleCards = async () => {
    if (variant === "commonsLink") {
      navigate('/collections/commons');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const addedCards = await addSampleCards(addCard);
      
      if (addedCards.length > 0) {
        toast({
          title: "Success",
          description: `Added ${addedCards.length} sample cards to your collection!`,
          variant: "success"
        });
        
        if (onComplete) {
          onComplete();
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to add sample cards",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding sample cards:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding sample cards",
        variant: "destructive"
      });
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
