
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import PageLayout from '@/components/navigation/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Edit, Package, Calendar, Plus, 
  Grid, LayoutGrid, List
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SeriesViewPage: React.FC = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const { series, cards, isLoading } = useEnhancedCards();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const currentSeries = seriesId ? series.find(s => s.id === seriesId) : undefined;
  
  // Get series cards
  const seriesCards = currentSeries 
    ? cards.filter(card => currentSeries.cardIds.includes(card.id))
    : [];
  
  if (isLoading) {
    return (
      <PageLayout title="Loading..." description="Loading series information">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (seriesId && !currentSeries) {
    return (
      <PageLayout title="Series Not Found" description="The requested series could not be found">
        <div className="container mx-auto px-4 py-8">
          <div>
            <Button variant="outline" onClick={() => navigate('/series')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Series
            </Button>
          </div>
          
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4">Series Not Found</h2>
            <p className="text-gray-600 mb-8">
              The series you're looking for doesn't exist or has been removed
            </p>
            <Button onClick={() => navigate('/series/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Series
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (currentSeries) {
    // Single series view
    return (
      <PageLayout title={currentSeries.title} description={currentSeries.description || 'Card series details'}>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate('/series')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Series
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  {currentSeries.coverImageUrl ? (
                    <img
                      src={currentSeries.coverImageUrl}
                      alt={currentSeries.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      currentSeries.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {currentSeries.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold">{currentSeries.title}</h1>
                    {currentSeries.description && (
                      <p className="text-muted-foreground mt-2">{currentSeries.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Release Date:</span>
                    <span className="font-medium">
                      {new Date(currentSeries.releaseDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Release Type:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      currentSeries.releaseType === 'limited' 
                        ? 'bg-purple-100 text-purple-800' 
                        : currentSeries.releaseType === 'exclusive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {currentSeries.releaseType.charAt(0).toUpperCase() + currentSeries.releaseType.slice(1)}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Cards in this series:
                    </p>
                    <p className="font-medium">
                      {seriesCards.length} / {currentSeries.totalCards}
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Button onClick={() => navigate(`/series/${currentSeries.id}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Series
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Cards in Series</h2>
                <div className="flex items-center gap-2">
                  <div className="flex border rounded-md overflow-hidden">
                    <button 
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button 
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="all">
                <TabsList className="mb-4 w-full md:w-auto">
                  <TabsTrigger value="all">All Cards</TabsTrigger>
                  <TabsTrigger value="common">Common</TabsTrigger>
                  <TabsTrigger value="rare">Rare</TabsTrigger>
                  <TabsTrigger value="ultra-rare">Ultra Rare+</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  {seriesCards.length > 0 ? (
                    viewMode === 'grid' ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {seriesCards.map(card => (
                          <Card key={card.id} className="overflow-hidden">
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
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Card
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Number
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rarity
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Release Date
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {seriesCards.map(card => (
                              <tr key={card.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-7 mr-3">
                                      <img src={card.imageUrl} alt={card.title} className="h-10 w-7 object-cover rounded" />
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">{card.title}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{card.cardNumber || '—'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    card.rarity === 'rare' || card.rarity === 'ultra-rare'
                                      ? 'bg-green-100 text-green-800'
                                      : card.rarity === 'legendary' || card.rarity === 'one-of-one'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {card.rarity}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {card.releaseDate 
                                      ? new Date(card.releaseDate).toLocaleDateString() 
                                      : 'Not set'}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No cards in this series yet</p>
                      <Button onClick={() => navigate(`/series/${currentSeries.id}/edit`)} className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Cards
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="common">
                  {seriesCards.filter(card => card.rarity === 'common').length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {seriesCards
                        .filter(card => card.rarity === 'common')
                        .map(card => (
                          <Card key={card.id} className="overflow-hidden">
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
                          </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No common cards in this series</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="rare">
                  {seriesCards.filter(card => card.rarity === 'rare' || card.rarity === 'uncommon').length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {seriesCards
                        .filter(card => card.rarity === 'rare' || card.rarity === 'uncommon')
                        .map(card => (
                          <Card key={card.id} className="overflow-hidden">
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
                          </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No rare cards in this series</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="ultra-rare">
                  {seriesCards.filter(card => 
                    ['ultra-rare', 'legendary', 'one-of-one'].includes(card.rarity)
                  ).length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {seriesCards
                        .filter(card => 
                          ['ultra-rare', 'legendary', 'one-of-one'].includes(card.rarity)
                        )
                        .map(card => (
                          <Card key={card.id} className="overflow-hidden">
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
                          </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No ultra-rare cards in this series</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Series overview
  return (
    <PageLayout title="Card Series" description="Browse and manage card series">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Card Series</h1>
          <Button onClick={() => navigate('/series/create')}>
            <Plus className="mr-2 h-4 w-4" />
            New Series
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {series.length > 0 ? (
            series.map(series => (
              <Card key={series.id} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/series/${series.id}`)}
              >
                <div className="aspect-video relative">
                  {series.coverImageUrl ? (
                    <img 
                      src={series.coverImageUrl} 
                      alt={series.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <Package className="h-12 w-12 text-slate-300" />
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      series.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {series.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold truncate">{series.title}</h3>
                  {series.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {series.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(series.releaseDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        series.releaseType === 'limited' 
                          ? 'bg-purple-100 text-purple-800' 
                          : series.releaseType === 'exclusive'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {series.releaseType}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground">
                    {series.cardIds.length} / {series.totalCards} cards
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <h2 className="text-xl font-semibold mb-4">No Series Created Yet</h2>
              <p className="text-muted-foreground mb-8">
                Create your first series to organize your card releases
              </p>
              <Button onClick={() => navigate('/series/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Series
              </Button>
            </div>
          )}
          
          <Card 
            className="border-dashed border-2 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => navigate('/series/create')}
          >
            <CardContent className="flex flex-col items-center justify-center h-full py-12">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium">Create New Series</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default SeriesViewPage;
