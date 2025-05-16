
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { CardElement, ElementType, ElementCategory } from '@/lib/types/cardElements';
import { elementLibrary } from '@/lib/elements/ElementLibrary';
import { cn } from '@/lib/utils';

interface ElementLibraryBrowserProps {
  onElementSelect: (element: CardElement) => void;
  selectedElementId?: string;
  filterTypes?: ElementType[];
}

const ElementLibraryBrowser: React.FC<ElementLibraryBrowserProps> = ({
  onElementSelect,
  selectedElementId,
  filterTypes,
}) => {
  const [elements, setElements] = useState<CardElement[]>([]);
  const [activeTab, setActiveTab] = useState<ElementType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ElementCategory | 'all'>('all');
  const [officialFilter, setOfficialFilter] = useState<'all' | 'official' | 'community'>('all');
  
  // Load elements on component mount
  useEffect(() => {
    loadElements();
  }, []);
  
  // Reload when tab changes
  useEffect(() => {
    loadElements();
  }, [activeTab, searchQuery, categoryFilter, officialFilter]);
  
  // Load elements from the library
  const loadElements = () => {
    let filteredElements: CardElement[];
    
    // First, apply tab filter (element type)
    if (activeTab === 'all') {
      filteredElements = elementLibrary.getAllElements();
    } else {
      filteredElements = elementLibrary.getElementsByType(activeTab);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filteredElements = filteredElements.filter(
        element => element.category === categoryFilter
      );
    }
    
    // Apply official/community filter
    if (officialFilter !== 'all') {
      filteredElements = filteredElements.filter(
        element => element.isOfficial === (officialFilter === 'official')
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredElements = filteredElements.filter(
        element => 
          element.name.toLowerCase().includes(query) ||
          element.tags.some(tag => tag.toLowerCase().includes(query)) ||
          (element.description && element.description.toLowerCase().includes(query))
      );
    }
    
    // Apply external type filter if provided
    if (filterTypes && filterTypes.length > 0) {
      filteredElements = filteredElements.filter(
        element => filterTypes.includes(element.type)
      );
    }
    
    setElements(filteredElements);
  };
  
  // Element type tabs
  const tabs = [
    { value: 'all', label: 'All' },
    { value: 'sticker', label: 'Stickers' },
    { value: 'logo', label: 'Logos' },
    { value: 'frame', label: 'Frames' },
    { value: 'badge', label: 'Badges' },
    { value: 'overlay', label: 'Overlays' }
  ];
  
  // Category options
  const categoryOptions: { value: ElementCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'sports', label: 'Sports' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'decorative', label: 'Decorative' },
    { value: 'seasonal', label: 'Seasonal' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'teams', label: 'Teams' },
    { value: 'brands', label: 'Brands' },
    { value: 'custom', label: 'Custom' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div>
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ElementType | 'all')}
      >
        <TabsList className="grid grid-cols-6 mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value as ElementCategory | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={officialFilter}
            onValueChange={(value) => setOfficialFilter(value as 'all' | 'official' | 'community')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="official">Official</SelectItem>
              <SelectItem value="community">Community</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Elements grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {elements.length > 0 ? (
            elements.map((element) => (
              <Card 
                key={element.id}
                className={cn(
                  "cursor-pointer hover:border-primary transition-colors",
                  element.id === selectedElementId && "border-primary"
                )}
                onClick={() => onElementSelect(element)}
              >
                <CardContent className="p-3">
                  <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                    {element.thumbnailUrl ? (
                      <img 
                        src={element.thumbnailUrl} 
                        alt={element.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-muted-foreground text-xs text-center p-2">
                        No preview
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm truncate">{element.name}</h3>
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      <Badge 
                        variant={element.isOfficial ? "default" : "outline"}
                        className="text-[10px] px-1 py-0 h-4"
                      >
                        {element.isOfficial ? 'Official' : 'Community'}
                      </Badge>
                      <Badge 
                        variant="secondary"
                        className="text-[10px] px-1 py-0 h-4"
                      >
                        {element.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No elements found matching your criteria
            </div>
          )}
        </div>
        
        {/* Add some demo placeholder elements if none exist */}
        {elements.length === 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Add some demo elements
              const demoSticker = elementLibrary.createElement('sticker', {
                name: 'Star Sticker',
                assetUrl: '/placeholder.svg',
                thumbnailUrl: '/placeholder.svg',
                description: 'A sample star sticker',
                tags: ['star', 'sample', 'decoration'],
                category: 'decorative',
                isOfficial: true,
                position: { x: 0, y: 0, z: 0, rotation: 0 },
                size: { width: 100, height: 100, scale: 1, aspectRatio: 1, preserveAspectRatio: true },
                style: { opacity: 1 }
              });
              
              const demoLogo = elementLibrary.createElement('logo', {
                name: 'Sample Team Logo',
                assetUrl: '/placeholder.svg',
                thumbnailUrl: '/placeholder.svg',
                description: 'A sample team logo',
                tags: ['team', 'logo', 'sports'],
                category: 'teams',
                isOfficial: true,
                position: { x: 0, y: 0, z: 0, rotation: 0 },
                size: { width: 120, height: 120, scale: 1, aspectRatio: 1, preserveAspectRatio: true },
                style: { opacity: 1 }
              });
              
              const demoFrame = elementLibrary.createElement('frame', {
                name: 'Gold Frame',
                assetUrl: '/placeholder.svg',
                thumbnailUrl: '/placeholder.svg',
                description: 'A decorative gold frame',
                tags: ['frame', 'gold', 'decoration'],
                category: 'decorative',
                isOfficial: true,
                position: { x: 0, y: 0, z: 0, rotation: 0 },
                size: { width: 300, height: 400, scale: 1, aspectRatio: 0.75, preserveAspectRatio: true },
                style: { opacity: 1 }
              });
              
              loadElements();
            }}
          >
            Add Demo Elements
          </Button>
        )}
      </div>
    </div>
  );
};

export default ElementLibraryBrowser;
