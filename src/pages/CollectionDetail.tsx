import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card } from '@/lib/types';
import CardGrid from '@/components/gallery/CardGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Plus, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const CollectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    collections, 
    cards, 
    updateCollection, 
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection
  } = useCards();
  
  const collection = collections.find(c => c.id === id);
  const [name, setName] = useState(collection?.name || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [visibility, setVisibility] = useState<"public" | "private" | "team">(collection?.visibility || "public");
  const [isEditing, setIsEditing] = useState(false);
  const [cardEffects, setCardEffects] = useState<Record<string, string[]>>({});
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  
  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description);
      setVisibility(collection.visibility);
    }
  }, [collection]);
  
  if (!collection) {
    return <div>Collection not found</div>;
  }
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = async () => {
    if (id) {
      await updateCollection(id, { name, description, visibility });
      setIsEditing(false);
      toast.success('Collection updated');
    }
  };
  
  const handleDelete = async () => {
    if (id) {
      await deleteCollection(id);
      navigate('/collections');
      toast.success('Collection deleted');
    }
  };
  
  const handleAddCard = async (cardId: string) => {
    if (id) {
      await addCardToCollection(cardId, id);
      toast.success('Card added to collection');
    }
  };
  
  const handleRemoveCard = async (cardId: string) => {
    if (id) {
      await removeCardFromCollection(cardId, id);
      toast.success('Card removed from collection');
    }
  };
  
  const availableCards = cards.filter(card => !collection.cards?.includes(card.id));
  const collectionCards = cards.filter(card => collection.cards?.includes(card.id));
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Collection' : collection.name}</h1>
        </div>
        <div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                type="text" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select value={visibility} onValueChange={(value) => setVisibility(value as "public" | "private" | "team")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="default" size="sm" onClick={handleSave}>
                Save
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this collection and remove all of its data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <p>{collection.description}</p>
          <p className="mt-2">Visibility: {collection.visibility}</p>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Cards in this Collection</h2>
        {collectionCards.length > 0 ? (
          <CardGrid 
            cards={collectionCards} 
            cardEffects={cardEffects}
            onCardClick={(cardId) => {
              const card = collectionCards.find(c => c.id === cardId);
              setSelectedCard(card || null);
            }}
          />
        ) : (
          <p>No cards in this collection yet.</p>
        )}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Add Cards to Collection</h2>
        {availableCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableCards.map(card => (
              <div key={card.id} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <Button variant="default" size="sm" onClick={() => handleAddCard(card.id)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Collection
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p>No more cards available to add.</p>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;
