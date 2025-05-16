
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { DEFAULT_CARD_METADATA, DEFAULT_MARKET_METADATA } from '@/lib/utils/cardDefaults';

// Use default import for sampleCardsData
import sampleCardsData from '@/data/cardData';

interface SampleCardsButtonProps {
  className?: string;
}

const SampleCardsButton: React.FC<SampleCardsButtonProps> = ({ className }) => {
  const { addCard } = useCards();

  const addSampleCards = async () => {
    try {
      sampleCardsData.forEach(async (cardData) => {
        // Make sure we properly adapt the card data to match required CardMetadata format
        const adaptedCard = {
          ...cardData,
          designMetadata: {
            ...cardData.designMetadata,
            cardMetadata: {
              category: cardData.designMetadata?.cardMetadata?.category || DEFAULT_CARD_METADATA.category,
              series: cardData.designMetadata?.cardMetadata?.series || DEFAULT_CARD_METADATA.series,
              cardType: cardData.designMetadata?.cardMetadata?.cardType || DEFAULT_CARD_METADATA.cardType
            },
            marketMetadata: {
              isPrintable: cardData.designMetadata?.marketMetadata?.isPrintable !== undefined ? 
                cardData.designMetadata?.marketMetadata?.isPrintable : DEFAULT_MARKET_METADATA.isPrintable,
              isForSale: cardData.designMetadata?.marketMetadata?.isForSale !== undefined ?
                cardData.designMetadata?.marketMetadata?.isForSale : DEFAULT_MARKET_METADATA.isForSale,
              includeInCatalog: cardData.designMetadata?.marketMetadata?.includeInCatalog !== undefined ?
                cardData.designMetadata?.marketMetadata?.includeInCatalog : DEFAULT_MARKET_METADATA.includeInCatalog,
              price: cardData.designMetadata?.marketMetadata?.price || 0,
              currency: cardData.designMetadata?.marketMetadata?.currency || 'USD',
              availableForSale: cardData.designMetadata?.marketMetadata?.availableForSale || false,
              editionSize: cardData.designMetadata?.marketMetadata?.editionSize || 1,
              editionNumber: cardData.designMetadata?.marketMetadata?.editionNumber || 1
            }
          }
        };
        await addCard(adaptedCard);
      });
      handleSuccess();
    } catch (error) {
      console.error("Error adding sample cards:", error);
      handleError();
    }
  };

  const handleSuccess = () => {
    toast.success('Sample Cards Added', {
      description: 'Sample cards have been added to your collection.',
    });
  };

  const handleError = () => {
    toast.error('Error Adding Cards', {
      description: 'There was a problem adding the sample cards. Please try again.',
    });
  };

  return (
    <Button className={className} onClick={addSampleCards}>
      Add Sample Cards
    </Button>
  );
};

export default SampleCardsButton;
