
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import CardUpload from '@/components/card-upload';
import { useCards } from '@/context/CardContext';
import { Card as CardType } from '@/lib/types';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface CardEditorProps {
  card?: CardType;
  className?: string;
}

const CardEditor: React.FC<CardEditorProps> = ({ card, className }) => {
  const navigate = useNavigate();
  const { addCard, updateCard } = useCards();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(card?.imageUrl || '');
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [tags, setTags] = useState<string[]>(card?.tags || []);
  const [newTag, setNewTag] = useState('');
  
  const handleImageUpload = (file: File, url: string) => {
    setImageFile(file);
    setImageUrl(url);
  };
  
  const handleAddTag = () => {
    if (newTag.trim() !== '' && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      toast.error('Please upload an image');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please provide a title');
      return;
    }
    
    if (card) {
      // Update existing card
      updateCard(card.id, {
        title,
        description,
        imageUrl,
        thumbnailUrl: imageUrl, // In a real app, we'd generate a thumbnail
        tags
      });
    } else {
      // Add new card
      addCard({
        title,
        description,
        imageUrl,
        thumbnailUrl: imageUrl, // In a real app, we'd generate a thumbnail
        tags
      });
    }
    
    // Navigate to gallery
    navigate('/gallery');
  };
  
  return (
    <div className={cn("max-w-4xl mx-auto p-4", className)}>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <CardUpload 
            onImageUpload={handleImageUpload} 
            className="max-w-xs"
            initialImageUrl={card?.imageUrl}
          />
        </div>
        
        <div className="flex flex-col">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-cardshow-dark mb-2">
              Card Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-cardshow-blue focus:ring-1 focus:ring-cardshow-blue transition-colors"
              placeholder="Enter card title"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-cardshow-dark mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-cardshow-blue focus:ring-1 focus:ring-cardshow-blue transition-colors"
              placeholder="Enter card description"
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-cardshow-dark mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
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
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-l-lg border border-gray-200 focus:border-cardshow-blue focus:ring-1 focus:ring-cardshow-blue transition-colors"
                placeholder="Add a tag"
              />
              <button 
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-cardshow-blue text-white rounded-r-lg hover:bg-opacity-90 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          
          <div className="mt-auto">
            <button
              type="submit"
              className="w-full py-3 bg-cardshow-blue text-white rounded-lg shadow-sm hover:bg-opacity-90 transition-colors"
            >
              {card ? 'Update Card' : 'Create Card'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CardEditor;
