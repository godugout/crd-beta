
import React, { useState } from 'react';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import { 
  ChevronDown, 
  Search,
  Grid3X3,
  LayoutList, 
  Filter,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Categories that match the mockup
const FILTER_CATEGORIES = [
  { value: 'all', label: 'All Items' },
  { value: 'sports', label: 'Sports' },
  { value: 'comics', label: 'Comics' },
  { value: 'games', label: 'Games' },
  { value: 'music', label: 'Music' },
  { value: 'art', label: 'Art' },
];

// Card design options that match the mockup
const DESIGN_OPTIONS = [
  { value: 'all', label: 'All designs' },
  { value: 'custom', label: 'Custom Card' },
  { value: 'nostalgic', label: 'Cardshow Nostalgia' },
  { value: 'classic', label: 'Classic Cardboard' },
  { value: 'nifty', label: 'Nifty Framework' },
];

interface CardGalleryViewProps {
  onCardClick: (cardId: string) => void;
}

const CardGalleryView: React.FC<CardGalleryViewProps> = ({ onCardClick }) => {
  const { cards } = useCards();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0.01, 1000]);
  const [sortBy, setSortBy] = useState('recently-added');
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>(['all']);
  
  const handleDesignSelect = (design: string) => {
    if (design === 'all') {
      setSelectedDesigns(['all']);
      return;
    }
    
    // Remove 'all' if it's selected
    let newDesigns = selectedDesigns.filter(d => d !== 'all');
    
    if (newDesigns.includes(design)) {
      newDesigns = newDesigns.filter(d => d !== design);
      // If nothing is selected, default to 'all'
      if (newDesigns.length === 0) {
        newDesigns = ['all'];
      }
    } else {
      newDesigns.push(design);
    }
    
    setSelectedDesigns(newDesigns);
  };

  const filteredCards = cards
    .filter(card => {
      // Filter by search term
      if (searchTerm && !card.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by category
      if (activeCategory !== 'all') {
        const cardCategory = card.designMetadata?.cardMetadata?.category || '';
        if (cardCategory !== activeCategory) {
          return false;
        }
      }
      
      // Filter by design/template
      if (!selectedDesigns.includes('all')) {
        const cardTemplate = card.designMetadata?.cardStyle?.template || '';
        if (!selectedDesigns.includes(cardTemplate)) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recently-added':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest-first':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'a-z':
          return a.title.localeCompare(b.title);
        case 'z-a':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  
  const clearFilters = () => {
    setSearchTerm('');
    setActiveCategory('all');
    setPriceRange([0.01, 1000]);
    setSelectedDesigns(['all']);
    setSortBy('recently-added');
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for anything with keywords related to cards, series, creators, etc."
              className="pl-10 bg-gray-900 border-gray-700 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-gray-900 border-gray-700 text-gray-300">
                  {sortBy === 'recently-added' && 'Recently added'}
                  {sortBy === 'oldest-first' && 'Oldest first'}
                  {sortBy === 'a-z' && 'A-Z'}
                  {sortBy === 'z-a' && 'Z-A'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
                <DropdownMenuItem onClick={() => setSortBy('recently-added')}>Recently added</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('oldest-first')}>Oldest first</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('a-z')}>A-Z</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('z-a')}>Z-A</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex rounded-md border border-gray-700 overflow-hidden">
              <Button
                variant="ghost" 
                size="sm"
                className={`rounded-none px-2 ${viewMode === 'grid' ? 'bg-gray-700' : 'bg-transparent'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost" 
                size="sm"
                className={`rounded-none px-2 ${viewMode === 'list' ? 'bg-gray-700' : 'bg-transparent'}`}
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="bg-gray-900 border-gray-700 text-gray-300">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gray-900 border-l-gray-700 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white">Filters</SheetTitle>
                </SheetHeader>
                
                <div className="py-6">
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">PRICE RANGE</h3>
                    <div className="space-y-6">
                      <Slider
                        defaultValue={[0.01, 1000]}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0.01}
                        max={1000}
                        step={0.01}
                        className="my-4"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{priceRange[0].toFixed(2)} USD</span>
                        <span>{priceRange[1].toFixed(2)} USD</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">FANS</h3>
                    <RadioGroup defaultValue="most-liked">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="most-liked" id="most-liked" />
                        <Label htmlFor="most-liked">Most liked</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="least-liked" id="least-liked" />
                        <Label htmlFor="least-liked">Least liked</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recently-liked" id="recently-liked" />
                        <Label htmlFor="recently-liked">Recently liked</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">DESIGN</h3>
                    <div className="space-y-2">
                      {DESIGN_OPTIONS.map(design => (
                        <div key={design.value} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={`design-${design.value}`} 
                            checked={selectedDesigns.includes(design.value)}
                            onChange={() => handleDesignSelect(design.value)}
                            className="rounded border-gray-700 text-green-500 focus:ring-green-500"
                          />
                          <label htmlFor={`design-${design.value}`}>{design.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">SERIES</h3>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-md p-2">
                      <option value="80s-vcr">80s VCR</option>
                      <option value="vintage">Vintage</option>
                      <option value="modern">Modern</option>
                    </select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">CREATOR</h3>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-md p-2">
                      <option value="fan-submissions">Fan Submissions</option>
                      <option value="verified-artists">Verified Artists</option>
                      <option value="topps">Topps</option>
                    </select>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="flex items-center mt-4"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reset filter
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="overflow-x-auto py-2">
          <div className="flex gap-2 min-w-max">
            {FILTER_CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant={activeCategory === category.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category.value)}
                className={activeCategory === category.value 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "bg-gray-900 border-gray-700 text-gray-300"
                }
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
        
        {(searchTerm || activeCategory !== 'all' || !selectedDesigns.includes('all')) && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setSearchTerm('')}>
                Search: {searchTerm} <X className="ml-1 h-3 w-3" />
              </Badge>
            )}
            
            {activeCategory !== 'all' && (
              <Badge className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setActiveCategory('all')}>
                Category: {FILTER_CATEGORIES.find(c => c.value === activeCategory)?.label} <X className="ml-1 h-3 w-3" />
              </Badge>
            )}
            
            {!selectedDesigns.includes('all') && (
              <Badge className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setSelectedDesigns(['all'])}>
                Custom designs <X className="ml-1 h-3 w-3" />
              </Badge>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-6 px-2 text-xs text-gray-400"
            >
              Clear all
            </Button>
          </div>
        )}
        
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCards.map((card) => (
              <CardItem 
                key={card.id} 
                card={card} 
                onClick={() => onCardClick(card.id)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No cards found matching your search criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        )}
        
        {filteredCards.length > 8 && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" className="bg-gray-900 border-gray-700 text-white">
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface CardItemProps {
  card: Card;
  onClick: () => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onClick }) => {
  // Get template style if available
  const templateStyle = card.designMetadata?.cardStyle || {
    borderRadius: '8px',
    borderColor: '#22c55e',
    frameColor: '#22c55e',
    frameWidth: 3,
    shadowColor: 'rgba(34, 197, 94, 0.5)',
  };
  
  return (
    <div 
      className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
      onClick={onClick}
    >
      <div className="relative">
        <div 
          className="aspect-[2.5/3.5] overflow-hidden"
          style={{
            borderRadius: templateStyle.borderRadius || '8px',
            boxShadow: `0 0 10px ${templateStyle.shadowColor || 'rgba(0,0,0,0.5)'}`,
            border: `${templateStyle.frameWidth || 3}px solid ${templateStyle.borderColor || templateStyle.frameColor || '#22c55e'}`,
          }}
        >
          <img 
            src={card.imageUrl} 
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute top-2 right-2">
          <Badge className="bg-green-500 hover:bg-green-600">
            2.45 ETH
          </Badge>
        </div>
      </div>
      
      <div className="py-2">
        <h3 className="font-medium text-sm">{card.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <div className="w-4 h-4 rounded-full bg-blue-500" />
          </div>
          <span className="text-xs text-gray-400">3 in stock</span>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <div className="flex items-center">
            <SlidersHorizontal className="h-3 w-3 mr-1" /> Highest bid: 0.001 ETH
          </div>
          <span>New bid 🔥</span>
        </div>
      </div>
    </div>
  );
};

export default CardGalleryView;
