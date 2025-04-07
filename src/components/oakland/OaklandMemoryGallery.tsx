
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, Grid3X3, List, MapPin, PlusCircle, Search, Users } from 'lucide-react';
import OaklandMemoryCard from './OaklandMemoryCard';
import { OaklandMemoryData } from './OaklandMemoryForm';

interface OaklandMemoryGalleryProps {
  className?: string;
}

const OaklandMemoryGallery: React.FC<OaklandMemoryGalleryProps> = ({ className }) => {
  const navigate = useNavigate();
  const { cards } = useCards();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter for Oakland A's specific cards
  const oaklandCards = cards.filter(card => 
    card.designMetadata?.oaklandMemory
  );

  // Convert cards to OaklandMemoryData format
  const memories: Array<OaklandMemoryData & { id: string, imageUrl: string, templateType: string }> = oaklandCards.map(card => {
    const oaklandMemory = card.designMetadata?.oaklandMemory || {};
    
    return {
      id: card.id,
      title: card.title,
      description: card.description,
      date: oaklandMemory.date ? new Date(oaklandMemory.date) : null,
      opponent: oaklandMemory.opponent || '',
      score: oaklandMemory.score,
      location: oaklandMemory.location || '',
      section: oaklandMemory.section,
      memoryType: oaklandMemory.memoryType || 'other',
      attendees: oaklandMemory.attendees || [],
      tags: card.tags || [],
      imageUrl: card.imageUrl,
      templateType: oaklandMemory.template || 'classic'
    };
  });

  // Apply search and filters
  const filteredMemories = memories.filter(memory => {
    // Search filter
    const matchesSearch = searchQuery.trim() === '' || 
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (memory.tags && memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    // Type filter
    const matchesType = filterType === null || memory.memoryType === filterType;
    
    return matchesSearch && matchesType;
  });

  const memoryTypes = [
    { id: 'game', label: 'Games' },
    { id: 'tailgate', label: 'Tailgates' },
    { id: 'memorabilia', label: 'Memorabilia' },
    { id: 'other', label: 'Other' }
  ];

  const handleCardClick = (id: string) => {
    navigate(`/oakland-memories/${id}`);
  };

  return (
    <div className={className}>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories..."
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={() => navigate('/oakland-memories/create')}
            className="flex items-center justify-center bg-[#006341] hover:bg-[#003831] text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Memory
          </Button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-2">
        <div className="flex items-center mr-2">
          <Filter className="h-4 w-4 mr-1 text-[#003831]" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        
        <Badge
          variant={filterType === null ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilterType(null)}
        >
          All
        </Badge>
        
        {memoryTypes.map(type => (
          <Badge
            key={type.id}
            variant={filterType === type.id ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilterType(type.id)}
          >
            {type.label}
          </Badge>
        ))}
      </div>
      
      {filteredMemories.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMemories.map(memory => (
              <OaklandMemoryCard
                key={memory.id}
                memory={memory}
                templateType={memory.templateType as any}
                onClick={() => handleCardClick(memory.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMemories.map(memory => (
              <div
                key={memory.id}
                className="flex gap-4 p-4 rounded-lg bg-white border border-gray-200 hover:border-[#006341] cursor-pointer transition-colors"
                onClick={() => handleCardClick(memory.id)}
              >
                <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-[#003831]">{memory.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{memory.description}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    {memory.date && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {memory.date.toLocaleDateString()}
                      </div>
                    )}
                    
                    {memory.location && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {memory.location}
                      </div>
                    )}
                    
                    {memory.attendees && memory.attendees.length > 0 && (
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {memory.attendees.length} {memory.attendees.length === 1 ? 'person' : 'people'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 mx-auto bg-[#003831] rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-[#EFB21E]" />
          </div>
          <h3 className="text-xl font-bold text-[#003831] mb-2">No memories found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery || filterType
              ? "No memories match your current filters. Try adjusting your search terms or filters."
              : "Start preserving your Oakland A's memories by creating your first memory card."}
          </p>
          <Button 
            onClick={() => navigate('/oakland-memories/create')}
            className="bg-[#006341] hover:bg-[#003831] text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Memory
          </Button>
        </div>
      )}
    </div>
  );
};

export default OaklandMemoryGallery;
