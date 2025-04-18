
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Search } from 'lucide-react';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import CardCollectionView from '@/components/card-experiences/CardCollectionView';
import { Deck, EnhancedCard } from '@/lib/types/enhancedCardTypes';
import { toast } from 'sonner';

interface DeckBuilderProps {
  initialDeck?: Deck;
}

const DeckBuilder: React.FC<DeckBuilderProps> = ({ initialDeck }) => {
  const navigate = useNavigate();
  const { cards, addDeck, updateDeck } = useEnhancedCards();
  const [isUploading, setIsUploading] = useState(false);
  
  const [deckData, setDeckData] = useState<Partial<Deck>>(initialDeck || {
    name: '',
    description: '',
    coverImageUrl: initialDeck?.coverImageUrl || '',
    cards: [],
    cardIds: [],
    ownerId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: false,
  });
  
  // Selected cards for the deck
  const [selectedCards, setSelectedCards] = useState<EnhancedCard[]>(
    initialDeck?.cards || []
  );
  
  // Available cards (not in the deck)
  const [availableCards, setAvailableCards] = useState<EnhancedCard[]>([]);
  
  // Search term for filtering available cards
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Filter out cards that are already in the deck
    const selectedCardIds = selectedCards.map(card => card.id);
    setAvailableCards(cards.filter(card => !selectedCardIds.includes(card.id)));
  }, [cards, selectedCards]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeckData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setDeckData(prev => ({ ...prev, isPublic: checked }));
  };
  
  const handleUploadCover = () => {
    setIsUploading(true);
    setTimeout(() => {
      setDeckData(prev => ({ ...prev, coverImageUrl: 'https://placehold.co/600x400/png' }));
      setIsUploading(false);
      toast.success('Cover image uploaded');
    }, 1000);
  };
  
  const handleAddCard = (cardId: string) => {
    const card = availableCards.find(c => c.id === cardId);
    if (card) {
      setSelectedCards(prev => [...prev, card]);
      setDeckData(prev => ({
        ...prev,
        cards: [...(prev.cards || []), card],
        cardIds: [...(prev.cardIds || []), cardId]
      }));
    }
  };
  
  const handleRemoveCard = (cardId: string) => {
    setSelectedCards(prev => prev.filter(card => card.id !== cardId));
    setDeckData(prev => ({
      ...prev,
      cards: (prev.cards || []).filter(card => card.id !== cardId),
      cardIds: (prev.cardIds || []).filter(id => id !== cardId)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const deckWithId = initialDeck?.id 
      ? { ...deckData, updatedAt: new Date().toISOString() }
      : { ...deckData, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      
    if (initialDeck?.id) {
      updateDeck(initialDeck.id, deckWithId as Deck);
      toast.success('Deck updated successfully');
    } else {
      addDeck(deckWithId as Deck);
      toast.success('Deck created successfully');
    }
    
    navigate('/decks');
  };
  
  // Filter available cards based on search term
  const filteredAvailableCards = searchTerm
    ? availableCards.filter(card => 
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : availableCards;
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Decks
        </Button>
        <h2 className="text-3xl font-bold mb-2">
          {initialDeck ? 'Edit Deck' : 'Create New Deck'}
        </h2>
        <p className="text-muted-foreground">
          {initialDeck 
            ? 'Update your deck information and cards'
            : 'Create a custom deck with your favorite cards'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-6 sticky top-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Deck Name</Label>
                <Input 
                  id="name"
                  name="name"
                  placeholder="Enter deck name"
                  value={deckData.name || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Describe your deck"
                  value={deckData.description || ''}
                  onChange={handleChange}
                  rows={5}
                />
              </div>
              
              <div>
                <Label>Cover Image</Label>
                <div className="mt-2">
                  {deckData.coverImageUrl ? (
                    <div className="relative w-full h-40 mb-2 overflow-hidden rounded-lg">
                      <img 
                        src={deckData.coverImageUrl} 
                        alt="Deck cover" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleUploadCover}
                        className="absolute bottom-2 right-2"
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-32 border-dashed flex flex-col gap-2 items-center justify-center"
                      onClick={handleUploadCover}
                      disabled={isUploading}
                    >
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span>{isUploading ? 'Uploading...' : 'Upload Cover Image'}</span>
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  id="isPublic"
                  checked={deckData.isPublic || false}
                  onCheckedChange={handleSwitchChange}
                />
                <div>
                  <Label htmlFor="isPublic">Public Deck</Label>
                  <p className="text-sm text-muted-foreground">
                    {deckData.isPublic
                      ? 'Anyone can view this deck'
                      : 'Only you can view this deck'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <p className="text-muted-foreground text-sm mb-2">
                {selectedCards.length} cards selected
              </p>
              <Button 
                type="submit" 
                className="w-full"
                disabled={selectedCards.length === 0 || !deckData.name}
              >
                {initialDeck ? 'Update Deck' : 'Create Deck'}
              </Button>
            </div>
          </form>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Selected Cards</h3>
              {selectedCards.length > 0 ? (
                <CardCollectionView
                  cards={selectedCards}
                  title=""
                  onCardClick={handleRemoveCard}
                  emptyMessage="Click on cards below to add them to your deck"
                />
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No cards selected yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click on cards below to add them to your deck
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Available Cards</h3>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search cards..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <CardCollectionView
                cards={filteredAvailableCards}
                title=""
                onCardClick={handleAddCard}
                emptyMessage={searchTerm ? "No cards match your search" : "No cards available"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;
