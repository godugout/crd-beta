
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ElementType, ElementCategory } from '@/lib/types/cardElements';
import { useUGCSystem } from '@/hooks/useUGCSystem';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AssetUploaderProps {
  onUploadComplete?: (assetId: string) => void;
  defaultType?: ElementType;
  defaultCategory?: ElementCategory;
  className?: string;
}

const AssetUploader: React.FC<AssetUploaderProps> = ({
  onUploadComplete,
  defaultType = 'sticker',
  defaultCategory = 'custom',
  className
}) => {
  const { uploadAsset, uploadProgress } = useUGCSystem();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [assetType, setAssetType] = useState<ElementType>(defaultType);
  const [category, setCategory] = useState<ElementCategory>(defaultCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isForSale, setIsForSale] = useState(false);
  const [price, setPrice] = useState(0);
  const [currentTab, setCurrentTab] = useState('basic');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // File selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Basic validation
      if (!selectedFile.type.startsWith('image/')) {
        setValidationErrors({
          ...validationErrors,
          file: 'Please select a valid image file'
        });
        return;
      }
      
      setFile(selectedFile);
      setValidationErrors({
        ...validationErrors,
        file: undefined
      });
      
      // Generate title from filename if empty
      if (!title) {
        setTitle(selectedFile.name.split('.')[0].replace(/[-_]/g, ' '));
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  // Tag management
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle dropping files
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (!droppedFile.type.startsWith('image/')) {
        setValidationErrors({
          ...validationErrors,
          file: 'Please select a valid image file'
        });
        return;
      }
      
      setFile(droppedFile);
      setValidationErrors({
        ...validationErrors,
        file: undefined
      });
      
      // Generate title from filename if empty
      if (!title) {
        setTitle(droppedFile.name.split('.')[0].replace(/[-_]/g, ' '));
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  // Validation check
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!file) {
      errors.file = 'Please select a file to upload';
    }
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (isForSale && price <= 0) {
      errors.price = 'Please enter a valid price';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle upload
  const handleUpload = async () => {
    if (!validate()) {
      return;
    }
    
    if (!file) return;
    
    try {
      const result = await uploadAsset.mutateAsync({
        file,
        metadata: {
          title,
          description,
          assetType,
          category,
          tags,
          isPublic,
          forSale: isForSale,
          price: isForSale ? price : undefined
        }
      });
      
      if (result && onUploadComplete) {
        onUploadComplete(result.id);
      }
      
      // Reset form
      setFile(null);
      setPreview(null);
      setTitle('');
      setDescription('');
      setTags([]);
      setTagInput('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Upload error:', error);
    }
  };
  
  // Define asset type options
  const assetTypeOptions: { value: ElementType; label: string; description: string }[] = [
    { value: 'sticker', label: 'Sticker', description: 'Decorative elements that can be placed anywhere on a card' },
    { value: 'logo', label: 'Logo', description: 'Brand or team logos, usually vector-based for quality' },
    { value: 'frame', label: 'Frame', description: 'Decorative borders that go around the edge of cards' },
    { value: 'badge', label: 'Badge', description: 'Achievement or status indicators for cards' },
    { value: 'overlay', label: 'Overlay', description: 'Effects or filters that affect the entire card' }
  ];
  
  // Define category options
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Upload New Asset</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="marketplace" disabled={!file}>Marketplace</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="asset-type">Asset Type</Label>
              <Select value={assetType} onValueChange={(value) => setAssetType(value as ElementType)}>
                <SelectTrigger id="asset-type">
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {assetTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {assetTypeOptions.find(opt => opt.value === assetType)?.description}
              </p>
            </div>
            
            <div>
              {!file ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium mb-1">Upload a file</p>
                  <p className="text-xs text-muted-foreground mb-2">Drag and drop or click to browse</p>
                  {assetType === 'sticker' && <p className="text-xs">PNG, SVG, GIF or WebP (max 5MB)</p>}
                  {assetType === 'logo' && <p className="text-xs">PNG, SVG or WebP (max 5MB)</p>}
                  {assetType === 'frame' && <p className="text-xs">PNG with transparency or SVG (max 10MB)</p>}
                  {assetType === 'badge' && <p className="text-xs">PNG, SVG (max 5MB)</p>}
                  {assetType === 'overlay' && <p className="text-xs">PNG, WebP, SVG with transparency (max 10MB)</p>}
                  
                  {validationErrors.file && (
                    <div className="flex items-center gap-1 text-destructive text-xs mt-2">
                      <AlertCircle size={12} />
                      <span>{validationErrors.file}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <img 
                      src={preview || ''} 
                      alt="Preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="p-2 flex justify-between items-center">
                    <span className="text-sm truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            <div>
              <Label htmlFor="title" className={validationErrors.title ? 'text-destructive' : ''}>
                Title {validationErrors.title && <span className="text-xs">({validationErrors.title})</span>}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) {
                    setValidationErrors({
                      ...validationErrors,
                      title: undefined
                    });
                  }
                }}
                className={validationErrors.title ? 'border-destructive' : ''}
              />
            </div>
            
            <Button 
              onClick={() => setCurrentTab('details')} 
              disabled={!file || !title.trim()}
              className="w-full"
            >
              Next
            </Button>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your asset..."
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as ElementCategory)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tags..."
                />
                <Button type="button" onClick={addTag} disabled={!tagInput.trim()}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X size={14} className="cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is-public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="is-public">Make this asset public</Label>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab('basic')}>
                Back
              </Button>
              <Button onClick={() => setCurrentTab('marketplace')}>
                Next
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="marketplace" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="for-sale"
                checked={isForSale}
                onCheckedChange={setIsForSale}
              />
              <Label htmlFor="for-sale">Sell this asset in marketplace</Label>
            </div>
            
            {isForSale && (
              <div>
                <Label htmlFor="price" className={validationErrors.price ? 'text-destructive' : ''}>
                  Price (Credits) {validationErrors.price && <span className="text-xs">({validationErrors.price})</span>}
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  step="1"
                  value={price}
                  onChange={(e) => {
                    setPrice(Number(e.target.value));
                    if (Number(e.target.value) > 0) {
                      setValidationErrors({
                        ...validationErrors,
                        price: undefined
                      });
                    }
                  }}
                  className={validationErrors.price ? 'border-destructive' : ''}
                />
              </div>
            )}
            
            <div className="bg-muted rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Marketplace Terms</h3>
              <p className="text-xs text-muted-foreground">
                By uploading content to the marketplace, you confirm that:
              </p>
              <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
                <li>You own or have rights to this asset</li>
                <li>The asset does not infringe on others' rights</li>
                <li>You agree to our content guidelines and terms of service</li>
                <li>You grant us a license to distribute your asset</li>
              </ul>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab('details')}>
                Back
              </Button>
              <Button onClick={handleUpload} disabled={uploadAsset.isPending}>
                {uploadAsset.isPending ? 'Uploading...' : 'Upload Asset'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {uploadAsset.isPending && uploadProgress > 0 && (
          <div className="mt-4 space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Processing...'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetUploader;
