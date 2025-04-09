
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const MemoryPackCreator = () => {
  const navigate = useNavigate();
  const { addCollection } = useCards();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const newCollection = {
        id: uuidv4(),
        name,
        description,
        cardIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await addCollection(newCollection);
      navigate('/memory-packs');
    } catch (error) {
      console.error('Error creating memory pack:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <PageLayout title="Create Memory Pack" description="Create a new themed memory pack">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/memory-packs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Memory Packs
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Create Memory Pack</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block font-medium">
              Pack Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter pack name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter pack description (optional)"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="mr-2"
              onClick={() => navigate('/memory-packs')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Pack'}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default MemoryPackCreator;
