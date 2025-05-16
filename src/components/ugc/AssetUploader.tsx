
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ElementType, ElementCategory } from '@/lib/types/cardElements';
import { useUGCSystem } from '@/hooks/useUGCSystem';
import { cn } from '@/lib/utils';
import { X, Upload, Image, ChevronDown, ChevronUp, Tag, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';

interface AssetUploaderProps {
  onUploadComplete?: (assetId: string) => void;
  className?: string;
}

const AssetUploader: React.FC<AssetUploaderProps> = ({ onUploadComplete, className }) => {
  // State for form values
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assetType, setAssetType] = useState<ElementType>('sticker');
  const [category, setCategory] = useState<ElementCategory>('sports');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [forSale, setForSale] = useState(false);
  const [price, setPrice] = useState(5);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // File handling
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Advanced options
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  // Use the UGC hook for upload functionality
  const { uploadAsset, uploadProgress } = useUGCSystem();
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any file-related errors
      const newErrors = { ...errors };
      delete newErrors.file;
      setErrors(newErrors);
    }
  };
  
  // Handle tag addition
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  // Handle tag input keypress
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!selectedFile) newErrors.file = 'Please select a file to upload';
    
    // Asset type validation
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      
      // Check file formats based on asset type
      const allowedFormats: Record<ElementType, string[]> = {
        'sticker': ['png', 'gif', 'webp', 'svg'],
        'logo': ['png', 'svg', 'webp'],
        'frame': ['png', 'svg'],
        'badge': ['png', 'svg'],
        'overlay': ['png', 'webp', 'svg']
      };
      
      if (!allowedFormats[assetType].includes(fileExt)) {
        newErrors.file = `Invalid file format for ${assetType}. Allowed formats: ${allowedFormats[assetType].join(', ')}`;
      }
      
      // Check file size (5MB limit for most, 10MB for frames and overlays)
      const maxSize = (assetType === 'frame' || assetType === 'overlay') ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        newErrors.file = `File size exceeds the maximum allowed (${maxSize / (1024 * 1024)}MB)`;
      }
    }
    
    // Check if there are validation errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit the form
    if (selectedFile) {
      try {
        const result = await uploadAsset.mutateAsync({
          file: selectedFile,
          metadata: {
            title,
            description,
            assetType,
            category,
            tags,
            isPublic,
            forSale,
            price: forSale ? price : undefined
          }
        });
        
        if (result && onUploadComplete) {
          onUploadComplete(result.id);
        }
        
        // Reset form
        setTitle('');
        setDescription('');
        setAssetType('sticker');
        setCategory('sports');
        setTags([]);
        setSelectedFile(null);
        setPreview(null);
        setIsPublic(true);
        setForSale(false);
        setPrice(5);
        setErrors({});
      } catch (error) {
        console.error('Upload error:', error);
        setErrors({ submit: 'Failed to upload asset. Please try again.' });
      }
    }
  };
  
  return (
    <div className={cn("space-y-6", className)}>
      {uploadProgress > 0 && uploadProgress < 100 ? (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground">
            Uploading... {Math.round(uploadProgress)}%
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="asset-file">Asset File</Label>
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
                preview ? "border-primary/20 bg-primary/5" : "border-gray-300 hover:border-primary/40 hover:bg-primary/5",
                errors.file && "border-destructive/50 bg-destructive/5"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="relative w-full aspect-square flex items-center justify-center">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2 opacity-80 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    SVG, PNG, GIF up to {assetType === 'frame' || assetType === 'overlay' ? '10MB' : '5MB'}
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="asset-file"
                type="file"
                accept=".png,.svg,.gif,.webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {errors.file && (
              <p className="text-sm text-destructive">{errors.file}</p>
            )}
          </div>
          
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your asset a name"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your asset..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asset-type">Asset Type</Label>
                <Select 
                  value={assetType} 
                  onValueChange={(value) => setAssetType(value as ElementType)}
                >
                  <SelectTrigger id="asset-type">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sticker">Sticker</SelectItem>
                    <SelectItem value="logo">Logo</SelectItem>
                    <SelectItem value="frame">Frame</SelectItem>
                    <SelectItem value="badge">Badge</SelectItem>
                    <SelectItem value="overlay">Overlay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={(value) => setCategory(value as ElementCategory)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="decorative">Decorative</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyPress}
                  placeholder="Add tags (press Enter)"
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag}
                  variant="outline"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Advanced Options */}
          <Collapsible
            open={isAdvancedOpen}
            onOpenChange={setIsAdvancedOpen}
            className="border rounded-md p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Advanced Options</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isAdvancedOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="is-public">Make Public</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Public assets are visible to everyone in the marketplace</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch 
                  id="is-public" 
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="for-sale">Sell this asset</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Set a price in credits for others to purchase your asset</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch 
                  id="for-sale" 
                  checked={forSale}
                  onCheckedChange={setForSale}
                />
              </div>
              
              {forSale && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price (credits)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 1)}
                  />
                </div>
              )}
              
              <div className="pt-2 text-xs text-muted-foreground">
                <p>
                  Your asset will be reviewed before appearing in the marketplace. 
                  This helps ensure quality and appropriate content.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Error Message */}
          {errors.submit && (
            <div className="bg-destructive/10 p-3 rounded-md text-sm text-destructive">
              {errors.submit}
            </div>
          )}
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={uploadAsset.isPending}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Asset
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AssetUploader;
