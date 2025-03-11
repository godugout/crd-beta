
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCards } from '@/context/CardContext';
import { Collection } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { Plus, Image, Tag, Folder, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const Collections = () => {
  const { collections, addCollection } = useCards();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please provide a name for your collection');
      return;
    }
    
    try {
      const newCollection = await addCollection({
        name,
        description
      });
      
      if (newCollection) {
        toast.success('Collection created successfully');
        setIsDialogOpen(false);
        setName('');
        setDescription('');
        navigate(`/collection/${newCollection.id}`);
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cardshow-dark mb-2">Your Collections</h1>
              <p className="text-cardshow-slate">
                Organize your digital cards into themed collections
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-cardshow-blue hover:bg-cardshow-blue/90">
                  <Plus size={18} />
                  <span>New Collection</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Collection</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCollection} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-cardshow-dark">
                      Collection Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., My First Collection"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-cardshow-dark">
                      Description (Optional)
                    </label>
                    <Textarea
                      id="description"
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
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Collection</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.length > 0 ? (
              collections.map((collection) => (
                <CollectionCard 
                  key={collection.id} 
                  collection={collection} 
                  onClick={() => navigate(`/collection/${collection.id}`)}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <div className="mx-auto w-16 h-16 mb-4 bg-cardshow-blue-light rounded-full flex items-center justify-center">
                  <Folder className="h-8 w-8 text-cardshow-blue" />
                </div>
                <h3 className="text-xl font-semibold text-cardshow-dark mb-2">No Collections Yet</h3>
                <p className="text-cardshow-slate max-w-md mx-auto mb-6">
                  Create your first collection to organize your digital cards by theme or category
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-cardshow-blue hover:bg-cardshow-blue/90"
                >
                  Create Your First Collection
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

interface CollectionCardProps {
  collection: Collection;
  onClick: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-cardshow-dark truncate">{collection.name}</h3>
            {collection.description && (
              <p className="text-cardshow-slate text-sm mt-1 line-clamp-2">{collection.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-cardshow-slate text-sm">
              <Image size={16} />
              <span>{collection.cards?.length || 0} cards</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-cardshow-blue hover:text-cardshow-blue/90 p-1"
          >
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Collections;
