import React from 'react';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import { UserProfile } from '@/lib/types/UserTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Heart, Grid, Package, Bookmark, Clock, Plus, Star 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedCard } from '@/lib/types/enhancedCardTypes';

interface FanDashboardProps {
  user: UserProfile;
}

const FanDashboard: React.FC<FanDashboardProps> = ({ user }) => {
  const { cards, decks, favorites } = useEnhancedCards();
  const navigate = useNavigate();
  
  // Cards the user has collected (for demo purposes, we'll use all cards)
  const collectedCards = cards.slice(0, 5);
  
  // Filter favorite cards
  const favoriteCards = cards.filter(card => favorites.includes(card.id));

  // Recent activity (in a real app, this would be fetched from an API)
  const recentActivity = [
    { type: 'purchase', card: cards[0], date: new Date().toISOString() },
    { type: 'favorite', card: cards[1], date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { type: 'deck_add', card: cards[2], date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Fan Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your collection, decks, and favorites</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button onClick={() => navigate('/marketplace')}>
            Browse Marketplace
          </Button>
          <Button onClick={() => navigate('/decks/create')} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create Deck
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectedCards.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Decks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{decks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favorites.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rare Finds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectedCards.filter(c => c.rarity === 'rare' || c.rarity === 'ultra-rare').length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="collection">
        <TabsList className="grid grid-cols-4 w-full md:w-[500px]">
          <TabsTrigger value="collection"><Grid className="mr-2 h-4 w-4" />Collection</TabsTrigger>
          <TabsTrigger value="decks"><Package className="mr-2 h-4 w-4" />Decks</TabsTrigger>
          <TabsTrigger value="favorites"><Heart className="mr-2 h-4 w-4" />Favorites</TabsTrigger>
          <TabsTrigger value="activity"><Clock className="mr-2 h-4 w-4" />Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="collection" className="mt-4">
          {collectedCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {collectedCards.map(card => (
                <CardItemDisplay 
                  key={card.id} 
                  card={card} 
                  isFavorite={favorites.includes(card.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No cards in your collection yet</p>
              <Button onClick={() => navigate('/marketplace')} className="mt-4">
                Browse Marketplace
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="decks" className="mt-4">
          {decks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {decks.map(deck => (
                <Card key={deck.id}>
                  <div className="aspect-video relative">
                    <img 
                      src={deck.coverImageUrl || '/placeholder.svg'} 
                      alt={deck.name} 
                      className="object-cover w-full h-full rounded-t"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{deck.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                      {deck.description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm">{deck.cardIds.length} cards</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        deck.isPublic 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {deck.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="border-dashed border-2 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => navigate('/decks/create')}
              >
                <CardContent className="flex flex-col items-center justify-center h-full py-12">
                  <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="font-medium">Create New Deck</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No decks created yet</p>
              <Button onClick={() => navigate('/decks/create')} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Deck
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-4">
          {favoriteCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favoriteCards.map(card => (
                <CardItemDisplay 
                  key={card.id} 
                  card={card} 
                  isFavorite={true} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No favorite cards yet</p>
              <Button onClick={() => navigate('/cards')} className="mt-4">
                <Heart className="mr-2 h-4 w-4" />
                Browse Cards
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className={`p-2 rounded ${
                      activity.type === 'purchase' 
                        ? 'bg-green-100' 
                        : activity.type === 'favorite' 
                          ? 'bg-red-100'
                          : 'bg-blue-100'
                    }`}>
                      {activity.type === 'purchase' && <Star className="h-5 w-5 text-green-600" />}
                      {activity.type === 'favorite' && <Heart className="h-5 w-5 text-red-600" />}
                      {activity.type === 'deck_add' && <Bookmark className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {activity.type === 'purchase' && 'Purchased a new card'}
                        {activity.type === 'favorite' && 'Added card to favorites'}
                        {activity.type === 'deck_add' && 'Added card to deck'}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {activity.card.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="w-16 h-24 overflow-hidden rounded">
                      <img 
                        src={activity.card.imageUrl} 
                        alt={activity.card.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Card display component
const CardItemDisplay: React.FC<{ card: EnhancedCard; isFavorite: boolean }> = ({ card, isFavorite }) => {
  const { toggleFavorite } = useEnhancedCards();
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[2.5/3.5] relative">
        <img 
          src={card.imageUrl} 
          alt={card.title} 
          className="object-cover w-full h-full"
          onClick={() => navigate(`/card/${card.id}`)}
        />
        <button 
          className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full"
          onClick={() => toggleFavorite(card.id)}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{card.title}</h3>
        <div className="flex justify-between items-center mt-2 text-sm">
          <span className="text-muted-foreground">{card.cardNumber}</span>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
            {card.rarity}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FanDashboard;
