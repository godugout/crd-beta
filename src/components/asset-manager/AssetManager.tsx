
import React, { useState } from 'react';
import { useDigitalAssets } from '@/hooks/useDigitalAssets';
import { DigitalAsset } from '@/services/digitalAssetService';
import AssetGrid from './AssetGrid';
import AssetUploader from './AssetUploader';
import AssetFilterBar from './AssetFilterBar';
import AssetDetails from './AssetDetails';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUp, FileImage, FolderOpen, Upload } from 'lucide-react';

interface AssetManagerProps {
  onSelect?: (asset: DigitalAsset) => void;
  initialFolder?: string;
  allowedTypes?: string[];
  maxFileSize?: number;
  className?: string;
  showUploadTab?: boolean;
}

const AssetManager: React.FC<AssetManagerProps> = ({
  onSelect,
  initialFolder = 'uploads',
  allowedTypes,
  maxFileSize = 10, // MB
  className = '',
  showUploadTab = true,
}) => {
  const [activeTab, setActiveTab] = useState<string>(showUploadTab ? 'upload' : 'browse');
  const [selectedFolder, setSelectedFolder] = useState<string>(initialFolder);
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMimeType, setSelectedMimeType] = useState<string | undefined>(
    allowedTypes && allowedTypes.length === 1 ? allowedTypes[0] : undefined
  );
  
  // Filter mime types based on allowedTypes
  const getMimeTypeFilter = () => {
    if (!selectedMimeType) return undefined;
    return selectedMimeType;
  };
  
  const { 
    assets, 
    isLoading, 
    error, 
    totalCount, 
    hasMore, 
    isUploading, 
    loadMore, 
    refresh, 
    uploadAsset, 
    deleteAsset, 
    updateAsset 
  } = useDigitalAssets({
    folder: selectedFolder,
    mimeType: getMimeTypeFilter(),
    limit: 24
  });
  
  // Filter assets based on search query
  const filteredAssets = assets.filter(asset => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (asset.title?.toLowerCase().includes(query)) ||
      (asset.description?.toLowerCase().includes(query)) ||
      (asset.originalFilename.toLowerCase().includes(query)) ||
      (asset.tags?.some(tag => tag.toLowerCase().includes(query)))
    );
  });
  
  const handleSelectAsset = (asset: DigitalAsset) => {
    setSelectedAsset(asset);
    if (onSelect) {
      onSelect(asset);
    }
  };
  
  const handleUpload = async (file: File, metadata: Record<string, any> = {}) => {
    const result = await uploadAsset(file, selectedFolder, metadata);
    if (result.success && result.asset) {
      setSelectedAsset(result.asset);
      if (showUploadTab) {
        setActiveTab('browse');
      }
      return result.asset;
    }
    return null;
  };
  
  const handleDelete = async () => {
    if (!selectedAsset) return;
    
    const success = await deleteAsset(selectedAsset.id);
    if (success) {
      setSelectedAsset(null);
    }
  };
  
  const handleUpdate = async (updates: Partial<DigitalAsset>) => {
    if (!selectedAsset) return false;
    return await updateAsset(selectedAsset.id, updates);
  };
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full flex flex-col flex-1"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {showUploadTab && (
              <TabsTrigger value="upload" className="flex items-center gap-1">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
            )}
            <TabsTrigger value="browse" className="flex items-center gap-1">
              <FolderOpen className="h-4 w-4" />
              Browse Assets
            </TabsTrigger>
            {selectedAsset && (
              <TabsTrigger value="details" className="flex items-center gap-1">
                <FileImage className="h-4 w-4" />
                Details
              </TabsTrigger>
            )}
          </TabsList>
          
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refresh}
              disabled={isLoading}
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
        
        {showUploadTab && (
          <TabsContent value="upload" className="flex-1">
            <AssetUploader 
              onUpload={handleUpload} 
              isUploading={isUploading}
              folder={selectedFolder}
              allowedTypes={allowedTypes}
              maxFileSize={maxFileSize}
            />
          </TabsContent>
        )}
        
        <TabsContent value="browse" className="flex-1 flex flex-col">
          <AssetFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFolder={selectedFolder}
            onFolderChange={setSelectedFolder}
            selectedMimeType={selectedMimeType}
            onMimeTypeChange={setSelectedMimeType}
            allowedTypes={allowedTypes}
          />
          
          <div className="mt-4 flex-1">
            <AssetGrid 
              assets={filteredAssets}
              isLoading={isLoading}
              error={error}
              selectedAsset={selectedAsset}
              onSelectAsset={handleSelectAsset}
              hasMore={hasMore}
              loadMore={loadMore}
            />
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            {totalCount} assets found
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="flex-1">
          {selectedAsset && (
            <AssetDetails 
              asset={selectedAsset}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetManager;
