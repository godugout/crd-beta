import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Card as CardType, Collection } from '@/lib/types';
import CardItem from '@/components/CardItem';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Clock, Users, Hash, Filter } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/context/auth';

const CommunityFeed: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('trending');
  const [cards, setCards] = useState<CardType[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  useEffect(() => {
    fetchInitialData();
  }, [activeTab]);
  
  const fetchInitialData = async () => {
    setIsLoading(true);
    
    try {
      if (activeTab === 'trending' || activeTab === 'recent') {
        let query = supabase
          .from('cards')
          .select('*, reactions(count)')
          .eq('is_public', true);
        
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }
        
        if (selectedTags.length > 0) {
          query = query.contains('tags', selectedTags);
        }
        
        if (activeTab === 'trending') {
          const { data, error } = await query.order('created_at', { ascending: false });
          
          if (error) {
            console.error('Error fetching cards:', error);
          } else if (data) {
            const formattedCards = formatCards(data);
            setCards(formattedCards);
          }
        } else {
          const { data, error } = await query.order('created_at', { ascending: false });
          
          if (error) {
            console.error('Error fetching cards:', error);
          } else if (data) {
            const formattedCards = formatCards(data);
            setCards(formattedCards);
          }
        }
      } else if (activeTab === 'collections') {
        let query = supabase.from('collections')
          .select('*')
          .eq('visibility', 'public');
        
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching collections:', error);
        } else if (data) {
          const formattedCollections = data.map((collection: any) => ({
            id: collection.id,
            name: collection.title || '',
            description: collection.description || '',
            coverImageUrl: collection.cover_image_url || '',
            userId: collection.owner_id,
            visibility: collection.visibility || 'public',
            allowComments: collection.allow_comments !== undefined ? collection.allow_comments : true,
            createdAt: collection.created_at,
            updatedAt: collection.updated_at,
            cardIds: []
          }));
          
          setCollections(formattedCollections);
        }
      }
      
      const { data: tagsData, error: tagsError } = await supabase
        .from('cards')
        .select('tags')
        .eq('is_public', true);
      
      if (!tagsError && tagsData) {
        const allTags = tagsData
          .flatMap(item => item.tags || [])
          .filter(Boolean);
        
        const uniqueTags = [...new Set(allTags)];
        setAvailableTags(uniqueTags);
      }
    } catch (error) {
      console.error('Error fetching community feed data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatCards = (data: any[]): CardType[] => {
    return data.map(item => ({
      id: item.id,
      title: item.title || '',
      description: item.description || '',
      imageUrl: item.image_url || '',
      thumbnailUrl: item.thumbnail_url || item.image_url || '',
      userId: item.user_id,
      teamId: item.team_id,
      collectionId: item.collection_id,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      isPublic: item.is_public || false,
      tags: item.tags || [],
      designMetadata: item.design_metadata || {},
      reactions: item.reactions || []
    }));
  };
  
  const handleSearch = () => {
    fetchInitialData();
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(current => 
      current.includes(tag) 
        ? current.filter(t => t !== tag) 
        : [...current, tag]
    );
  };
  
  const renderCardGrid = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      );
    }
    
    if (cards.length === 0) {
      return (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No cards found.</p>
          {user && (
            <Button asChild>
              <Link to="/card/create">Create your first card</Link>
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map(card => (
          <CardItem 
            key={card.id} 
            card={card} 
            activeEffects={[]} 
            showReactions={true}
            onClick={() => { /* Navigate to card detail */ }}
          />
        ))}
      </div>
    );
  };
  
  const renderCollectionGrid = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      );
    }
    
    if (collections.length === 0) {
      return (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No public collections found.</p>
          {user && (
            <Button asChild>
              <Link to="/collection/create">Create a collection</Link>
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {collections.map(collection => (
          <Card key={collection.id} className="overflow-hidden">
            <div className="h-40 bg-gray-100">
              {collection.coverImageUrl ? (
                <img 
                  src={collection.coverImageUrl} 
                  alt={collection.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-300" />
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{collection.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {collection.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to={`/collections/${collection.id}`}>View Collection</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-8">Community Feed</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 flex gap-2">
          <Input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Search cards and collections" 
            className="flex-1"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">Tags:</div>
          <div className="flex flex-wrap gap-1">
            {availableTags.slice(0, 5).map(tag => (
              <Badge 
                key={tag} 
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="trending">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="recent">
            <Clock className="h-4 w-4 mr-2" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="collections">
            <Users className="h-4 w-4 mr-2" />
            Collections
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Trending Cards</h2>
          </div>
          
          {renderCardGrid()}
        </TabsContent>
        
        <TabsContent value="recent">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recently Added</h2>
          </div>
          
          {renderCardGrid()}
        </TabsContent>
        
        <TabsContent value="collections">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Public Collections</h2>
          </div>
          
          {renderCollectionGrid()}
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default CommunityFeed;
