
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import PageLayout from '@/components/navigation/PageLayout';
import ImageUploader from '@/components/dam/ImageUploader';

interface CollectionFormProps {
  collectionId?: string;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ collectionId }) => {
  const navigate = useNavigate();
  const { collections, addCollection, updateCollection } = useCards();
  const [isLoading, setIsLoading] = useState(false);

  // Find collection if editing
  const collection = collectionId 
    ? collections.find(c => c.id === collectionId) 
    : undefined;

  // Form state
  const [name, setName] = useState(collection?.name || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [coverImage, setCoverImage] = useState(collection?.coverImageUrl || '');
  const [allowComments, setAllowComments] = useState(collection?.allowComments !== false);
  const [isPublic, setIsPublic] = useState(collection?.visibility === 'public');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please provide a collection name');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const collectionData = {
        name,
        description,
        coverImageUrl: coverImage,
        allowComments,
        visibility: isPublic ? 'public' : 'private'
      };
      
      if (collectionId && collection) {
        await updateCollection(collectionId, collectionData);
        toast.success('Collection updated successfully');
      } else {
        await addCollection(collectionData);
        toast.success('Collection created successfully');
      }
      
      navigate('/collections');
    } catch (error) {
      console.error('Error saving collection:', error);
      toast.error('Failed to save collection');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageUploaded = (url: string) => {
    setCoverImage(url);
    toast.success('Cover image uploaded successfully');
  };
  
  return (
    <PageLayout
      title={`${collectionId ? 'Edit' : 'Create'} CRD Collection`}
      description="Organize your trading cards into themed collections"
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Collection Name</Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter collection name"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your collection"
              rows={4}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Cover Image</Label>
            {coverImage ? (
              <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden">
                <img 
                  src={coverImage} 
                  alt="Collection cover" 
                  className="w-full h-full object-cover" 
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-white"
                  onClick={() => setCoverImage('')}
                >
                  Change
                </Button>
              </div>
            ) : (
              <ImageUploader 
                onUploadComplete={handleImageUploaded} 
                title="Upload Cover Image" 
                maxSizeMB={5}
              />
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isPublic">Public Collection</Label>
                <div className="text-sm text-muted-foreground">
                  Make this collection visible to everyone
                </div>
              </div>
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowComments">Allow Comments</Label>
                <div className="text-sm text-muted-foreground">
                  Let others comment on your collection
                </div>
              </div>
              <Switch
                id="allowComments"
                checked={allowComments}
                onCheckedChange={setAllowComments}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/collections')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : collectionId ? 'Update Collection' : 'Create Collection'}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default CollectionForm;
