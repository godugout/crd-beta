
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Trash, 
  Tags, 
  FolderPlus, 
  CheckCircle2,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { DigitalAsset } from '@/lib/dam/assetService';

interface AssetOrganizerProps {
  collectionId?: string;
  teamId?: string;
}

const AssetOrganizer: React.FC<AssetOrganizerProps> = ({
  collectionId,
  teamId
}) => {
  // Sample assets that match the complete DigitalAsset interface
  const [assets] = useState<DigitalAsset[]>(
    Array.from({ length: 12 }).map((_, i) => ({
      id: `asset-${i}`,
      title: `Asset ${i + 1}`,
      description: `Description for asset ${i + 1}`,
      publicUrl: `https://source.unsplash.com/random/300x300?sig=${i}`,
      thumbnailUrl: `https://source.unsplash.com/random/300x300?sig=${i}`,
      mimeType: 'image/jpeg',
      storagePath: `/assets/asset-${i}.jpg`,
      fileSize: 1024 * 1024, // 1MB
      tags: i % 3 === 0 ? ['landscape'] : i % 3 === 1 ? ['portrait'] : ['product'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user-1',
      originalFilename: `image-${i}.jpg`,
    }))
  );
  
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([
    'landscape', 'portrait', 'product', 'background', 'hero', 'card'
  ]);
  const [newTag, setNewTag] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  const handleSelectAsset = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };
  
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (availableTags.includes(newTag.trim())) {
      toast.error('Tag already exists');
      return;
    }
    
    setAvailableTags(prev => [...prev, newTag.trim()]);
    setNewTag('');
    toast.success('New tag created');
  };
  
  const handleDeleteTag = (tag: string) => {
    setAvailableTags(prev => prev.filter(t => t !== tag));
    if (activeTag === tag) {
      setActiveTag(null);
    }
  };
  
  const handleApplyTagToSelected = (tag: string) => {
    if (selectedAssets.length === 0) {
      toast.error('Please select assets first');
      return;
    }
    
    // In a real app, this would update the assets in the database
    toast.success(`Applied tag "${tag}" to ${selectedAssets.length} assets`);
    setSelectedAssets([]);
  };
  
  const filteredAssets = activeTag
    ? assets.filter(asset => asset.tags?.includes(activeTag))
    : assets;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Asset Organization</h2>
          <p className="text-gray-600">Categorize and organize your digital assets</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={selectedAssets.length === 0}
            onClick={() => {
              setSelectedAssets([]);
              toast.success("Selection cleared");
            }}
          >
            <X className="h-4 w-4 mr-1" />
            Clear Selection
          </Button>
          <Button
            size="sm"
            disabled={selectedAssets.length === 0}
            onClick={() => toast.success(`${selectedAssets.length} assets moved to new collection`)}
          >
            <FolderPlus className="h-4 w-4 mr-1" />
            Move to Collection
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tags panel */}
        <div className="w-full md:w-72 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-3">Tags</h3>
              
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="New tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag();
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={handleAddTag}>Add</Button>
              </div>
              
              <div className="space-y-2">
                {availableTags.map(tag => (
                  <div key={tag} className="flex justify-between items-center">
                    <Badge 
                      className={`cursor-pointer ${activeTag === tag ? 'bg-blue-500' : ''}`}
                      onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    >
                      {tag}
                    </Badge>
                    <div className="flex gap-1">
                      <Button 
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleApplyTagToSelected(tag)}
                        disabled={selectedAssets.length === 0}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-red-500"
                        onClick={() => handleDeleteTag(tag)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {availableTags.length === 0 && (
                  <p className="text-sm text-gray-500">No tags created yet</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {selectedAssets.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-3">Selected Assets</h3>
                <Badge className="mb-2">{selectedAssets.length} selected</Badge>
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    className="w-full flex items-center justify-center"
                    variant="outline"
                  >
                    <Tags className="h-4 w-4 mr-1" />
                    Apply Tag
                  </Button>
                  <Button 
                    size="sm" 
                    className="w-full flex items-center justify-center"
                    variant="outline"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Assets grid */}
        <div className="flex-1">
          {activeTag && (
            <div className="mb-4 flex items-center">
              <Badge className="mr-2">{activeTag}</Badge>
              <p className="text-sm text-gray-500">
                Showing {filteredAssets.length} assets with this tag
              </p>
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-auto"
                onClick={() => setActiveTag(null)}
              >
                Show All
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map(asset => {
              const isSelected = selectedAssets.includes(asset.id);
              
              return (
                <div 
                  key={asset.id} 
                  className={`border rounded-lg overflow-hidden cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleSelectAsset(asset.id)}
                >
                  <div className="aspect-square relative">
                    <img 
                      src={asset.publicUrl} 
                      alt={asset.title || 'Asset'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                      {isSelected && (
                        <div className="bg-blue-500 text-white rounded-full p-1">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <p className="text-sm font-medium truncate">{asset.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {asset.tags?.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTag(tag);
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredAssets.length === 0 && (
              <div className="col-span-full p-8 text-center">
                <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                {activeTag ? (
                  <p className="text-gray-500">No assets with tag "{activeTag}"</p>
                ) : (
                  <p className="text-gray-500">No assets available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetOrganizer;
