import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardRarity } from '@/lib/types';
import { useCards } from '@/hooks/useCards';
import { toast } from 'sonner';

interface OaklandMemoryCreatorProps {
  onMemoryCreated?: (card: Card) => void;
}

const OaklandMemoryCreator: React.FC<OaklandMemoryCreatorProps> = ({ onMemoryCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [opponent, setOpponent] = useState('');
  const [score, setScore] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addCard } = useCards();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for your memory');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const tags = ['oakland', 'memory'];
      if (opponent) tags.push(opponent.toLowerCase());
      
      // Create a new Oakland memory card
      const oaklandMemoryData = {
        title,
        description,
        date,
        opponent,
        score,
        location,
        memoryType: 'game',
        tags
      };
      
      const newCard = await addCard({
        title,
        description,
        imageUrl,
        thumbnailUrl: imageUrl,
        userId: 'user1',
        tags,
        isPublic: true,
        effects: [],
        rarity: CardRarity.COMMON,
        designMetadata: {
          cardStyle: {
            template: 'oakland',
            effect: 'memory',
            borderRadius: '12px',
            borderColor: '#00483e',
            shadowColor: '#002b25',
            frameWidth: 3,
            frameColor: '#00483e'
          },
          textStyle: {
            titleColor: '#00483e',
            titleAlignment: 'center',
            titleWeight: 'bold',
            descriptionColor: '#333'
          },
          cardMetadata: {
            category: 'memory',
            series: 'oakland-memories',
            cardType: 'memory'
          },
          oaklandMemory: oaklandMemoryData
        }
      });
      
      toast.success('Memory created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setOpponent('');
      setScore('');
      setLocation('');
      setImageUrl('');
      
      // Notify parent component
      if (onMemoryCreated && newCard) {
        onMemoryCreated(newCard as Card);
      }
    } catch (error) {
      toast.error('Failed to create memory');
      console.error('Error creating memory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Create Oakland Memory</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Memory Title</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter a title for your memory"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your memory..."
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Where did this memory take place?"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="opponent">Opponent</Label>
            <Input
              id="opponent"
              value={opponent}
              onChange={e => setOpponent(e.target.value)}
              placeholder="Opponent team name"
            />
          </div>
          
          <div>
            <Label htmlFor="score">Score</Label>
            <Input
              id="score"
              value={score}
              onChange={e => setScore(e.target.value)}
              placeholder="e.g. 7-5"
            />
          </div>
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
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving Memory...' : 'Save Memory'}
        </Button>
      </form>
    </div>
  );
};

export default OaklandMemoryCreator;
