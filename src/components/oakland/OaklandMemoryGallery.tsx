
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import OaklandMemoryCard from './OaklandMemoryCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, SlidersHorizontal } from 'lucide-react';
import { OaklandTemplateType } from './OaklandCardTemplates';
import { OaklandMemoryData } from '@/lib/types';

const OaklandMemoryGallery = () => {
  const { cards } = useCards();
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter cards that have Oakland memory metadata
  const oaklandCards = cards.filter(card => 
    card.designMetadata && 
    card.designMetadata.oaklandMemory
  );
  
  // Apply filters and search
  const filteredCards = oaklandCards.filter(card => {
    const oaklandMemory = card.designMetadata?.oaklandMemory;
    
    // Filter by memory type if filter is active
    if (filterType && oaklandMemory && oaklandMemory.memoryType !== filterType) {
      return false;
    }
    
    // Search by title, description, or tags
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const inTitle = card.title.toLowerCase().includes(searchLower);
      const inDescription = card.description.toLowerCase().includes(searchLower);
      const inTags = card.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      
      return inTitle || inDescription || inTags;
    }
    
    return true;
  });
  
  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search memories..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          <Select 
            value={filterType || ''} 
            onValueChange={value => setFilterType(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All memory types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All memory types</SelectItem>
              <SelectItem value="game">Game Day</SelectItem>
              <SelectItem value="tailgate">Tailgate Party</SelectItem>
              <SelectItem value="memorabilia">Memorabilia</SelectItem>
              <SelectItem value="historical">Historical Moment</SelectItem>
              <SelectItem value="fan_experience">Fan Experience</SelectItem>
              <SelectItem value="stats">Stats & Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button asChild>
          <Link to="/oakland-memory-creator">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Memory
          </Link>
        </Button>
      </div>
      
      {/* Memory Card Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCards.map(card => {
            const oaklandMemory = card.designMetadata?.oaklandMemory;
            // Early return if oaklandMemory is undefined
            if (!oaklandMemory) return null;
            
            // Convert to expected OaklandMemoryData format
            const memoryData: OaklandMemoryData = {
              title: card.title,
              description: card.description,
              date: oaklandMemory.date,
              opponent: oaklandMemory.opponent,
              score: oaklandMemory.score,
              location: oaklandMemory.location,
              section: oaklandMemory.section,
              memoryType: oaklandMemory.memoryType,
              attendees: oaklandMemory.attendees || [],
              tags: card.tags || [],
              imageUrl: oaklandMemory.imageUrl || card.imageUrl,
            };
            
            return (
              <Link key={card.id} to={`/oakland-memory/${card.id}`}>
                <OaklandMemoryCard 
                  memory={memoryData}
                  templateType={(oaklandMemory.template as OaklandTemplateType) || 'classic'}
                />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No memories yet</h3>
          <p className="text-gray-500 mb-6">Create your first Oakland A's memory card</p>
          <Button asChild>
            <Link to="/oakland-memory-creator">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Memory
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default OaklandMemoryGallery;
