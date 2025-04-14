
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Save, Star } from 'lucide-react';
import { SportType } from './UniformTextureMapper';

interface UniformGalleryProps {
  onSelectUniform: (uniform: UniformPreset) => void;
  onSaveCustomUniform?: (name: string, textureUrl: string, sport: SportType) => void;
  customTexture?: string;
  sportType?: SportType;
}

export interface UniformPreset {
  id: string;
  name: string;
  sport: SportType;
  team: string;
  textureUrl: string;
  isPro?: boolean;
  isCustom?: boolean;
  isFavorite?: boolean;
}

// Sample presets - in a real app these would come from an API or database
const UNIFORM_PRESETS: UniformPreset[] = [
  {
    id: 'bulls-1',
    name: 'Chicago Bulls Home',
    sport: 'basketball',
    team: 'Chicago Bulls',
    textureUrl: '/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png',
    isPro: true
  },
  {
    id: 'lakers-1',
    name: 'LA Lakers Gold',
    sport: 'basketball',
    team: 'Los Angeles Lakers',
    textureUrl: '/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png',
    isPro: true
  },
  {
    id: 'nets-1',
    name: 'Brooklyn Nets Icon',
    sport: 'basketball',
    team: 'Brooklyn Nets',
    textureUrl: '/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png',
    isPro: true
  },
  {
    id: 'yankees-1',
    name: 'Yankees Pinstripes',
    sport: 'baseball',
    team: 'New York Yankees',
    textureUrl: '/lovable-uploads/93353027-d213-4314-8ab9-0d38bb552e8a.png',
    isPro: true
  },
  {
    id: 'redsox-1',
    name: 'Red Sox Home',
    sport: 'baseball',
    team: 'Boston Red Sox',
    textureUrl: '/lovable-uploads/93353027-d213-4314-8ab9-0d38bb552e8a.png',
    isPro: true
  },
  {
    id: 'packers-1',
    name: 'Packers Home',
    sport: 'football',
    team: 'Green Bay Packers',
    textureUrl: '/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png',
    isPro: true
  },
  {
    id: 'leafs-1',
    name: 'Maple Leafs Home',
    sport: 'hockey',
    team: 'Toronto Maple Leafs',
    textureUrl: '/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png',
    isPro: true
  },
  {
    id: 'manchester-1',
    name: 'Man United Home',
    sport: 'soccer',
    team: 'Manchester United',
    textureUrl: '/lovable-uploads/f07b9e90-98ec-4e0c-bca4-71acd9ae9924.png',
    isPro: true
  },
];

