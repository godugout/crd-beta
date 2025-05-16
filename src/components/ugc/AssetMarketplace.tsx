
import React, { useState } from 'react';
import { useUGCSystem } from '@/hooks/useUGCSystem';
import { UGCAsset } from '@/lib/types/ugcTypes';
import { ElementType, ElementCategory } from '@/lib/types/cardElements';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectGroup, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search, Filter, Star, Download, ShoppingCart, Award,
  CheckCircle, AlertCircle, AlertTriangle, Clock
} from 'lucide-react';

interface AssetMarketplaceProps {
  onAssetSelect?: (asset: UGCAsset) => void;
  defaultType?: ElementType;
}

const AssetMarketplace: React.FC<AssetMarketplaceProps> = ({
  onAssetSelect,
  defaultType
}) => {
  // Filter state
  const [assetType, setAssetType] = useState<ElementType | undefined>(defaultType);
  const [category, setCategory] = useState<ElementCategory | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<'latest' | 'popular' | 'rating'>('latest');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  
  // Fetch assets with current filters
  const { data: assets, isLoading, isError } = useUGCSystem().usePublicAssets({
    assetType,
    category,
    sortBy: sort,
    featured: featuredOnly,
    // We'll handle search client-side for better UX
    // In a real implementation, this would be server-side
  });
  
  // Filter assets by search query client-side
  const filteredAssets = assets?.filter(asset => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      asset.title.toLowerCase().includes(query) ||
      asset.description?.toLowerCase().includes(query) ||
      asset.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }) || [];
  
  // Asset type options
  const assetTypeOptions: { value: ElementType; label: string }[] = [
    { value: 'sticker', label: 'Stickers' },
    { value: 'logo', label: 'Logos' },
    { value: 'frame', label: 'Frames' },
    { value: 'badge', label: 'Badges' },
    { value: 'overlay', label: 'Overlays' }
  ];
  
  // Category options
  const categoryOptions: { value: ElementCategory; label: string }[] = [
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
  
  // Sort options
  const sortOptions = [
    { value: 'latest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v as any)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => setFeaturedOnly(!featuredOnly)} className={featuredOnly ? 'bg-primary/10' : ''}>
            <Award size={16} className="mr-2" />
            Featured
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={defaultType || "all"} onValueChange={(v) => setAssetType(v === 'all' ? undefined : v as ElementType)}>
        <TabsList className="w-full overflow-auto">
          <TabsTrigger value="all">All Types</TabsTrigger>
          {assetTypeOptions.map(type => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 10 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square bg-muted">
                <Skeleton className="w-full h-full" />
              </div>
              <CardContent className="p-3">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : isError ? (
          <div className="col-span-full text-center py-8">
            <AlertCircle className="mx-auto h-10 w-10 text-destructive mb-2" />
            <h3 className="font-medium">Error loading marketplace</h3>
            <p className="text-muted-foreground text-sm">Please try again later</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium">No assets found</h3>
            <p className="text-muted-foreground text-sm">Try changing your filters</p>
          </div>
        ) : (
          // Asset grid
          filteredAssets.map(asset => (
            <AssetCard 
              key={asset.id} 
              asset={asset}
              onSelect={onAssetSelect}
            />
          ))
        )}
      </div>
      
      {assets && assets.length > 0 && (
        <div className="text-center text-sm text-muted-foreground py-2">
          Showing {filteredAssets.length} of {assets.length} assets
        </div>
      )}
    </div>
  );
};

// Asset card component
interface AssetCardProps {
  asset: UGCAsset;
  onSelect?: (asset: UGCAsset) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onSelect }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Format price display
  const priceDisplay = asset.marketplace?.isForSale
    ? `${asset.marketplace.price || 0} credits`
    : 'Free';
  
  // Generate star rating
  const rating = asset.marketplace?.rating || 0;
  const stars = Array.from({ length: 5 }).map((_, i) => (
    <Star 
      key={i} 
      size={12} 
      className={i < Math.round(rating) ? 'fill-primary text-primary' : 'text-muted'} 
    />
  ));

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => onSelect && onSelect(asset)}
    >
      <div className="relative aspect-square bg-muted">
        <img 
          src={asset.thumbnailUrl || asset.assetUrl} 
          alt={asset.title}
          className="w-full h-full object-contain"
        />
        
        {asset.marketplace?.featured && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-primary text-primary-foreground">
            <Award size={12} className="mr-1" /> Featured
          </Badge>
        )}
        
        {isHovering && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Button variant="outline" className="text-white border-white hover:text-white">
              {asset.marketplace?.isForSale ? (
                <>
                  <ShoppingCart size={16} className="mr-2" />
                  Purchase
                </>
              ) : (
                <>
                  <Download size={16} className="mr-2" />
                  Use this
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium truncate" title={asset.title}>
          {asset.title}
        </h3>
        
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center">
            {stars}
            {asset.marketplace?.ratingCount ? (
              <span className="text-xs ml-1 text-muted-foreground">
                ({asset.marketplace.ratingCount})
              </span>
            ) : null}
          </div>
          <span className="text-sm font-medium">
            {priceDisplay}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="px-3 py-2 border-t flex justify-between items-center">
        <Badge variant="outline" className="text-xs font-normal">
          {asset.assetType}
        </Badge>
        
        <div className="flex gap-1">
          {asset.moderation.status === 'approved' ? (
            <CheckCircle size={14} className="text-green-500" title="Approved" />
          ) : asset.moderation.status === 'pending' ? (
            <Clock size={14} className="text-amber-500" title="Pending review" />
          ) : (
            <AlertCircle size={14} className="text-red-500" title="Rejected" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AssetMarketplace;
