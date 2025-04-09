
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/lib/types';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import ImageUploader from '@/components/dam/ImageUploader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AssetGallery from '@/components/dam/AssetGallery';
import { Image, Upload, XCircle } from 'lucide-react';

interface CardEditorFormProps {
  card?: Card;
  onSave?: (card: Card) => void;
  className?: string;
}

const CardEditorForm: React.FC<CardEditorFormProps> = ({ 
  card,
  onSave,
  className = '' 
}) => {
  const navigate = useNavigate();
  const { addCard, updateCard } = useCards();
  const [isLoading, setIsLoading] = useState(false);
  
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [imageUrl, setImageUrl] = useState(card?.imageUrl || '');
  const [tags, setTags] = useState<string[]>(card?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isAssetGalleryOpen, setIsAssetGalleryOpen] = useState(false);
  
  const isEditing = !!card;
  
  const handleImageUploadComplete = (url: string) => {
    setImageUrl(url);
  };

  const handleAssetSelect = (asset: any) => {
    setImageUrl(asset.publicUrl);
    setIsAssetGalleryOpen(false);
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for the card');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const cardData: Partial<Card> = {
        title,
        description,
        imageUrl,
        thumbnailUrl: imageUrl,
        tags,
        designMetadata: card?.designMetadata || {
          cardStyle: {
            effect: 'classic'
          }
        }
      };
      
      let savedCard;
      if (isEditing && card?.id) {
        savedCard = await updateCard(card.id, cardData);
        toast.success('Card updated successfully');
      } else {
        savedCard = await addCard(cardData);
        toast.success('Card created successfully');
      }
      
      if (onSave && savedCard) {
        onSave(savedCard);
      } else {
        // Navigate to card detail
        navigate('/cards');
      }
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
  };
  
  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Card Title</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter card description"
              rows={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tags..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div key={tag} className="flex items-center bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-sm">
                    {tag}
                    <button 
                      type="button"
                      className="ml-2 text-slate-500 hover:text-slate-700"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Card Image</Label>
          <div className="flex flex-col items-center space-y-4">
            {imageUrl ? (
              <div className="relative max-w-xs w-full">
                <img 
                  src={imageUrl} 
                  alt={title || "Card image"}
                  className="w-full rounded-lg shadow-md"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="bg-white/80 hover:bg-white"
                    onClick={() => setIsAssetGalleryOpen(true)}
                  >
                    <Image className="h-4 w-4 mr-1" />
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="bg-white/80 hover:bg-white text-red-500"
                    onClick={handleRemoveImage}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="space-y-4">
                  <ImageUploader 
                    onUploadComplete={handleImageUploadComplete}
                    title="Upload Card Image"
                    maxSizeMB={10}
                  />

                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-2">or</div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAssetGalleryOpen(true)}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Select from Asset Gallery
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Asset Gallery Dialog */}
      <Dialog open={isAssetGalleryOpen} onOpenChange={setIsAssetGalleryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Image from Gallery</DialogTitle>
          </DialogHeader>
          <AssetGallery 
            onSelectAsset={handleAssetSelect}
            selectable={true}
          />
        </DialogContent>
      </Dialog>
      
      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            'Saving...'
          ) : isEditing ? (
            'Update Card'
          ) : (
            'Create Card'
          )}
        </Button>
      </div>
    </form>
  );
};

export default CardEditorForm;
