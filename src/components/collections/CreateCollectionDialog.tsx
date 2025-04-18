
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import BatchImageUploader from '@/components/dam/BatchImageUploader';
import { useCards } from '@/context/CardContext';

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateCollectionDialog: React.FC<CreateCollectionDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const { addCollection } = useCards();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImagesUploaded = (urls: string[], assetIds: string[]) => {
    setUploadedImages(urls);
    if (urls.length > 0) {
      toast.success(`Successfully uploaded ${urls.length} images`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please provide a collection name');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const newCollection = await addCollection({
        name,
        description,
        coverImageUrl: uploadedImages[0], // Use first image as cover
        isPublic: true,
        cardIds: [], // Will be populated when cards are created
        designMetadata: {
          uploadedImages // Store all uploaded images for later card creation
        }
      });

      toast.success('Collection created successfully');
      onOpenChange(false);
      navigate(`/collections/${newCollection.id}`);
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your collection"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Images</Label>
            <BatchImageUploader
              onComplete={handleImagesUploaded}
              maxFiles={50}
              maxSizeMB={5}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !name.trim() || uploadedImages.length === 0}
            >
              {isSubmitting ? 'Creating...' : 'Create Collection'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollectionDialog;
