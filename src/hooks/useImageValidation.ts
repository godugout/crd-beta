
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProcessedCard } from '@/lib/adapters/cardAdapter';

export const useImageValidation = (card: ProcessedCard | null) => {
  const [validImageUrl, setValidImageUrl] = useState<string>('/images/card-placeholder.png');
  const { toast } = useToast();

  useEffect(() => {
    if (!card) return;

    // Always initialize with fallback first
    setValidImageUrl('/images/card-placeholder.png');
    
    if (card.imageUrl && 
        card.imageUrl !== 'undefined' && 
        typeof card.imageUrl === 'string') {
      // Validate the image URL by preloading it
      const img = new Image();
      img.onload = () => {
        console.log('Image validated successfully:', card.imageUrl);
        setValidImageUrl(card.imageUrl || '/images/card-placeholder.png');
      };
      img.onerror = () => {
        console.warn('Image validation failed, using fallback');
        setValidImageUrl('/images/card-placeholder.png');
        toast({
          title: "Image Error",
          description: "Could not load the card image. Using a fallback image instead.",
          variant: "destructive"
        });
      };
      img.src = card.imageUrl;
    }
  }, [card, toast]);

  return { validImageUrl };
};
