
import React, { useState } from 'react';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import { Deck } from '@/lib/types/CardTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, Check, X, Trash2, MoveVertical, Save, Eye, Share2, Filter,
  Grid, Layout, Circle, Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';

interface DeckBuilderProps {
  initialDeck?: Deck;
  onSave?: (deck: Deck) => void;
}

const DeckBuilder: React.FC<DeckBuilderProps> = ({ initialDeck, onSave }) => {
  const { cards, favorites, decks, addDeck, updateDeck, addCardToDeck, removeCardFromDeck } = useEnhancedCards();
  
  const [formData, setFormData] = useState<Partial<Deck>>({
    id: initialDeck?.id,
    name: initialDeck?.name || '',
    description: initialDeck?.description || '',
    coverImageUrl: initialDeck?.coverImageUrl || '',
    cardIds: initialDeck?.cardIds || [],
    isPublic: initialDeck?.isPublic ?? false,
    ownerId: initialDeck?.ownerId || 'current-user'
  });
  
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'rarity' | 'series' | 'favorites'>('all');
  const [rarityFilter, setRarityFilter] = useState('');
  const [seriesFilter, setSeriesFilter] = useState('');
  
  // Get deck cards
  const deckCards = cards.filter(card => formData.cardIds?.includes(card.id));
  
  // Get available cards for filtering
  const getFilteredCards = () => {
    let filtered = cards.filter(card => !formData.cardIds?.includes(card.id));
    
    if (filterType === 'rarity' && rarityFilter) {
      filtered = filtered.filter(card => card.rarity === rarityFilter);
    } 
    else if (filterType === 'series' && seriesFilter) {
      filtered = filtered.filter(card => card.seriesId === seriesFilter);
    }
    else if (filterType === 'favorites') {
      filtered = filtered.filter(card => favorites.includes(card.id));
    }
    
    return filtered;
  };
  
  const filteredCards = getFilteredCards();
  
  // Sample series for demo
  const sampleSeries = [
    { id: 'series-001', title: 'First Edition Collection' },
    { id: 'series-002', title: 'Limited Edition Memorabilia' }
  ];
  
  const rarityOptions = [
    'common', 'uncommon', 'rare', 'ultra-rare', 'legendary', 'one-of-one'
  ];
  
  // Handle image upload for cover
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, upload to server
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, coverImageUrl: url });
    }
  };
  
  const handleAddCard = (cardId: string) => {
    setFormData({
      ...formData,
      cardIds: [...(formData.cardIds || []), cardId]
    });
    toast.success('Card added to deck');
  };
  
  const handleRemoveCard = (cardId: string) => {
    setFormData({
      ...formData,
      cardIds: (formData.cardIds || []).filter(id => id !== cardId)
    });
    toast.success('Card removed from deck');
  };
  
  const handleSave = () => {
    if (!formData.name) {
      toast.error('Deck name is required');
      return;
    }
    
    try {
      if (initialDeck) {
        const updated = updateDeck(initialDeck.id, formData);
        if (onSave && updated) {
          onSave(updated);
        }
      } else {
        const newDeck = addDeck(formData);
        if (onSave) {
          onSave(newDeck);
        }
      }
      toast.success(`Deck ${initialDeck ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error('Error saving deck:', error);
      toast.error(`Failed to ${initialDeck ? 'update' : 'create'} deck`);
    }
  };
  
  // Select a card as cover
  const setCardAsCover = (card: any) => {
    setFormData({
      ...formData,
      coverImageUrl: card.imageUrl
    });
    toast.success('Cover image updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {initialDeck ? 'Edit Deck' : 'Create New Deck'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {initialDeck ? 'Modify your existing deck' : 'Build a custom deck of cards'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {initialDeck ? 'Update Deck' : 'Save Deck'}
          </Button>
          {initialDeck && (
            <>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Deck Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Deck Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter deck name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter deck description"
                  className="w-full min-h-[100px] mt-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
                <Label htmlFor="isPublic">Make this deck public</Label>
              </div>
              
              <div>
                <Label htmlFor="coverImage">Cover Image</Label>
                <div className="mt-1 border rounded-lg overflow-hidden">
                  {formData.coverImageUrl ? (
                    <div className="relative aspect-video">
                      <img
                        src={formData.coverImageUrl}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setFormData({ ...formData, coverImageUrl: '' })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-100 flex flex-col items-center justify-center">
                      <p className="text-muted-foreground">No cover image selected</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload an image or select a card as cover
                      </p>
                      <div className="mt-4 flex gap-2">
                        <label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="sr-only"
                          />
                          <Button type="button" variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cards in Deck ({deckCards.length})</CardTitle>
              <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Cards
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Add Cards to Deck</DialogTitle>
                    <DialogDescription>
                      Select cards to add to your deck
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="border-b py-2 mb-3 flex items-center gap-2">
                    <Label>Filter:</Label>
                    <Select
                      value={filterType}
                      onValueChange={(value) => setFilterType(value as 'all' | 'rarity' | 'series' | 'favorites')}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cards</SelectItem>
                        <SelectItem value="rarity">By Rarity</SelectItem>
                        <SelectItem value="series">By Series</SelectItem>
                        <SelectItem value="favorites">Favorites</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {filterType === 'rarity' && (
                      <Select
                        value={rarityFilter}
                        onValueChange={setRarityFilter}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select rarity" />
                        </SelectTrigger>
                        <SelectContent>
                          {rarityOptions.map(rarity => (
                            <SelectItem key={rarity} value={rarity}>
                              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {filterType === 'series' && (
                      <Select
                        value={seriesFilter}
                        onValueChange={setSeriesFilter}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select series" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleSeries.map(series => (
                            <SelectItem key={series.id} value={series.id}>
                              {series.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {filteredCards.length > 0 ? (
                        filteredCards.map(card => (
                          <Card key={card.id} className="overflow-hidden">
                            <div className="aspect-[2.5/3.5] relative">
                              <img 
                                src={card.imageUrl} 
                                alt={card.title} 
                                className="object-cover w-full h-full"
                              />
                              <button
                                className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full"
                                onClick={() => handleAddCard(card.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <CardContent className="p-3">
                              <h4 className="font-medium truncate">{card.title}</h4>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-muted-foreground">{card.rarity}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8">
                          <p className="text-muted-foreground">No cards available based on your filter</p>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {deckCards.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {deckCards.map(card => (
                    <Card key={card.id} className="overflow-hidden relative group">
                      <div className="aspect-[2.5/3.5] relative">
                        <img 
                          src={card.imageUrl} 
                          alt={card.title} 
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={() => setCardAsCover(card)}
                          >
                            <Layout className="h-4 w-4 mr-1" />
                            Set as Cover
                          </Button>
                        </div>
                        
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveCard(card.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-2">
                        <h4 className="font-medium text-sm truncate">{card.title}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">{card.cardNumber || '—'}</span>
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                            {card.rarity}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Card
                    className="border-dashed border-2 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setShowAddCardDialog(true)}
                  >
                    <CardContent className="flex flex-col items-center justify-center h-full py-12">
                      <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="font-medium">Add Card</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No cards in this deck yet</p>
                  <Button onClick={() => setShowAddCardDialog(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Cards
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Deck Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Name</Label>
                <p className="font-medium">{formData.name || 'Untitled Deck'}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Visibility</Label>
                <p className="font-medium">
                  <span className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-medium ${
                    formData.isPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {formData.isPublic ? 'Public' : 'Private'}
                  </span>
                </p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Cards</Label>
                <p className="font-medium">{deckCards.length} cards</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Rarity Breakdown</Label>
                <div className="space-y-2 mt-2">
                  {rarityOptions.map(rarity => {
                    const count = deckCards.filter(c => c.rarity === rarity).length;
                    if (count > 0) {
                      return (
                        <div key={rarity} className="flex justify-between items-center text-sm">
                          <span className="capitalize">{rarity}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
              
              {initialDeck && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <Label className="text-sm text-muted-foreground">Created</Label>
                    <p className="font-medium">
                      {new Date(initialDeck.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Last Updated</Label>
                    <p className="font-medium">
                      {new Date(initialDeck.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}
              
              <div className="border-t pt-4 mt-4">
                <Button className="w-full" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  {initialDeck ? 'Update Deck' : 'Save Deck'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;
