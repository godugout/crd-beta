
import { Card } from '@/lib/types';
import { 
  fetchCards,
  createCard,
  updateCard,
  deleteCard
} from '../operations/cardOperations';

interface UseCardOperationsProps {
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useCardOperations = ({
  cards,
  setCards,
  setIsLoading, 
  setError
}: UseCardOperationsProps) => {
  
  // Fetch cards from Supabase
  const refreshCards = async () => {
    await fetchCards(setIsLoading, setError, setCards);
  };

  // Card CRUD operations
  const addCard = async (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await createCard(card, setIsLoading, setError, setCards);
  };

  const handleUpdateCard = async (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>) => {
    await updateCard(id, updates, setIsLoading, setError, setCards);
  };

  const handleDeleteCard = async (id: string) => {
    await deleteCard(id, setIsLoading, setError, setCards);
  };

  return {
    refreshCards,
    addCard,
    updateCard: handleUpdateCard,
    deleteCard: handleDeleteCard
  };
};
