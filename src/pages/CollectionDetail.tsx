
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import CardGrid from '@/components/gallery/CardGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Grid, List, Share2, Upload, Plus, Edit, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardList from '@/components/gallery/CardList';
import { toast } from 'sonner';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { LoadingState } from '@/components/ui/loading-state';
import AssetGallery from '@/components/dam/AssetGallery';

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { collections, cards, isLoading, updateCard, updateCollection, deleteCollection } = useCards();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAssetGalleryOpen, setIsAssetGalleryOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: ''
  });
  
  // Find the collection by ID
  const collection = collections.find(c => c.id === id);
  
  // Get cards that belong to this collection
  const collectionCards = React.useMemo(() => {
    if (!collection) return [];
    return cards.filter(card => collection.cardIds?.includes(card.id));
  }, [collection, cards]);

  // Filter cards based on search term
  const filteredCards = React.useMemo(() => {
    if (!searchTerm.trim()) return collectionCards;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return collectionCards.filter(card => 
      card.title.toLowerCase().includes(lowerSearchTerm) || 
      (card.description && card.description.toLowerCase().includes(lowerSearchTerm))
    );
  }, [collectionCards, searchTerm]);

  // Initialize edit form data when collection changes
  useEffect(() => {
    if (collection) {
      setEditFormData({
        name: collection.name,
        description: collection.description || ''
      });
    }
  }, [collection]);

  // Handle asset selection from gallery
  const handleAssetSelect = (asset: any) => {
    if (selectedCardId) {
      updateCard(selectedCardId, { 
        imageUrl: asset.publicUrl,
        thumbnailUrl: asset.thumbnailUrl || asset.publicUrl 
      });
      toast.success('Card image updated successfully');
      setIsAssetGalleryOpen(false);
      setSelectedCardId(null);
    }
  };

  // Open asset gallery for a specific card
  const openAssetGalleryForCard = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsAssetGalleryOpen(true);
  };
  
  // Update collection details
  const handleUpdateCollection = () => {
    if (id) {
      updateCollection(id, {
        name: editFormData.name,
        description: editFormData.description
      });
      setIsEditDialogOpen(false);
      toast.success('Collection updated successfully');
    }
  };

  // Delete collection and navigate back
  const handleDeleteCollection = () => {
    if (id) {
      deleteCollection(id);
      toast.success('Collection deleted successfully');
      // Navigate back to collections list
      window.location.href = '/collections';
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  // Log for debugging
  useEffect(() => {
    console.log('Collection ID:', id);
    console.log('Collection found:', collection);
    console.log('Collection cards:', collectionCards);
  }, [id, collection, collectionCards]);
  
  if (isLoading) {
    return (
      <PageLayout title="Loading Collection..." description="Please wait">
        <div className="max-w-7xl mx-auto p-4">
          <LoadingState text="Loading collection" size="lg" />
        </div>
      </PageLayout>
    );
  }
  
  if (!collection) {
    return (
      <PageLayout title="Collection Not Found" description="The requested collection could not be found">
        <div className="max-w-7xl mx-auto p-4 text-center py-16">
          <h1 className="text-3xl font-bold mb-4">Collection Not Found</h1>
          <p className="mb-8">The collection you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/collections">Browse Collections</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const handleCardClick = (cardId: string) => {
    // Navigate to card detail view
    console.log('Card clicked:', cardId);
  };

  const handleShareCollection = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Collection link copied to clipboard'))
      .catch(() => toast.error('Failed to copy collection link'));
  };

  // Create action buttons for secondary navigation
  const actionButtons = (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setViewMode('grid')}
        className={viewMode === 'grid' ? 'bg-gray-100' : ''}
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setViewMode('list')}
        className={viewMode === 'list' ? 'bg-gray-100' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleShareCollection}
      >
        <Share2 className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsEditDialogOpen(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsDeleteDialogOpen(true)}
        className="text-red-500 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );

  // Collection stats for secondary navbar
  const collectionStats = [
    { count: collectionCards.length, label: `card${collectionCards.length !== 1 ? 's' : ''}` },
    { label: collection.visibility }
  ];

  return (
    <PageLayout 
      title={collection.name} 
      description={collection.description || 'View cards in this collection'}
      actions={actionButtons}
      stats={collectionStats}
      onSearch={handleSearch}
      searchPlaceholder="Search cards..."
    >
      <div className="container mx-auto px-4 py-4">
        {/* Edit Collection Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Collection</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={editFormData.name} 
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={editFormData.description} 
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateCollection}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Collection Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Collection</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete this collection? This action cannot be undone.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteCollection}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Asset Gallery Dialog */}
        <Dialog open={isAssetGalleryOpen} onOpenChange={setIsAssetGalleryOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Select Image from Gallery</DialogTitle>
            </DialogHeader>
            <AssetGallery 
              onSelectAsset={handleAssetSelect}
              collectionId={collection.id}
              selectable={true}
              showActions={true}
            />
          </DialogContent>
        </Dialog>

        {filteredCards.length === 0 && collectionCards.length > 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">No matching cards found</h2>
              <p className="text-gray-600 mb-6">Try a different search term</p>
              <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
            </CardContent>
          </Card>
        ) : filteredCards.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">No cards in this collection yet</h2>
              <p className="text-gray-600 mb-6">This collection is empty. Add some cards to see them here.</p>
              <Button asChild>
                <Link to="/cards">Browse Cards</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Cards</TabsTrigger>
              {/* Additional tabs could be added here for card categories */}
            </TabsList>
            <TabsContent value="all">
              {viewMode === 'grid' ? (
                <div>
                  {/* Enhanced card grid with image update capabilities */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCards.map(card => (
                      <Card key={card.id} className="overflow-hidden">
                        <div className="relative aspect-[3/4]">
                          <OptimizedImage 
                            src={card.imageUrl} 
                            alt={card.title}
                            className="w-full h-full object-cover"
                            placeholderSrc="/placeholder.svg"
                            fadeIn={true}
                          />
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAssetGalleryForCard(card.id);
                            }}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium truncate">{card.title}</h3>
                          <p className="text-gray-500 text-sm line-clamp-2 h-10">{card.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <CardList 
                  cards={filteredCards}
                  onCardClick={handleCardClick}
                  className=""
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PageLayout>
  );
};

export default CollectionDetail;
