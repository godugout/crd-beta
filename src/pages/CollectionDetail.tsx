import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card } from '@/lib/schema/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card as UICard } from '@/components/ui/card';
import { CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { MoreVertical, Pencil, Trash2, PlusCircle, ChevronLeft } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCards } from '@/context/CardContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Switch } from "@/components/ui/switch"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { Separator } from "@/components/ui/separator"
import { Link } from 'react-router-dom';

interface CollectionDetailParams {
  collectionId?: string;
}

const CollectionDetail: React.FC = () => {
  const { collectionId } = useParams<CollectionDetailParams>();
  const navigate = useNavigate();
  const { collections, cards, updateCollection, deleteCollection, addCardToCollection, removeCardFromCollection } = useCards();
  const { user } = useAuth();
  const [collection, setCollection] = useState(collections?.find(c => c.id === collectionId) || null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(collection?.name || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [coverImageUrl, setCoverImageUrl] = useState(collection?.coverImageUrl || '');
  const [fetchedCards, setFetchedCards] = useState<Card[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'private' | 'team'>(
    (collection?.visibility as 'public' | 'private' | 'team') || 'private'
  );
  const [allowComments, setAllowComments] = useState<boolean>(
    collection?.allowComments !== undefined ? !!collection.allowComments : true
  );
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  
  useEffect(() => {
    if (collections) {
      setCollection(collections.find(c => c.id === collectionId) || null);
    }
  }, [collectionId, collections]);
  
  useEffect(() => {
    if (collection) {
      setName(collection.name || '');
      setDescription(collection.description || '');
      setCoverImageUrl(collection.coverImageUrl || '');
      setVisibility(collection.visibility || 'private');
      setAllowComments(collection.allowComments !== undefined ? collection.allowComments : true);
    }
  }, [collection]);
  
  useEffect(() => {
    if (cards && collection) {
      const collectionCards = cards.filter(card => card.collectionId === collectionId);
      setFetchedCards(collectionCards);
    }
  }, [cards, collectionId]);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleSaveClick = async () => {
    if (!collectionId) return;
    
    await updateCollection(collectionId, {
      name,
      description,
      coverImageUrl,
      visibility,
      allowComments
    });
    
    setIsEditing(false);
    toast.success('Collection updated');
  };
  
  const handleCancelClick = () => {
    setIsEditing(false);
    setName(collection?.name || '');
    setDescription(collection?.description || '');
    setCoverImageUrl(collection?.coverImageUrl || '');
    setVisibility(collection?.visibility || 'private');
    setAllowComments(collection?.allowComments || true);
  };
  
  const handleDeleteClick = () => {
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!collectionId) return;
    
    await deleteCollection(collectionId);
    setIsDeleteAlertOpen(false);
    navigate('/collections');
  };
  
  const handleAddCardToCollection = async (cardId: string) => {
    if (!collectionId) return;
    
    await addCardToCollection(cardId, collectionId);
    toast.success('Card added to collection');
  };
  
  const handleRemoveCardFromCollection = async (cardId: string) => {
    if (!collectionId) return;
    
    await removeCardFromCollection(cardId, collectionId);
    toast.success('Card removed from collection');
  };

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold">Collection Not Found</h2>
        <p className="text-gray-600">The collection you are looking for does not exist.</p>
      </div>
    );
  }

  const cardItems: Card[] = fetchedCards.map(card => ({
    ...card,
    designMetadata: {
      ...card.designMetadata,
      oaklandMemory: card.designMetadata?.oaklandMemory ? {
        ...card.designMetadata.oaklandMemory,
        title: card.designMetadata.oaklandMemory.title || card.title || '',
        description: card.designMetadata.oaklandMemory.description || card.description || ''
      } : undefined
    }
  }));
  
  return (
    <div className="container mx-auto py-10">
      <Link to="/collections">
        <Button variant="ghost" className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Collections
        </Button>
      </Link>
      
      <UICard className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{isEditing ? 'Edit Collection' : collection.name}</h2>
              {!isEditing && collection.description && (
                <p className="text-gray-600">{collection.description}</p>
              )}
            </div>
            
            {user?.id === collection.userId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEditClick}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteClick} className="text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {isEditing ? (
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="coverImageUrl">Cover Image URL</Label>
                <Input id="coverImageUrl" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="visibility">Visibility</Label>
                <select id="visibility" className="border rounded px-2 py-1" value={visibility} 
                  onChange={(e) => setVisibility(e.target.value as 'public' | 'private' | 'team')}>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="team">Team</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="allowComments">Allow Comments</Label>
                <Switch
                  id="allowComments"
                  checked={allowComments}
                  onCheckedChange={(checked) => setAllowComments(checked)}
                />
              </div>
            </div>
          ) : (
            <>
              {collection.coverImageUrl && (
                <AspectRatio ratio={16 / 9}>
                  <ResponsiveImage src={collection.coverImageUrl} alt={collection.name} className="object-cover rounded-md" />
                </AspectRatio>
              )}
              <div className="grid gap-2 mt-4">
                <div>
                  <span className="text-gray-700 font-medium">Visibility:</span> {collection.visibility}
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Allow Comments:</span> {collection.allowComments ? 'Yes' : 'No'}
                </div>
              </div>
            </>
          )}
        </CardContent>
        
        {isEditing && (
          <CardFooter className="flex justify-end">
            <Button variant="secondary" onClick={handleCancelClick} className="mr-2">Cancel</Button>
            <Button onClick={handleSaveClick}>Save</Button>
          </CardFooter>
        )}
      </UICard>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Cards in this Collection</h3>
        <Button asChild>
          <Link to="/editor">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Card
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cardItems.map((card) => (
          <UICard key={card.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">{card.title}</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleRemoveCardFromCollection(card.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove from Collection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={1 / 1}>
                <ResponsiveImage src={card.imageUrl} alt={card.title} className="object-cover rounded-md" />
              </AspectRatio>
              <p className="text-gray-600 mt-2">{card.description}</p>
            </CardContent>
          </UICard>
        ))}
      </div>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the collection and all of its cards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteAlertOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CollectionDetail;
