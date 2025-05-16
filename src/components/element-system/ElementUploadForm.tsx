
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ElementCategory, ElementType, ElementUploadMetadata } from '@/lib/types/cardElements';
import { mapToElementCategory } from '@/lib/utils/typeAdapters';
import TagInput from '@/components/ui/tag-input';

interface ElementUploadFormProps {
  onSubmit: (elementData: ElementUploadMetadata) => void;
  initialData?: Partial<ElementUploadMetadata>;
}

const ElementUploadForm: React.FC<ElementUploadFormProps> = ({
  onSubmit,
  initialData = {},
}) => {
  // Form state
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [category, setCategory] = useState<string>(initialData.category?.toString() || ElementCategory.STICKERS);
  const [type, setType] = useState<ElementType>(initialData.type || ElementType.Sticker);
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [attribution, setAttribution] = useState(initialData.attribution || '');
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '');
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle tag management
  const handleAddTag = (tag: string): boolean => {
    if (tags.includes(tag)) {
      return false; // Tag already exists
    }
    
    setTags([...tags, tag]);
    return true;
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Element name is required';
    }
    
    if (!imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    
    // Create element data
    const elementData: ElementUploadMetadata = {
      name: name.trim(),
      description: description.trim() || undefined,
      category: mapToElementCategory(category),
      type,
      tags,
      attribution: attribution.trim() || undefined,
      imageUrl,
      mimeType: 'image/png', // Default mime type
      isAnimated: false     // Default is not animated
    };
    
    onSubmit(elementData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Element Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter element name"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter element description"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ElementCategory.STICKERS}>Stickers</SelectItem>
              <SelectItem value={ElementCategory.TEAMS}>Teams</SelectItem>
              <SelectItem value={ElementCategory.BADGES}>Badges</SelectItem>
              <SelectItem value={ElementCategory.FRAMES}>Frames</SelectItem>
              <SelectItem value={ElementCategory.EFFECTS}>Effects</SelectItem>
              <SelectItem value={ElementCategory.BACKGROUNDS}>Backgrounds</SelectItem>
              <SelectItem value={ElementCategory.DECORATIVE}>Decorative</SelectItem>
              <SelectItem value={ElementCategory.LOGO}>Logo</SelectItem>
              <SelectItem value={ElementCategory.OVERLAY}>Overlay</SelectItem>
              <SelectItem value={ElementCategory.TEXTURE}>Texture</SelectItem>
              <SelectItem value={ElementCategory.ICON}>Icon</SelectItem>
              <SelectItem value={ElementCategory.SHAPE}>Shape</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select 
            value={type} 
            onValueChange={(value) => setType(value as ElementType)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ElementType.Sticker}>Sticker</SelectItem>
              <SelectItem value={ElementType.Logo}>Logo</SelectItem>
              <SelectItem value={ElementType.Frame}>Frame</SelectItem>
              <SelectItem value={ElementType.Badge}>Badge</SelectItem>
              <SelectItem value={ElementType.Overlay}>Overlay</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL *</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className={errors.imageUrl ? 'border-red-500' : ''}
        />
        {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <TagInput
          tags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          placeholder="Add tags..."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="attribution">Attribution</Label>
        <Input
          id="attribution"
          value={attribution}
          onChange={(e) => setAttribution(e.target.value)}
          placeholder="Credit the creator (optional)"
        />
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit">Upload Element</Button>
      </div>
    </form>
  );
};

export default ElementUploadForm;
