
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ElementType, ElementCategory } from '@/lib/types/cardElements';
import { ElementUploader } from '@/lib/elements/ElementUploader';
import { AssetProcessor } from '@/lib/elements/AssetProcessor';
import { elementLibrary } from '@/lib/elements/ElementLibrary';
import { toastUtils } from '@/lib/utils/toast-utils';

interface ElementUploadFormProps {
  onElementCreated?: (elementId: string) => void;
}

const ElementUploadForm: React.FC<ElementUploadFormProps> = ({ 
  onElementCreated 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [elementType, setElementType] = useState<ElementType>('sticker');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ElementCategory>('custom');
  const [tags, setTags] = useState('');

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setName(file.name.split('.')[0]); // Set default name based on filename
    
    // Create a preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toastUtils.error('No file selected', 'Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload the file
      const uploadResult = await ElementUploader.uploadElement(
        selectedFile,
        elementType,
        {
          title: name,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }
      );
      
      if (!uploadResult.success || !uploadResult.url) {
        toastUtils.error('Upload failed', uploadResult.error || 'Unknown error');
        setIsUploading(false);
        return;
      }
      
      // Process the asset
      const processingResult = await AssetProcessor.processAsset(
        uploadResult.url,
        elementType,
        uploadResult.metadata!,
        { generateThumbnail: true, optimize: true }
      );
      
      // Create the element in the library
      const element = elementLibrary.createElement(elementType, {
        name,
        assetUrl: processingResult.processedUrl || uploadResult.url,
        thumbnailUrl: processingResult.thumbnailUrl,
        description,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        category,
        isOfficial: false,
        position: { x: 0, y: 0, z: 0, rotation: 0 },
        size: { 
          width: uploadResult.metadata?.dimensions?.width || 100,
          height: uploadResult.metadata?.dimensions?.height || 100,
          scale: 1,
          aspectRatio: 
            uploadResult.metadata?.dimensions?.width && 
            uploadResult.metadata?.dimensions?.height 
              ? uploadResult.metadata.dimensions.width / uploadResult.metadata.dimensions.height 
              : 1,
          preserveAspectRatio: true
        },
        style: { opacity: 1 },
        metadata: {
          ...uploadResult.metadata,
          ...processingResult.metadata
        }
      });
      
      toastUtils.success('Element created', `Successfully created ${elementType}: ${name}`);
      
      // Clear the form
      setSelectedFile(null);
      setPreviewUrl(null);
      setName('');
      setDescription('');
      setTags('');
      
      // Notify parent component
      if (onElementCreated) {
        onElementCreated(element.id);
      }
    } catch (error) {
      console.error('Error creating element:', error);
      toastUtils.error('Error creating element', 'An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  // Element type options
  const elementTypeOptions: { value: ElementType; label: string }[] = [
    { value: 'sticker', label: 'Sticker' },
    { value: 'logo', label: 'Logo' },
    { value: 'frame', label: 'Frame' },
    { value: 'badge', label: 'Badge' },
    { value: 'overlay', label: 'Overlay' }
  ];

  // Element category options
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-4">
            <Label htmlFor="element-type">Element Type</Label>
            <Select 
              value={elementType} 
              onValueChange={(value) => setElementType(value as ElementType)}
            >
              <SelectTrigger id="element-type">
                <SelectValue placeholder="Select element type" />
              </SelectTrigger>
              <SelectContent>
                {elementTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="file-upload">Upload File</Label>
            <Input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              disabled={isUploading}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Supported formats: PNG, JPEG, SVG, WebP, GIF
            </p>
          </div>

          <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              disabled={isUploading}
              className="mt-1"
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              className="mt-1 h-20"
            />
          </div>
        </div>

        <div>
          <div className="mb-4">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as ElementCategory)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input 
              id="tags" 
              value={tags} 
              onChange={(e) => setTags(e.target.value)}
              disabled={isUploading}
              className="mt-1"
              placeholder="sports, team, logo"
            />
          </div>

          {previewUrl && (
            <div className="mb-4">
              <Label>Preview</Label>
              <div className="mt-1 border rounded-md overflow-hidden h-40 flex items-center justify-center bg-gray-50">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => {
            setSelectedFile(null);
            setPreviewUrl(null);
            setName('');
            setDescription('');
            setTags('');
          }}
        >
          Clear
        </Button>
        <Button type="submit" disabled={isUploading || !selectedFile || !name}>
          {isUploading ? 'Uploading...' : 'Upload Element'}
        </Button>
      </div>
    </form>
  );
};

export default ElementUploadForm;
