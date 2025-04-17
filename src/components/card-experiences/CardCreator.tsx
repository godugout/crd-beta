
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardRarity } from '@/lib/types';
import { useCards } from '@/hooks/useCards';
import { toast } from 'sonner';

interface CardCreatorProps {
  onCardCreated?: (card: Card) => void;
}

const CardCreator: React.FC<CardCreatorProps> = ({ onCardCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCard } = useCards();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for your card');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Split tags by comma and trim whitespace
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Create a new card
      const newCard = await addCard({
        title,
        description,
        imageUrl,
        thumbnailUrl: imageUrl,
        tags: tagArray,
        isPublic: true,
        effects: [],
        rarity: CardRarity.COMMON, // Use enum value instead of string
        designMetadata: {
          cardStyle: {
            template: 'standard',
            effect: 'none',
            borderRadius: '12px',
            borderColor: '#000',
            shadowColor: '#000',
            frameWidth: 2,
            frameColor: '#000'
          },
          textStyle: {
            titleColor: '#000',
            titleAlignment: 'center',
            titleWeight: 'bold',
            descriptionColor: '#333'
          },
          cardMetadata: {
            category: 'custom',
            series: 'user-created',
            cardType: 'standard'
          }
        }
      });
      
      toast.success('Card created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setImageUrl('');
      setTags('');
      
      // Notify parent component
      if (onCardCreated) {
        onCardCreated(newCard);
      }
    } catch (error) {
      toast.error('Failed to create card');
      console.error('Error creating card:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Create New Card</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter card title"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter card description"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
        
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g. rare, baseball, vintage"
          />
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating...' : 'Create Card'}
        </Button>
      </form>
    </div>
  );
};

export default CardCreator;
