
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Edit, MoreVertical, Share, Trash2, Heart } from 'lucide-react';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import { toast } from 'sonner';
import CardCollectionView from '@/components/card-experiences/CardCollectionView';

const DeckViewPage = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { decks, getDeck, cards, deleteDeck, toggleFavorite, favorites } = useEnhancedCards();
  const [isDeleting, setIsDeleting] = useState(false);

  // Get the current deck
  const deck = deckId ? getDeck(deckId) : undefined;
  
  // Get the deck's cards
  const deckCards = deck ? cards.filter(card => deck.cardIds.includes(card.id)) : [];
  
  if (!deck) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Deck Not Found</h1>
        <p className="text-muted-foreground mb-8">The deck you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/decks')}>Return to Decks</Button>
      </div>
    );
  }

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      if (deckId) {
        deleteDeck(deckId);
        toast.success('Deck deleted successfully');
        navigate('/decks');
      }
      setIsDeleting(false);
    }, 500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: deck.name,
        text: deck.description,
        url: window.location.href,
      })
        .then(() => toast.success('Deck shared successfully'))
        .catch((error) => console.error('Error sharing deck:', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  const handleToggleFavorite = (cardId: string) => {
    toggleFavorite(cardId);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/decks')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Decks
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <Card>
            <div className="aspect-video relative">
              <img
                src={deck.coverImageUrl || '/placeholder.svg'}
                alt={deck.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{deck.name}</h1>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/decks/${deck.id}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Deck
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare}>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Deck
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-muted-foreground mb-4">{deck.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{deckCards.length} cards</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  deck.isPublic
                    ? 'bg-green-100 text-green-800'
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  {deck.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
              <div className="mt-6">
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/decks/${deck.id}/play`)}
                >
                  Play Deck
                </Button>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(deck.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{new Date(deck.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Cards in Deck</h2>
            <Button 
              variant="outline"
              onClick={() => navigate(`/decks/${deck.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Cards
            </Button>
          </div>

          {deckCards.length > 0 ? (
            <CardCollectionView
              cards={deckCards}
              onCardClick={(cardId) => navigate(`/cards/${cardId}`)}
            />
          ) : (
            <div className="text-center py-16 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">This deck doesn't have any cards yet</p>
              <Button onClick={() => navigate(`/decks/${deck.id}/edit`)}>
                Add Cards to Deck
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckViewPage;
