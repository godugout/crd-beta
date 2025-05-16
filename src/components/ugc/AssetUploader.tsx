
import React, { useState, useCallback } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ElementType, ElementCategory, ElementUploadMetadata } from '@/lib/types/cardElements';
import { storageOperations } from '@/lib/supabase/storage';
import { X, Upload, FileUp, Info } from 'lucide-react';

interface AssetUploaderProps {
  onUploadComplete?: (asset: ElementUploadMetadata) => void;
  allowedTypes?: ElementType[];
  maxSizeMB?: number;
  showPreview?: boolean;
}

const AssetUploader: React.FC<AssetUploaderProps> = ({
  onUploadComplete,
  allowedTypes = ['sticker', 'logo', 'frame', 'badge', 'overlay', 'decoration'],
  maxSizeMB = 5,
  showPreview = true,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Partial<ElementUploadMetadata>>({
    name: '',
    description: '',
    tags: [],
    category: ElementCategory.OTHER,
    isOfficial: false
  });
  const [currentTag, setCurrentTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Define accepted file types based on allowedTypes
  const acceptedTypes: Accept = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/svg+xml': ['.svg'],
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const selectedFile = acceptedFiles[0];
    
    // Check file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: 'destructive',
        open: true
      });
      return;
    }
    
    setFile(selectedFile);
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      // Auto-populate name from filename
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      setMetadata(prev => ({ ...prev, name: fileName }));
    };
    reader.readAsDataURL(selectedFile);
  }, [maxSizeMB, toast]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: acceptedTypes });

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      
      // Use storageOperations to upload the image
      const result = await storageOperations.uploadImage(file, `user-assets/${file.name}`);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Call onUploadComplete with the metadata and upload info
      if (onUploadComplete && result.data) {
        onUploadComplete({
          name: metadata.name || 'Untitled Asset',
          description: metadata.description || '',
          tags: metadata.tags || [],
          category: metadata.category || ElementCategory.OTHER,
          isOfficial: false,
          dimensions: {
            width: 0, // These would be determined after image processing
            height: 0
          }
        });
      }
      
      toast({
        title: 'Upload Successful',
        description: 'Your asset has been uploaded',
        variant: 'success',
        open: true
      });
      
      // Reset the form
      setFile(null);
      setPreview(null);
      setMetadata({
        name: '',
        description: '',
        tags: [],
        category: ElementCategory.OTHER,
        isOfficial: false
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: 'There was a problem uploading your asset',
        variant: 'destructive',
        open: true
      });
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    if (!currentTag.trim()) return;
    setMetadata(prev => ({
      ...prev,
      tags: [...(prev.tags || []), currentTag.trim()]
    }));
    setCurrentTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const categoryOptions = [
    { value: ElementCategory.SPORTS, label: 'Sports' },
    { value: ElementCategory.ENTERTAINMENT, label: 'Entertainment' },
    { value: ElementCategory.ACHIEVEMENT, label: 'Achievement' },
    { value: ElementCategory.DECORATIVE, label: 'Decorative' },
    { value: ElementCategory.SEASONAL, label: 'Seasonal' },
    { value: ElementCategory.HOLIDAY, label: 'Holiday' },
    { value: ElementCategory.TEAMS, label: 'Teams' },
    { value: ElementCategory.BRANDS, label: 'Brands' },
    { value: ElementCategory.CUSTOM, label: 'Custom' },
    { value: ElementCategory.OTHER, label: 'Other' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Asset</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!file ? (
          <div 
            {...getRootProps()} 
            className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer"
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">Drag & drop an image, or click to select</p>
              <p className="text-xs text-gray-400">
                Supported formats: PNG, JPG, SVG (Max {maxSizeMB}MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {showPreview && preview && (
              <div className="flex justify-center">
                <div className="relative max-w-xs">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-64 max-w-full object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 rounded-full p-1 h-8 w-8"
                    onClick={() => { setFile(null); setPreview(null); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="asset-name">Asset Name</Label>
                <Input
                  id="asset-name"
                  value={metadata.name || ''}
                  onChange={(e) => setMetadata(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter asset name"
                />
              </div>
              
              <div>
                <Label htmlFor="asset-description">Description</Label>
                <Input
                  id="asset-description"
                  value={metadata.description || ''}
                  onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the asset"
                />
              </div>
              
              <div>
                <Label htmlFor="asset-category">Category</Label>
                <select
                  id="asset-category"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={metadata.category}
                  onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value as ElementCategory }))}
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="asset-tags">Tags</Label>
                <div className="flex">
                  <Input
                    id="asset-tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add tags"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} className="ml-2">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {metadata.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)} 
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <Switch
                  id="premium-asset"
                  checked={metadata.isPremium || false}
                  onCheckedChange={(checked) => setMetadata(prev => ({ ...prev, isPremium: checked }))}
                />
                <Label htmlFor="premium-asset">Premium Asset</Label>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Premium assets may require user payment or subscription</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          onClick={handleUpload}
          disabled={!file || uploading || !metadata.name}
        >
          {uploading ? 'Uploading...' : 'Upload Asset'}
          {!uploading && <FileUp className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssetUploader;
