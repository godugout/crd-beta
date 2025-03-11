
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useCards } from '@/context/CardContext';
import { Card as CardType, Collection } from '@/lib/types';
import CardUpload from '@/components/CardUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CardItem from '@/components/CardItem';
import { Plus, Upload, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { storageOperations } from '@/lib/supabase';

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { collections, cards, addCard, updateCollection, deleteCollection, addCardToCollection } = useCards();
  
  const [collection, setCollection] = useState<Collection | null>(null);
  const [collectionCards, setCollectionCards] = useState<CardType[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // New card form states
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newCardImageUrl, setNewCardImageUrl] = useState('');
  const [newCardTags, setNewCardTags] = useState<string[]>([]);
  const [newCardTagInput, setNewCardTagInput] = useState('');

  useEffect(() => {
    if (id) {
      const foundCollection = collections.find(c => c.id === id);
      if (foundCollection) {
        setCollection(foundCollection);
        setName(foundCollection.name);
        setDescription(foundCollection.description || '');
        
        // Filter cards that belong to this collection
        const collectionCardsList = cards.filter(card => card.collectionId === id);
        setCollectionCards(collectionCardsList);
      } else {
        // Collection not found
        toast.error('Collection not found');
        navigate('/collections');
      }
    }
  }, [id, collections, cards, navigate]);

  const handleEditCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please provide a name for your collection');
      return;
    }
    
    if (collection) {
      try {
        await updateCollection(collection.id, {
          name,
          description
        });
        
        toast.success('Collection updated successfully');
        setIsEditDialogOpen(false);
      } catch (error) {
        console.error('Error updating collection:', error);
        toast.error('Failed to update collection');
      }
    }
  };

  const handleDeleteCollection = async () => {
    if (collection) {
      try {
        await deleteCollection(collection.id);
        toast.success('Collection deleted successfully');
        navigate('/collections');
      } catch (error) {
        console.error('Error deleting collection:', error);
        toast.error('Failed to delete collection');
      }
    }
  };

  const handleImageUpload = (file: File, url: string) => {
    setNewCardImageUrl(url);
  };

  const handleAddTag = () => {
    if (newCardTagInput.trim() !== '' && !newCardTags.includes(newCardTagInput.trim())) {
      setNewCardTags([...newCardTags, newCardTagInput.trim()]);
      setNewCardTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewCardTags(newCardTags.filter(tag => tag !== tagToRemove));
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCardImageUrl) {
      toast.error('Please upload an image');
      return;
    }
    
    if (!newCardTitle.trim()) {
      toast.error('Please provide a title');
      return;
    }
    
    if (collection) {
      try {
        const newCard = await addCard({
          title: newCardTitle,
          description: newCardDescription,
          imageUrl: newCardImageUrl,
          thumbnailUrl: newCardImageUrl, // In a real app, we'd generate a thumbnail
          tags: newCardTags,
          collectionId: collection.id
        });
        
        if (newCard) {
          toast.success('Card created and added to collection');
          setIsAddCardDialogOpen(false);
          // Reset form
          setNewCardTitle('');
          setNewCardDescription('');
          setNewCardImageUrl('');
          setNewCardTags([]);
          setNewCardTagInput('');
        }
      } catch (error) {
        console.error('Error creating card:', error);
        toast.error('Failed to create card');
      }
    }
  };

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-cardshow-dark mb-2">Loading collection...</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-6">
            <button 
              onClick={() => navigate('/collections')}
              className="flex items-center text-cardshow-slate hover:text-cardshow-blue transition-colors mb-6"
            >
              <ArrowLeft size={16} className="mr-2" />
              <span>Back to Collections</span>
            </button>
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-cardshow-dark mb-2">{collection.name}</h1>
                {collection.description && (
                  <p className="text-cardshow-slate max-w-2xl">{collection.description}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Edit size={16} />
                      <span>Edit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Collection</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditCollection} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <label htmlFor="edit-name" className="text-sm font-medium text-cardshow-dark">
                          Collection Name
                        </label>
                        <Input
                          id="edit-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g., My First Collection"
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="edit-description" className="text-sm font-medium text-cardshow-dark">
                          Description (Optional)
                        </label>
                        <Textarea
                          id="edit-description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Briefly describe your collection"
                          className="w-full"
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Delete Collection</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this collection? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        variant="destructive" 
                        onClick={handleDeleteCollection}
                      >
                        Delete Collection
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Actions Bar */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 bg-cardshow-blue hover:bg-cardshow-blue/90">
                    <Plus size={16} />
                    <span>Add New Card</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Add New Card to Collection</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateCard} className="grid md:grid-cols-2 gap-8 pt-4">
                    <div className="flex justify-center">
                      <CardUpload 
                        onImageUpload={handleImageUpload} 
                        className="max-w-xs"
                        initialImageUrl={newCardImageUrl}
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-cardshow-dark mb-2">
                          Card Title
                        </label>
                        <Input
                          id="title"
                          value={newCardTitle}
                          onChange={(e) => setNewCardTitle(e.target.value)}
                          placeholder="Enter card title"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-cardshow-dark mb-2">
                          Description
                        </label>
                        <Textarea
                          id="description"
                          value={newCardDescription}
                          onChange={(e) => setNewCardDescription(e.target.value)}
                          rows={4}
                          placeholder="Enter card description"
                        />
                      </div>
                      
                      <div className="mb-8">
                        <label className="block text-sm font-medium text-cardshow-dark mb-2">
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {newCardTags.map((tag, index) => (
                            <div 
                              key={index}
                              className="flex items-center bg-cardshow-blue-light text-cardshow-blue text-sm px-3 py-1 rounded-full"
                            >
                              {tag}
                              <button 
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex">
                          <Input
                            value={newCardTagInput}
                            onChange={(e) => setNewCardTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                            className="flex-1 rounded-r-none border-r-0"
                            placeholder="Add a tag"
                          />
                          <Button 
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-cardshow-blue text-white rounded-l-none hover:bg-opacity-90 transition-colors"
                          >
                            <Plus size={20} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsAddCardDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Create Card</Button>
                      </div>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {collectionCards.length > 0 ? (
                collectionCards.map((card) => (
                  <CardItem key={card.id} card={card} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <div className="mx-auto w-16 h-16 mb-4 bg-cardshow-blue-light rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-cardshow-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-cardshow-dark mb-2">No Cards Yet</h3>
                  <p className="text-cardshow-slate max-w-md mx-auto mb-6">
                    Add your first card to this collection by uploading an image and adding details
                  </p>
                  <Button
                    onClick={() => setIsAddCardDialogOpen(true)}
                    className="bg-cardshow-blue hover:bg-cardshow-blue/90"
                  >
                    Add Your First Card
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollectionDetail;
