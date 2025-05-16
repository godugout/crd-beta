import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch"; // Fixed import
import { ElementType, ElementCategory } from '@/lib/types/cardElements';
import { storageOperations } from '@/lib/supabase/storage';
import { toast } from 'sonner';

interface AssetUploaderProps {
  onUploadComplete: (url: string, assetId: string) => void;
}

const AssetUploader: React.FC<AssetUploaderProps> = ({ onUploadComplete }) => {
  const [metadata, setMetadata] = useState<ElementUploadMetadata>({
    name: '',
    description: '',
    tags: [],
    category: '',
    isOfficial: false,
    isPremium: false,
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedElementType, setSelectedElementType] = useState<ElementType>('sticker');
  
  // In the elementTypes declaration, add 'decoration'
  const elementTypes: Record<ElementType, string[]> = {
    sticker: ['png', 'svg'],
    logo: ['png', 'svg', 'webp'],
    frame: ['png', 'svg'],
    badge: ['png', 'svg', 'webp'],
    overlay: ['png', 'svg'],
    decoration: ['png', 'svg', 'webp'] // Added decoration type
  };
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
  }, []);
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: Object.values(elementTypes).flatMap(extensions => extensions.map(ext => `image/${ext}`)),
    multiple: false
  });
  
  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setMetadata(prev => ({ ...prev, tags }));
  };
  
  const handleElementTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedElementType(e.target.value as ElementType);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }
    
    if (!metadata.name || !metadata.category) {
      toast.error('Please provide a name and category for the asset.');
      return;
    }
    
    setUploading(true);
    
    try {
      // Upload the file - use storageOperations.uploadImage instead of uploadAsset
      const uploadResult = await storageOperations.uploadImage(
        selectedFile,
        `assets/${selectedElementType}/${Date.now()}-${selectedFile.name}`
      );
      
      if (!uploadResult.data) {
        toast.error('Upload failed: Could not upload file');
        setIsUploading(false);
        return;
      }
      
      // Create asset ID
      const assetId = `asset-${Date.now()}`;
      
      // Return the public URL and asset ID
      onUploadComplete(uploadResult.data.url, assetId);
      
      // Reset state
      setMetadata({
        name: '',
        description: '',
        tags: [],
        category: '',
        isOfficial: false,
        isPremium: false,
      });
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div {...getRootProps()} className="relative border-2 border-dashed rounded-md p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100">
        <input {...getInputProps()} />
        {
          isDragActive ? (
            <p className="text-gray-600">Drop the files here ...</p>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-6 w-6 text-gray-500" />
              <p className="text-gray-600">
                Drag 'n' drop some files here, or click to select files
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: {Object.values(elementTypes).flat().join(', ')}
              </p>
            </div>
          )
        }
        {selectedFile && (
          <div className="absolute top-2 right-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Remove file
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      
      {selectedFile && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asset-name">Asset Name</Label>
              <Input
                type="text"
                id="asset-name"
                name="name"
                value={metadata.name}
                onChange={handleMetadataChange}
                placeholder="Asset Name"
              />
            </div>
            
            <div>
              <Label htmlFor="asset-category">Category</Label>
              <Input
                type="text"
                id="asset-category"
                name="category"
                value={metadata.category}
                onChange={handleMetadataChange}
                placeholder="Category"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="asset-description">Description</Label>
            <Input
              type="text"
              id="asset-description"
              name="description"
              value={metadata.description}
              onChange={handleMetadataChange}
              placeholder="Description"
            />
          </div>
          
          <div>
            <Label htmlFor="asset-tags">Tags (comma separated)</Label>
            <Input
              type="text"
              id="asset-tags"
              name="tags"
              value={metadata.tags.join(', ')}
              onChange={handleTagChange}
              placeholder="Tags (comma separated)"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="element-type">Element Type</Label>
              <select
                id="element-type"
                className="w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={selectedElementType}
                onChange={handleElementTypeChange}
              >
                {Object.keys(elementTypes).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="is-official">Official Asset</Label>
              <Switch
                id="is-official"
                checked={metadata.isOfficial}
                onCheckedChange={(checked) => setMetadata(prev => ({ ...prev, isOfficial: checked }))}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="is-premium">Premium Asset</Label>
              <Switch
                id="is-premium"
                checked={metadata.isPremium}
                onCheckedChange={(checked) => setMetadata(prev => ({ ...prev, isPremium: checked }))}
              />
            </div>
          </div>
          
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Upload Asset
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssetUploader;
