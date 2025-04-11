
import React from 'react';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import { UserProfile } from '@/lib/types/UserTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, TrendingUp, Grid, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ArtistDashboardProps {
  user: UserProfile;
}

const ArtistDashboard: React.FC<ArtistDashboardProps> = ({ user }) => {
  const { cards, series } = useEnhancedCards();
  const navigate = useNavigate();

  // Filter cards created by this artist
  const artistCards = cards.filter(card => card.artistId === user.id);
  
  // Filter series created by this artist
  const artistSeries = series.filter(series => series.artistId === user.id);
  
  // Calculate total sales (in a real app, this would come from a sales API)
  const totalSales = artistCards.reduce((sum, card) => {
    return sum + (card.marketData?.lastSoldPrice || 0);
  }, 0);
  
  // Calculate total editions (in a real app, this would come from a database)
  const totalEditions = artistCards.reduce((sum, card) => {
    return sum + (card.editionSize || 1);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Artist Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your cards, series, and track sales</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button onClick={() => navigate('/cards/create')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Card
          </Button>
          <Button onClick={() => navigate('/series/create')} variant="outline">
            <Package className="mr-2 h-4 w-4" />
            Create Series
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artistCards.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Series</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artistSeries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Editions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEditions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="cards">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="cards"><Grid className="mr-2 h-4 w-4" />Cards</TabsTrigger>
          <TabsTrigger value="series"><Package className="mr-2 h-4 w-4" />Series</TabsTrigger>
          <TabsTrigger value="analytics"><TrendingUp className="mr-2 h-4 w-4" />Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cards" className="mt-4">
          {artistCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {artistCards.map(card => (
                <Card key={card.id} className="overflow-hidden">
                  <div className="aspect-[2.5/3.5] relative">
                    <img 
                      src={card.imageUrl} 
                      alt={card.title} 
                      className="object-cover w-full h-full"
                    />
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No cards created yet</p>
              <Button onClick={() => navigate('/cards/create')} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Card
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="series" className="mt-4">
          {artistSeries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artistSeries.map(series => (
                <Card key={series.id}>
                  <div className="aspect-video relative">
                    <img 
                      src={series.coverImageUrl || '/placeholder.svg'} 
                      alt={series.title} 
                      className="object-cover w-full h-full rounded-t"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{series.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                      {series.description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm">
                        {series.cardIds.length} / {series.totalCards} cards
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        series.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {series.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No series created yet</p>
              <Button onClick={() => navigate('/series/create')} className="mt-4">
                <Package className="mr-2 h-4 w-4" />
                Create Your First Series
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics dashboard coming soon. In the meantime, here's a summary of your activity:
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Total Cards Created:</span>
                  <span className="font-semibold">{artistCards.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Series Created:</span>
                  <span className="font-semibold">{artistSeries.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Editions:</span>
                  <span className="font-semibold">{totalEditions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Sales:</span>
                  <span className="font-semibold">${totalSales.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistDashboard;
