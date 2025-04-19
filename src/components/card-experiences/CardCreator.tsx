import React, { useState } from 'react';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

interface CardCreatorProps {
  onComplete?: (card: any) => void;
}

const CardCreator: React.FC<CardCreatorProps> = ({ onComplete }) => {
  const { addCard } = useCards();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!imagePreview) {
      toast.error('Please upload an image');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real app, we would upload the image to a storage service
      // For now, we'll just use the data URL
      const newCard = await addCard({
        title,
        description,
        imageUrl: imagePreview,
        thumbnailUrl: imagePreview,
        tags: [],
        designMetadata: {
          ...DEFAULT_DESIGN_METADATA,
          cardStyle: {
            ...DEFAULT_DESIGN_METADATA.cardStyle,
            effect: 'classic',
            borderRadius: '8px'
          }
        }
      });
      
      toast.success('Card created successfully!');
      if (onComplete) {
        onComplete(newCard);
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Create New Card</h2>
        <p className="text-gray-500">Upload an image and add details to create your card</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image">Card Image</Label>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            {imagePreview ? (
              <div className="relative w-full max-w-xs mx-auto">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-auto rounded-lg shadow-md" 
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-white"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex flex-col items-center justify-center">
                  <Plus className="h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <Label 
                      htmlFor="file-upload" 
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Upload Image
                    </Label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for your card"
            rows={3}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Card'}
        </Button>
      </form>
    </div>
  );
};

export default CardCreator;
