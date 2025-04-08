
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Collection } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CardItem from '@/components/CardItem';
import ReactionButtons from '@/components/ReactionButtons';
import CommentSection from '@/components/CommentSection';
import { Share, Users, Plus, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const CollectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cards');
  const [showComments, setShowComments] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchCollectionData(id);
    }
  }, [id]);
  
  const fetchCollectionData = async (collectionId: string) => {
    setIsLoading(true);
    try {
      // Fetch collection details
      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('*, profiles:owner_id(id, full_name, avatar_url, username)')
        .eq('id', collectionId)
        .single();
      
      if (collectionError) {
        toast.error('Failed to load collection');
        console.error('Error fetching collection:', collectionError);
        return;
      }
      
      if (collectionData) {
        const formattedCollection: Collection = {
          id: collectionData.id,
          name: collectionData.title,
          description: collectionData.description || '',
          coverImageUrl: collectionData.cover_image_url || '',
          userId: collectionData.owner_id,
          teamId: collectionData.team_id,
          visibility: collectionData.visibility || 'private',
          allowComments: collectionData.allow_comments !== undefined ? collectionData.allow_comments : true,
          createdAt: collectionData.created_at,
          updatedAt: collectionData.updated_at,
          designMetadata: collectionData.design_metadata || {}
        };
        
        setCollection(formattedCollection);
        
        // Fetch cards in this collection
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .eq('collection_id', collectionId);
        
        if (cardsError) {
          console.error('Error fetching cards:', cardsError);
        } else if (cardsData) {
          setCards(cardsData.map(card => ({
            id: card.id,
            title: card.title || '',
            description: card.description || '',
            imageUrl: card.image_url || '',
            thumbnailUrl: card.thumbnail_url || card.image_url || '',
            createdAt: card.created_at,
            updatedAt: card.updated_at,
            userId: card.user_id,
            teamId: card.team_id,
            collectionId: card.collection_id,
            isPublic: card.is_public || false,
            tags: card.tags || [],
            designMetadata: card.design_metadata || {}
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching collection data:', error);
      toast.error('An error occurred while loading data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShare = async () => {
    if (!collection) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out the ${collection.name} collection`,
          text: collection.description || `View the ${collection.name} collection`,
          url: window.location.href,
        });
        toast.success('Collection shared successfully');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Collection link copied to clipboard');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
        toast.error('Failed to share collection');
      }
    }
  };
  
  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      </Container>
    );
  }
  
  if (!collection) {
    return (
      <Container className="py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Collection Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The collection you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button asChild>
                <Link to="/collections">Browse Collections</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    );
  }
  
  return (
    <Container className="py-8">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/collections">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Collections
        </Link>
      </Button>
      
      {/* Collection header */}
      <Card className="mb-8 overflow-hidden">
        {collection.coverImageUrl && (
          <div className="w-full h-48 relative">
            <img
              src={collection.coverImageUrl}
              alt={collection.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h1 className="text-2xl font-bold text-white">{collection.name}</h1>
              {collection.description && (
                <p className="text-white/90 mt-2">{collection.description}</p>
              )}
            </div>
          </div>
        )}
        
        {!collection.coverImageUrl && (
          <CardHeader>
            <CardTitle>{collection.name}</CardTitle>
            {collection.description && (
              <CardDescription>{collection.description}</CardDescription>
            )}
          </CardHeader>
        )}
        
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              {collection.visibility === 'team' && (
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Team Collection
                </Button>
              )}
              
              <Button variant="outline" size="sm" asChild>
                <Link to={`/card/create?collectionId=${collection.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Link>
              </Button>
            </div>
            
            <ReactionButtons collectionId={collection.id} />
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for cards and comments */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cards" className="space-y-8">
          {cards.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No cards in this collection yet</p>
                <Button asChild>
                  <Link to={`/card/create?collectionId=${collection.id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Card
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cards.map(card => (
                <CardItem 
                  key={card.id} 
                  card={card} 
                  activeEffects={[]}
                  showReactions={false}
                  onClick={() => { /* Navigate to card detail */ }}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="comments">
          {collection.allowComments ? (
            <CommentSection collectionId={collection.id} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Comments are disabled for this collection</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default CollectionDetail;
