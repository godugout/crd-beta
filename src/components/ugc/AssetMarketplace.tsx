
import React, { useState, useEffect } from 'react';
import { UGCAsset } from '@/lib/types/ugcTypes';
import { ElementCategory, ElementType } from '@/lib/types/cardElements';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Sliders, Tag, Star, Download, Clock, TrendingUp } from 'lucide-react';
import { useUGCSystem } from '@/hooks/useUGCSystem';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface AssetMarketplaceProps {
  onAssetSelect?: (asset: UGCAsset) => void;
}

const AssetMarketplace: React.FC<AssetMarketplaceProps> = ({ onAssetSelect }) => {
  // Asset filter state
  const [assetType, setAssetType] = useState<ElementType | undefined>(undefined);
  const [category, setCategory] = useState<ElementCategory | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating'>('latest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch assets using the UGC hook
  const { usePublicAssets } = useUGCSystem();
  const { data: assets, isLoading, error } = usePublicAssets({
    assetType,
    category,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    sortBy
  });
  
  // Popular tags (would come from API in a real implementation)
  const popularTags = [
    'official', 'premium', 'holographic', 'vintage', 'modern', 
    'sports', 'digital', 'abstract', 'minimalist', 'animated'
  ];
  
  // Handle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Filter assets based on search query
  const filteredAssets = assets?.filter(asset => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      asset.title.toLowerCase().includes(query) ||
      (asset.description && asset.description.toLowerCase().includes(query)) ||
      asset.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }) || [];
  
  return (
    <div className="space-y-6">
      {/* Search and filter bar */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-accent text-accent-foreground' : ''}
          >
            <Filter className="h-4 w-4" />
          </Button>
          
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="latest">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Latest
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Popular
                  </div>
                </SelectItem>
                <SelectItem value="rating">
                  <div className="flex items-center">
                    <Star className="mr-2 h-4 w-4" />
                    Top Rated
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/30">
            <div>
              <h4 className="mb-2 text-sm font-medium">Asset Type</h4>
              <Select 
                value={assetType} 
                onValueChange={(value) => setAssetType(value as ElementType || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="sticker">Stickers</SelectItem>
                  <SelectItem value="logo">Logos</SelectItem>
                  <SelectItem value="frame">Frames</SelectItem>
                  <SelectItem value="badge">Badges</SelectItem>
                  <SelectItem value="overlay">Overlays</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h4 className="mb-2 text-sm font-medium">Category</h4>
              <Select 
                value={category} 
                onValueChange={(value) => setCategory(value as ElementCategory || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="decorative">Decorative</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h4 className="mb-2 text-sm font-medium">Tags</h4>
              <ScrollArea className="h-20 p-2 border rounded-md">
                <div className="flex flex-wrap gap-1">
                  {popularTags.map(tag => (
                    <Badge 
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
      
      {/* Asset Gallery */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid grid-cols-4 sm:grid-cols-4 md:w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="official">Official</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="free">Free</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-md mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">Error loading assets.</p>
              <Button variant="outline" className="mt-2">
                Try Again
              </Button>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground mb-2">No assets found matching your criteria.</p>
              {searchQuery || assetType || category || selectedTags.length > 0 ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setAssetType(undefined);
                    setCategory(undefined);
                    setSelectedTags([]);
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Be the first to upload content to the marketplace!
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => (
                <AssetCard 
                  key={asset.id} 
                  asset={asset} 
                  onClick={() => onAssetSelect?.(asset)} 
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="official" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets
              .filter(asset => asset.isOfficial)
              .map((asset) => (
                <AssetCard 
                  key={asset.id} 
                  asset={asset} 
                  onClick={() => onAssetSelect?.(asset)} 
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="featured" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets
              .filter(asset => asset.marketplace?.featured)
              .map((asset) => (
                <AssetCard 
                  key={asset.id} 
                  asset={asset} 
                  onClick={() => onAssetSelect?.(asset)} 
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="free" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets
              .filter(asset => !asset.marketplace?.isForSale)
              .map((asset) => (
                <AssetCard 
                  key={asset.id} 
                  asset={asset} 
                  onClick={() => onAssetSelect?.(asset)} 
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Asset Card Component
interface AssetCardProps {
  asset: UGCAsset;
  onClick?: () => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick }) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="aspect-square bg-muted relative">
        {asset.thumbnailUrl ? (
          <img 
            src={asset.thumbnailUrl} 
            alt={asset.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No Preview
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex gap-1">
          {asset.isOfficial && (
            <Badge variant="secondary" className="bg-primary text-white">
              Official
            </Badge>
          )}
          {asset.marketplace?.featured && (
            <Badge variant="secondary" className="bg-amber-500 text-white">
              Featured
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium truncate text-sm">{asset.title}</h3>
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <Tag className="h-3 w-3 mr-1" />
            {asset.category || asset.assetType}
          </div>
          
          {asset.marketplace?.isForSale ? (
            <Badge variant="outline" className="text-xs">
              {asset.marketplace.price} Credits
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 hover:bg-green-500/20">
              Free
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetMarketplace;
