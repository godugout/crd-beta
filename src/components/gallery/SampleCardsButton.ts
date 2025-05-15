
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import { useCards } from '@/context/CardContext';
import showToast from '@/lib/adapters/toastAdapter';

interface SampleCardsButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const SampleCardsButton: React.FC<SampleCardsButtonProps> = ({ variant = 'default' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addSampleCards } = useCards();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await addSampleCards();
      showToast({
        title: "Sample cards added",
        description: "Sample cards have been added to your collection",
        variant: "success"
      });
    } catch (error) {
      console.error("Failed to add sample cards:", error);
      showToast({
        title: "Failed to add sample cards",
        description: "An error occurred while adding sample cards",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      disabled={isLoading}
    >
      <Database className="mr-2 h-4 w-4" />
      {isLoading ? "Adding..." : "Add Sample Cards"}
    </Button>
  );
};

export default SampleCardsButton;