const UniformGallery: React.FC<UniformGalleryProps> = ({
  onSelectUniform,
  onSaveCustomUniform,
  customTexture,
  sportType = 'basketball'
}) => {
  const [activeTab, setActiveTab] = useState<string>('pro');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customUniforms, setCustomUniforms] = useState<UniformPreset[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<UniformPreset[]>([]);
  const [favorites, setFavorites] = useState<UniformPreset[]>([]);
  const [newUniformName, setNewUniformName] = useState<string>('');

  // Filter uniforms by search query and active sport type
  const getFilteredUniforms = (uniforms: UniformPreset[]) => {
    return uniforms.filter(uni => 
      (uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.team.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (sportType === 'all' || uni.sport === sportType)
    );
  };

  // Mark uniform as recently used
  const handleSelectUniform = (uniform: UniformPreset) => {
    onSelectUniform(uniform);
    
    // Add to recently used if not already there
    if (!recentlyUsed.find(u => u.id === uniform.id)) {
      setRecentlyUsed(prev => [uniform, ...prev.slice(0, 4)]);
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = (uniform: UniformPreset) => {
    if (favorites.some(u => u.id === uniform.id)) {
      setFavorites(prev => prev.filter(u => u.id !== uniform.id));
    } else {
      setFavorites(prev => [uniform, ...prev]);
    }
  };

  // Save custom uniform
  const handleSaveCustomUniform = () => {
    if (!customTexture || !newUniformName.trim() || !onSaveCustomUniform) return;
    
    const newCustomUniform: UniformPreset = {
      id: `custom-${Date.now()}`,
      name: newUniformName,
      sport: sportType,
      team: 'Custom',
      textureUrl: customTexture,
      isCustom: true
    };
    
    onSaveCustomUniform(newUniformName, customTexture, sportType);
    setCustomUniforms(prev => [newCustomUniform, ...prev]);
    setNewUniformName('');
    setActiveTab('custom');
  };

  const proUniforms = getFilteredUniforms(UNIFORM_PRESETS);
  const filteredCustomUniforms = getFilteredUniforms(customUniforms);
  const filteredRecentlyUsed = getFilteredUniforms(recentlyUsed);
  const filteredFavorites = getFilteredUniforms(favorites);
  
  return (
    <div className="uniform-gallery p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Uniform Gallery</h3>
      
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search uniforms..."
          className="pl-10"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Save custom uniform section */}
      {customTexture && (
        <div className="mb-4 p-3 border rounded-md bg-slate-50">
          <h4 className="text-sm font-medium mb-2">Save Current Design</h4>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Uniform name"
              value={newUniformName}
              onChange={e => setNewUniformName(e.target.value)}
              maxLength={30}
            />
            <Button size="sm" onClick={handleSaveCustomUniform} disabled={!newUniformName.trim()}>
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="pro">Pro Teams</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        {/* Pro Teams */}
        <TabsContent value="pro">
          <ScrollArea className="h-[400px] pr-4">
            {proUniforms.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {proUniforms.map(uniform => (
                  <UniformCard
                    key={uniform.id}
                    uniform={uniform}
                    onSelect={handleSelectUniform}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.some(u => u.id === uniform.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No matching professional uniforms" />
            )}
          </ScrollArea>
        </TabsContent>
        
        {/* Custom */}
        <TabsContent value="custom">
          <ScrollArea className="h-[400px] pr-4">
            {filteredCustomUniforms.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredCustomUniforms.map(uniform => (
                  <UniformCard
                    key={uniform.id}
                    uniform={uniform}
                    onSelect={handleSelectUniform}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.some(u => u.id === uniform.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No custom uniforms saved yet" />
            )}
          </ScrollArea>
        </TabsContent>
        
        {/* Recent */}
        <TabsContent value="recent">
          <ScrollArea className="h-[400px] pr-4">
            {filteredRecentlyUsed.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredRecentlyUsed.map(uniform => (
                  <UniformCard
                    key={uniform.id}
                    uniform={uniform}
                    onSelect={handleSelectUniform}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.some(u => u.id === uniform.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No recently used uniforms" />
            )}
          </ScrollArea>
        </TabsContent>
        
        {/* Favorites */}
        <TabsContent value="favorites">
          <ScrollArea className="h-[400px] pr-4">
            {filteredFavorites.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredFavorites.map(uniform => (
                  <UniformCard
                    key={uniform.id}
                    uniform={uniform}
                    onSelect={handleSelectUniform}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No favorite uniforms saved" />
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Uniform Card Component
interface UniformCardProps {
  uniform: UniformPreset;
  onSelect: (uniform: UniformPreset) => void;
  onToggleFavorite: (uniform: UniformPreset) => void;
  isFavorite: boolean;
}

const UniformCard: React.FC<UniformCardProps> = ({ uniform, onSelect, onToggleFavorite, isFavorite }) => {
  return (
    <div 
      className="group relative border rounded-md overflow-hidden cursor-pointer"
      onClick={() => onSelect(uniform)}
    >
      <div className="aspect-square">
        <img 
          src={uniform.textureUrl} 
          alt={uniform.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <p className="text-xs text-white font-medium truncate">{uniform.name}</p>
        <p className="text-[10px] text-gray-300">{uniform.team}</p>
      </div>
      
      {uniform.isPro && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm">
          Pro
        </div>
      )}
      
      {uniform.isCustom && (
        <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm">
          Custom
        </div>
      )}
      
      <button 
        className={`absolute top-2 right-2 p-1 rounded-full ${isFavorite ? 'text-yellow-400 bg-gray-800/70' : 'text-gray-300 bg-gray-700/50 opacity-0 group-hover:opacity-100'} transition-opacity`}
        onClick={(e) => { 
          e.stopPropagation(); 
          onToggleFavorite(uniform); 
        }}
      >
        <Star className="h-3.5 w-3.5" fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
};

// Empty State Component
interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-gray-500 mb-1">{message}</p>
      <p className="text-sm text-gray-400">Try changing your search or filters</p>
    </div>
  );
};

export default UniformGallery;
