
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import { Card } from '@/lib/types';
import { Deck } from '@/lib/types/enhancedCardTypes';
import { Button } from '@/components/ui/button';
import { Card as UICard, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Edit, Share, Trash, Plus, ArrowLeft, Grid } from 'lucide-react';
import PageLayout from '@/components/navigation/PageLayout';

const DeckViewPage = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { decks, cards, loading, deleteDeck } = useEnhancedCards();
  const { toast } = useToast();
  const [deck, setDeck] = useState<Deck | undefined>();
  const [deckCards, setDeckCards] = useState<any[]>([]);
  
  const isLoading = loading;

  useEffect(() => {
    if (decks.length > 0 && deckId) {
      const foundDeck = decks.find(d => d.id === deckId);
      if (foundDeck) {
        setDeck(foundDeck);
        const cardsInDeck = foundDeck.cardIds.map(cardId => {
          return cards.find(card => card.id === cardId);
        }).filter(Boolean) as any[];
        
        setDeckCards(cardsInDeck);
      }
    }
  }, [deckId, decks, cards]);
  
  if (isLoading) {
    return (
      <PageLayout title="Loading..." description="Loading deck information">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (deckId && !deck) {
    return (
      <PageLayout title="Deck Not Found" description="The requested deck could not be found">
        <div className="container mx-auto px-4 py-8">
          <div>
            <Button variant="outline" onClick={() => navigate('/decks')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Decks
            </Button>
          </div>
          
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4">Deck Not Found</h2>
            <p className="text-gray-600 mb-8">
              The deck you're looking for doesn't exist or has been removed
            </p>
            <Button onClick={() => navigate('/decks/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Deck
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (deck) {
    return (
      <PageLayout title={deck.name} description={deck.description || 'Custom deck of cards'}>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate('/decks')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Decks
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 lg:w-1/4">
              <div className="relative rounded-lg overflow-hidden aspect-video mb-4">
                {deck.coverImageUrl ? (
                  <img
                    src={deck.coverImageUrl}
                    alt={deck.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <p className="text-muted-foreground">No cover image</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{deck.name}</h1>
                  {deck.description && (
                    <p className="text-muted-foreground mt-2">{deck.description}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    deck.isPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {deck.isPublic ? 'Public' : 'Private'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {deckCards.length} cards
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => navigate(`/decks/${deck.id}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Deck
                  </Button>
                  <Button variant="outline">
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 lg:w-3/4">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Cards in Deck</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {deckCards.length > 0 ? (
                  deckCards.map(card => (
                    <UICard key={card.id} className="overflow-hidden">
                      <div className="aspect-[2.5/3.5] relative">
                        <img 
                          src={card.imageUrl} 
                          alt={card.title} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium truncate">{card.title}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">{card.cardNumber || '—'}</span>
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                            {card.rarity}
                          </span>
                        </div>
                      </CardContent>
                    </UICard>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No cards in this deck yet</p>
                    <Button onClick={() => navigate(`/decks/${deck.id}/edit`)} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Cards
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="My Decks" description="Browse and manage your card decks">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Decks</h1>
          <Button onClick={() => navigate('/decks/create')}>
            <Plus className="mr-2 h-4 w-4" />
            New Deck
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.length > 0 ? (
            decks.map(deck => (
              <UICard key={deck.id} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/decks/${deck.id}`)}
              >
                <div className="aspect-video relative">
                  {deck.coverImageUrl ? (
                    <img 
                      src={deck.coverImageUrl} 
                      alt={deck.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <Grid className="h-8 w-8 text-slate-300" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold truncate">{deck.name}</h3>
                  {deck.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {deck.description}
                    </p>
                  )}
                  <div className="flex justify-between mt-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        deck.isPublic 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {deck.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {deck.cardIds.length} cards
                    </span>
                  </div>
                </CardContent>
              </UICard>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <h2 className="text-xl font-semibold mb-4">No Decks Created Yet</h2>
              <p className="text-muted-foreground mb-8">
                Create your first deck to organize your card collection
              </p>
              <Button onClick={() => navigate('/decks/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Deck
              </Button>
            </div>
          )}
          
          <UICard 
            className="border-dashed border-2 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => navigate('/decks/create')}
          >
            <CardContent className="flex flex-col items-center justify-center h-full py-12">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium">Create New Deck</p>
            </CardContent>
          </UICard>
        </div>
      </div>
    </PageLayout>
  );
};

export default DeckViewPage;
