
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import ElementCard from './ElementCard';
import ElementUploadDialog from './ElementUploadDialog';
import { ElementCategory, CardElement } from '@/lib/types/cardElements';
import { elementUploadToCardElement } from '@/lib/utils/typeAdapters';

interface ElementLibraryBrowserProps {
  onElementSelect?: (element: CardElement) => void;
  selectedElementId?: string;
  teamId?: string;
  className?: string;
}

const ElementLibraryBrowser: React.FC<ElementLibraryBrowserProps> = ({
  onElementSelect,
  selectedElementId,
  teamId,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('stickers');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  // Mock elements - in a real app, these would come from an API
  const [elements, setElements] = useState<CardElement[]>([
    // Stickers
    {
      id: 'sticker1',
      name: 'Star Sticker',
      description: 'A gold star sticker for achievements',
      type: 'standard',
      category: ElementCategory.STICKERS,
      url: '/assets/elements/stickers/star.png',
      imageUrl: 'https://placehold.co/200x200/FFD700/FFF?text=★',
      tags: ['star', 'gold', 'achievement'],
      position: { x: 50, y: 50, z: 0 },
      size: { width: 100, height: 100 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sticker2',
      name: 'Trophy Sticker',
      description: 'A trophy sticker for winners',
      type: 'standard',
      category: ElementCategory.STICKERS,
      url: '/assets/elements/stickers/trophy.png',
      imageUrl: 'https://placehold.co/200x200/C0C0C0/000?text=🏆',
      tags: ['trophy', 'winner', 'award'],
      position: { x: 50, y: 50, z: 0 },
      size: { width: 100, height: 100 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    
    // Team logos
    {
      id: 'team1',
      name: 'Red Team Logo',
      description: 'Logo for the Red Team',
      type: 'standard',
      category: ElementCategory.TEAMS,
      url: '/assets/elements/teams/red-team.png',
      imageUrl: 'https://placehold.co/200x200/FF0000/FFF?text=R',
      tags: ['red', 'team', 'logo'],
      position: { x: 50, y: 50, z: 0 },
      size: { width: 100, height: 100 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'team2',
      name: 'Blue Team Logo',
      description: 'Logo for the Blue Team',
      type: 'standard',
      category: ElementCategory.TEAMS,
      url: '/assets/elements/teams/blue-team.png',
      imageUrl: 'https://placehold.co/200x200/0000FF/FFF?text=B',
      tags: ['blue', 'team', 'logo'],
      position: { x: 50, y: 50, z: 0 },
      size: { width: 100, height: 100 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
  ]);
  
  // Filter elements by category and search query
  const filteredElements = elements.filter(element => {
    const matchesCategory = activeCategory === 'all' || element.category.toString().toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (element.tags && element.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    return matchesCategory && matchesSearch;
  });
  
  // Handle element selection
  const handleElementSelect = (element: CardElement) => {
    if (onElementSelect) {
      onElementSelect(element);
    }
  };
  
  // Handle element upload
  const handleElementUploaded = (asset: any) => {
    // Convert the uploaded asset to a CardElement
    const newElement = elementUploadToCardElement(asset);
    
    // Add to elements list
    setElements(prev => [newElement, ...prev]);
    
    // Close dialog
    setShowUploadDialog(false);
  };
  
  return (
    <div className={`element-library ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search elements..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          className="ml-2"
          onClick={() => setShowUploadDialog(true)}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add Element</span>
        </Button>
      </div>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="mb-4 w-full overflow-x-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="stickers">Stickers</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="frames">Frames</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-0">
          {filteredElements.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredElements.map(element => (
                <ElementCard 
                  key={element.id}
                  element={element}
                  isSelected={selectedElementId === element.id}
                  onClick={() => handleElementSelect(element)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No elements found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowUploadDialog(true)}
              >
                Upload New Element
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <ElementUploadDialog 
        open={showUploadDialog} 
        onOpenChange={setShowUploadDialog} 
        onElementUploaded={handleElementUploaded}
        teamId={teamId}
      />
    </div>
  );
};

export default ElementLibraryBrowser;
