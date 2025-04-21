
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/lib/types';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import TagInput from './TagInput';
import ImageSelector from './ImageSelector';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

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
  
  const isEditing = !!card;
  
  const handleAddTag = (tag: string) => {
    setTags([...tags, tag]);
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
        designMetadata: card?.designMetadata || DEFAULT_DESIGN_METADATA
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
          
          <TagInput 
            tags={tags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
        </div>
        
        <ImageSelector 
          imageUrl={imageUrl}
          onImageSelected={setImageUrl}
          onImageRemove={() => setImageUrl('')}
        />
      </div>
      
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
