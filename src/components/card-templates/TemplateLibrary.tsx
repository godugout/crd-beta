
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, CheckCircle } from 'lucide-react';
import TemplateCard from './TemplateCard';

export interface CardTemplate {
  id: string;
  name: string;
  category: string;
  sport: string;
  style: string;
  brand: string;
  year?: string;
  thumbnailUrl: string;
  premium?: boolean;
  description?: string;
}

interface TemplateLibraryProps {
  onSelectTemplate: (template: CardTemplate) => void;
  userImage?: string | null;
  initialSport?: string;
  className?: string;
}

const CARD_TEMPLATES: CardTemplate[] = [
  // Baseball Templates
  {
    id: 'topps-chrome-baseball',
    name: 'Topps Chrome',
    category: 'premium',
    sport: 'baseball',
    style: 'modern',
    brand: 'Topps',
    year: '2023',
    thumbnailUrl: '/templates/topps-chrome-baseball.png',
    description: 'Premium chrome finish with reflective surface and team colors',
    premium: true
  },
  {
    id: 'topps-vintage',
    name: 'Topps Vintage',
    category: 'classic',
    sport: 'baseball',
    style: 'vintage',
    brand: 'Topps',
    year: '1975',
    thumbnailUrl: '/templates/topps-vintage-baseball.png',
    description: 'Classic 1975-inspired design with colored borders and team info'
  },
  {
    id: 'bowman-chrome',
    name: 'Bowman Chrome',
    category: 'premium',
    sport: 'baseball',
    style: 'modern',
    brand: 'Bowman',
    thumbnailUrl: '/templates/bowman-chrome.png',
    description: 'Prospect-focused design with chrome finish and clean layout',
    premium: true
  },
  {
    id: 'topps-finest',
    name: 'Topps Finest',
    category: 'premium',
    sport: 'baseball',
    style: 'bold',
    brand: 'Topps',
    thumbnailUrl: '/templates/topps-finest.png',
    description: 'Bold geometric patterns with reflective finish',
    premium: true
  },
  
  // Basketball Templates
  {
    id: 'panini-prizm-basketball',
    name: 'Panini Prizm',
    category: 'premium',
    sport: 'basketball',
    style: 'modern',
    brand: 'Panini',
    thumbnailUrl: '/templates/panini-prizm-basketball.png',
    description: 'Silver prizm pattern with team-colored accents',
    premium: true
  },
  {
    id: 'select-basketball',
    name: 'Select Basketball',
    category: 'premium',
    sport: 'basketball',
    style: 'modern',
    brand: 'Panini',
    thumbnailUrl: '/templates/select-basketball.png',
    description: 'Three-tiered design with concourse, premier, and courtside variants',
    premium: true
  },
  {
    id: 'nba-hoops',
    name: 'NBA Hoops',
    category: 'standard',
    sport: 'basketball',
    style: 'clean',
    brand: 'Panini',
    thumbnailUrl: '/templates/nba-hoops.png',
    description: 'Classic basketball card design with team colors and logo'
  },
  {
    id: 'court-kings',
    name: 'Court Kings',
    category: 'artistic',
    sport: 'basketball',
    style: 'artistic',
    brand: 'Panini',
    thumbnailUrl: '/templates/court-kings.png',
    description: 'Artistic interpretation with painted style and textured background'
  },
  
  // Football Templates
  {
    id: 'select-football',
    name: 'Select Football',
    category: 'premium',
    sport: 'football',
    style: 'modern',
    brand: 'Panini',
    thumbnailUrl: '/templates/select-football.png',
    description: 'Die-cut design with team colors and chrome finish',
    premium: true
  },
  {
    id: 'optic-football',
    name: 'Donruss Optic',
    category: 'premium',
    sport: 'football',
    style: 'clean',
    brand: 'Panini',
    thumbnailUrl: '/templates/optic-football.png',
    description: 'Clean design with colored borders and holo-foil treatment',
    premium: true
  },
  {
    id: 'certified-football',
    name: 'Certified',
    category: 'premium',
    sport: 'football',
    style: 'modern',
    brand: 'Panini',
    thumbnailUrl: '/templates/certified-football.png',
    description: 'Mirror-like finish with team colors and foil accents',
    premium: true
  },
  
  // Multi-Sport Templates
  {
    id: 'upper-deck-black-diamond',
    name: 'Black Diamond',
    category: 'premium',
    sport: 'hockey',
    style: 'premium',
    brand: 'Upper Deck',
    thumbnailUrl: '/templates/black-diamond.png',
    description: 'Premium multi-texture design with diamond patterns',
    premium: true
  },
  {
    id: 'leaf-valiant',
    name: 'Leaf Valiant',
    category: 'premium',
    sport: 'multi',
    style: 'modern',
    brand: 'Leaf',
    thumbnailUrl: '/templates/leaf-valiant.png',
    description: 'High-end design with chromium finish and clean borders',
    premium: true
  },
  {
    id: 'gold-standard',
    name: 'Gold Standard',
    category: 'premium',
    sport: 'multi',
    style: 'luxury',
    brand: 'Panini',
    thumbnailUrl: '/templates/gold-standard.png',
    description: 'Luxury gold foil design with premium finish',
    premium: true
  }
];

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onSelectTemplate,
  userImage,
  initialSport = 'all',
  className = ''
}) => {
  const [selectedSport, setSelectedSport] = useState<string>(initialSport);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPremium, setFilterPremium] = useState<boolean | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // Filter templates based on sport, search query, and premium filter
  const filteredTemplates = CARD_TEMPLATES.filter(template => {
    const sportMatch = selectedSport === 'all' || template.sport === selectedSport;
    const searchMatch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const premiumMatch = filterPremium === null || template.premium === filterPremium;
    
    return sportMatch && searchMatch && premiumMatch;
  });
  
  const handleSelectTemplate = (template: CardTemplate) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
  };
  
  const togglePremiumFilter = () => {
    // Cycle through: null (all) -> true (premium only) -> false (standard only) -> null (all)
    if (filterPremium === null) {
      setFilterPremium(true);
    } else if (filterPremium === true) {
      setFilterPremium(false);
    } else {
      setFilterPremium(null);
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Card Templates</h2>
        <p className="text-sm text-gray-500">Select a template for your card design</p>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search templates..." 
              className="pl-9" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
          <Button 
            variant={filterPremium === null ? "outline" : filterPremium ? "default" : "secondary"} 
            size="sm" 
            onClick={togglePremiumFilter}
            className="gap-1.5"
          >
            <Filter className="h-4 w-4" /> 
            {filterPremium === null ? "All" : filterPremium ? "Premium" : "Standard"}
          </Button>
        </div>
        
        <Tabs defaultValue={selectedSport} onValueChange={setSelectedSport}>
          <TabsList className="w-full grid grid-cols-6 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="baseball">Baseball</TabsTrigger>
            <TabsTrigger value="basketball">Basketball</TabsTrigger>
            <TabsTrigger value="football">Football</TabsTrigger>
            <TabsTrigger value="hockey">Hockey</TabsTrigger>
            <TabsTrigger value="multi">Multi</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedSport} className="mt-0">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 px-1">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <TemplateCard 
                      key={template.id}
                      template={template}
                      isSelected={template.id === selectedTemplate}
                      onSelect={() => handleSelectTemplate(template)}
                      previewImage={userImage}
                    />
                  ))
                ) : (
                  <div className="col-span-3 flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-gray-500">No templates found matching your criteria</p>
                    <Button 
                      variant="ghost" 
                      className="mt-2" 
                      onClick={() => {
                        setSearchQuery('');
                        setFilterPremium(null);
                        setSelectedSport('all');
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TemplateLibrary;
