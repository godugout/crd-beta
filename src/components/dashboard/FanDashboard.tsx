
import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Heart } from 'lucide-react';
import { useCards } from '@/hooks/useCards';
import { adaptToCard } from '@/lib/adapters/typeAdapters';

// Fix the error where a string is used where Card is expected
// Use cardIdToCard to convert the string to a Card object
import { cardIdToCard } from '@/lib/utils/cardHelpers';

const FanDashboard: React.FC = () => {
  const { user } = useAuth();
  const [favoriteCards, setFavoriteCards] = useState<Card[]>([]);
  const { cards } = useCards();

  useEffect(() => {
    if (user) {
      // Fetch or filter favorite cards based on user data
      // For now, let's just filter from available cards
      // Ensure all cards have the isFavorite property before filtering
      const processedCards = cards.map(card => ({
        ...card,
        isFavorite: card.isFavorite ?? false,
        description: card.description || ''
      }));
      
      const favorites = processedCards.filter(card => card.isFavorite === true);
      setFavoriteCards(favorites);
    }
  }, [user, cards]);

  const handleCardSelect = (cardId: string) => {
    // Convert string ID to Card object
    const card = cardIdToCard(cardId);
    // Now use card instead of cardId
    console.log(`Card selected: ${card.title}`);
  };

  const handleCardClick = (cardId: string) => {
    // Convert string ID to Card object
    const card = cardIdToCard(cardId);
    // Now use card instead of cardId
    console.log(`Card clicked: ${card.title}`);
  };

  if (!user) {
    return (
      <div className="p-4">
        <h2>Please log in to view your dashboard.</h2>
        <Link to="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Favorite Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteCards.map((card) => (
            <UICard key={card.id} className="bg-white shadow-md rounded-md overflow-hidden">
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={card.imageUrl} alt={card.title} className="w-full h-32 object-cover" />
                <CardDescription>{card.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button onClick={() => handleCardClick(card.id)}>View</Button>
                <Heart className="text-red-500" />
              </CardFooter>
            </UICard>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">Explore More Cards</h2>
        <p>
          <Link to="/cards">
            <Button>Browse All Cards</Button>
          </Link>
        </p>
      </section>
    </div>
  );
};

export default FanDashboard;
