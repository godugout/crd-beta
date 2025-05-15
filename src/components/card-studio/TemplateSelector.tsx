
import React, { useState, useEffect } from 'react';
import { CardTemplate } from '@/components/card-templates/TemplateLibrary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import TemplateCard from '@/components/card-templates/TemplateCard';

interface TemplateSelectorProps {
  onSelectTemplate: (template: CardTemplate) => void;
}

// Sample templates - in a real app these would come from an API
const SAMPLE_TEMPLATES: CardTemplate[] = [
  {
    id: 'topps-chrome',
    name: 'Topps Chrome',
    previewUrl: '/placeholder-card.png',
    sport: 'baseball',
    style: 'premium',
    effects: ['Chrome']
  },
  {
    id: 'panini-prizm',
    name: 'Panini Prizm',
    previewUrl: '/placeholder-card.png',
    sport: 'basketball',
    style: 'premium',
    effects: ['Refractor']
  },
  {
    id: 'upper-deck',
    name: 'Upper Deck',
    previewUrl: '/placeholder-card.png',
    sport: 'hockey',
    style: 'standard',
    effects: []
  },
  {
    id: 'fleer-ultra',
    name: 'Fleer Ultra',
    previewUrl: '/placeholder-card.png',
    sport: 'baseball',
    style: 'premium',
    effects: ['Holographic']
  },
  {
    id: 'donruss',
    name: 'Donruss',
    previewUrl: '/placeholder-card.png',
    sport: 'basketball',
    style: 'standard',
    effects: []
  }
];

// Sport categories for filtering
const SPORTS = ['All', 'Baseball', 'Basketball', 'Football', 'Hockey', 'Soccer'];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [templates, setTemplates] = useState<CardTemplate[]>(SAMPLE_TEMPLATES);
  const [filteredTemplates, setFilteredTemplates] = useState<CardTemplate[]>(SAMPLE_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Handle filtering by search query and sport
  useEffect(() => {
    let filtered = templates;
    
    // Filter by sport
    if (selectedSport !== 'All') {
      filtered = filtered.filter(template => 
        template.sport && template.sport.toLowerCase() === selectedSport.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(query) ||
        template.sport?.toLowerCase().includes(query) ||
        template.style?.toLowerCase().includes(query)
      );
    }
    
    setFilteredTemplates(filtered);
  }, [templates, searchQuery, selectedSport]);

  const handleSelectTemplate = (template: CardTemplate) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs defaultValue="All" onValueChange={setSelectedSport} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 md:grid-cols-6">
            {SPORTS.map(sport => (
              <TabsTrigger key={sport} value={sport}>{sport}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={template.id === selectedTemplate}
              onSelect={() => handleSelectTemplate(template)}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500">
            <p>No templates found matching your search.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery('');
                setSelectedSport('All');
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;
