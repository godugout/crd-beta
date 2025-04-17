
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import { Deck, EnhancedCard } from '@/lib/types/enhancedCardTypes';
import { Card, CardRarity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card as UICard, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, X, Save, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { ensureEnhancedCard } from '@/lib/utils/cardHelpers';
import { adaptToCard } from '@/lib/adapters/typeAdapters';

interface DeckBuilderProps {
  initialDeck?: Deck;
}

const DeckBuilder: React.FC<DeckBuilderProps> = ({ initialDeck }) => {
  const navigate = useNavigate();
  const { cards, favorites, addDeck, updateDeck, addCardToDeck } = useEnhancedCards();
  
  const [deck, setDeck] = useState<Partial<Deck>>(initialDeck || {
    name: '',
    description: '',
    cardIds: [],
    isPublic: false
  });
  
  const [selectedCards, setSelectedCards] = useState<EnhancedCard[]>([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'favorites', 'selected'
  
  useEffect(() => {
    if (initialDeck?.cardIds && initialDeck.cardIds.length > 0) {
      const deckCards = cards.filter(card => initialDeck.cardIds.includes(card.id));
      setSelectedCards(deckCards.map(card => ensureEnhancedCard(card)));
    }
  }, [initialDeck, cards]);
  
  useEffect(() => {
    setDeck(prev => ({
      ...prev,
      cardIds: selectedCards.map(card => card.id)
    }));
  }, [selectedCards]);
  
  const filteredCards = activeTab === 'favorites' 
    ? cards.filter(card => favorites.includes(card.id))
    : cards;
  
  const availableCards = filteredCards.filter(
    card => !selectedCards.some(selected => selected.id === card.id)
  );
  
  const handleAddCard = (card: EnhancedCard) => {
    setSelectedCards(prev => [...prev, card]);
    toast.success(`Added "${card.title}" to deck`);
  };
  
  const handleRemoveCard = (cardId: string) => {
    setSelectedCards(prev => prev.filter(card => card.id !== cardId));
    toast.success("Card removed from deck");
  };
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(selectedCards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSelectedCards(items);
  };
  
  const handleSaveDeck = async () => {
    try {
      if (!deck.name) {
        toast.error("Please enter a deck name");
        return;
      }
      
      if (selectedCards.length === 0) {
        toast.error("Please add at least one card to your deck");
        return;
      }
      
      if (!deck.coverImageUrl && selectedCards.length > 0) {
        setDeck(prev => ({
          ...prev,
          coverImageUrl: selectedCards[0].imageUrl
        }));
      }
      
      let savedDeck;
      if (initialDeck?.id) {
        await updateDeck(initialDeck.id, deck);
        savedDeck = { ...initialDeck, ...deck };
      } else {
        savedDeck = await addDeck(deck);
      }
      
      toast.success(`Deck ${initialDeck ? 'updated' : 'created'} successfully!`);
      navigate('/decks');
    } catch (error) {
      console.error('Error saving deck:', error);
      toast.error("Failed to save deck");
    }
  };
  
  const handleCardSelect = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      handleAddCard(ensureEnhancedCard(card));
    } else {
      const tempCard: Card = {
        id: cardId,
        title: `Card ${cardId.slice(-4)}`,
        imageUrl: '',
        description: '', 
        effects: [],
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'anonymous',
        tags: [],
        rarity: CardRarity.COMMON
      };
      handleAddCard(ensureEnhancedCard(adaptToCard(tempCard)));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2 space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Deck Details</h2>
              
              <div className="space-y-2">
                <Label htmlFor="deck-name">Deck Name</Label>
                <Input 
                  id="deck-name"
                  value={deck.name || ''}
                  onChange={(e) => setDeck(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Awesome Deck"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deck-description">Description</Label>
                <Textarea 
                  id="deck-description"
                  value={deck.description || ''}
                  onChange={(e) => setDeck(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your deck..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="public-deck"
                  checked={deck.isPublic || false}
                  onCheckedChange={(checked) => setDeck(prev => ({ ...prev, isPublic: checked }))}
                />
                <Label htmlFor="public-deck">Make deck public</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Selected Cards ({selectedCards.length})</h2>
                {selectedCards.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCards([])}
                  >
                    Clear All
                  </Button>
                )}
              </div>
              
              {selectedCards.length === 0 ? (
                <div className="text-center py-8 border rounded-md border-dashed">
                  <p className="text-muted-foreground">No cards selected yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select cards from the right panel to add to your deck
                  </p>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="selected-cards">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {selectedCards.map((card, index) => (
                          <Draggable 
                            key={card.id} 
                            draggableId={card.id} 
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex items-center justify-between p-2 bg-background border rounded-md"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="h-10 w-8 rounded overflow-hidden">
                                    <img 
                                      src={card.imageUrl || '/placeholder.svg'} 
                                      alt={card.title}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{card.title}</p>
                                    <p className="text-xs text-muted-foreground">{card.rarity}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveCard(card.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/decks')}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveDeck}>
                  <Save className="mr-2 h-4 w-4" />
                  {initialDeck ? 'Update Deck' : 'Create Deck'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-1/2">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Available Cards</h2>
                <div className="flex bg-muted rounded-md p-1">
                  <Button
                    variant={activeTab === 'all' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('all')}
                    className="text-xs"
                  >
                    All Cards
                  </Button>
                  <Button
                    variant={activeTab === 'favorites' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('favorites')}
                    className="text-xs"
                  >
                    <Heart className="mr-1 h-3 w-3" /> Favorites
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto p-1">
                {availableCards.length > 0 ? (
                  availableCards.map(card => (
                    <div
                      key={card.id}
                      className="border rounded-md overflow-hidden flex flex-col hover:border-primary cursor-pointer transition-colors"
                      onClick={() => handleCardSelect(card.id)}
                    >
                      <div className="aspect-[2/3] relative">
                        <img 
                          src={card.imageUrl} 
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          variant="secondary"
                          size="icon"
                          className="absolute bottom-2 right-2 rounded-full h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardSelect(card.id);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-2">
                        <p className="font-medium text-sm truncate">{card.title}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">{card.cardNumber || '#' + card.id.slice(-4)}</span>
                          <span className="bg-primary/10 text-primary px-1 py-0.5 rounded-full text-xs">
                            {card.rarity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">
                      {activeTab === 'favorites' 
                        ? "No favorite cards found. Mark some cards as favorites first!" 
                        : "No available cards found"}
                    </p>
                    {activeTab === 'favorites' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setActiveTab('all')}
                        className="mt-2"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Show All Cards
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;
