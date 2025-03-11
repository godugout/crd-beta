
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import CardItem from './CardItem';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import { PlusCircle, Search, Tag, X } from 'lucide-react';

interface CardGalleryProps {
  className?: string;
}

const CardGallery: React.FC<CardGalleryProps> = ({ className }) => {
  const navigate = useNavigate();
  const { cards } = useCards();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Get all unique tags from cards
  const allTags = Array.from(new Set(cards.flatMap(card => card.tags)));
  
  // Filter cards based on search query and selected tags
  const filteredCards = cards.filter(card => {
    const matchesSearch = searchQuery === '' || 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => card.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };
  
  return (
    <div className={cn("", className)}>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-cardshow-slate" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-cardshow-blue focus:ring-1 focus:ring-cardshow-blue transition-colors"
            placeholder="Search cards..."
          />
        </div>
        
        <button
          onClick={() => navigate('/editor')}
          className="flex items-center justify-center rounded-lg bg-cardshow-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Card
        </button>
      </div>
      
      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Tag size={16} className="mr-2 text-cardshow-slate" />
            <h3 className="text-sm font-medium text-cardshow-dark">Filter by tags</h3>
            
            {(selectedTags.length > 0 || searchQuery) && (
              <button 
                onClick={clearFilters}
                className="ml-auto text-xs text-cardshow-blue hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {allTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleTagSelect(tag)}
                className={cn(
                  "flex items-center text-xs px-3 py-1.5 rounded-full transition-colors",
                  selectedTags.includes(tag) 
                    ? "bg-cardshow-blue text-white" 
                    : "bg-cardshow-blue-light text-cardshow-blue hover:bg-cardshow-blue-light/70"
                )}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <X size={12} className="ml-1" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Cards grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <div 
              key={card.id} 
              className="animate-scale-in transition-all duration-300"
            >
              <CardItem card={card} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-cardshow-neutral rounded-full p-6 mb-4">
            <Search className="h-8 w-8 text-cardshow-slate" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No cards found</h3>
          <p className="text-cardshow-slate mb-6 max-w-md">
            {cards.length === 0 
              ? "You haven't created any cards yet. Create your first card to get started!" 
              : "Try adjusting your search or filters to find what you're looking for."}
          </p>
          {cards.length === 0 && (
            <button
              onClick={() => navigate('/editor')}
              className="flex items-center justify-center rounded-lg bg-cardshow-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-colors"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Card
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CardGallery;
