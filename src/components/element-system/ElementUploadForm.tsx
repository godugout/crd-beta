
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUploader from '@/components/dam/ImageUploader';
import TagInput from '@/components/ui/tag-input';
import { toast } from 'sonner';
import { ElementCategory, ElementUploadMetadata } from '@/lib/types/cardElements';
import { mapToElementCategory } from '@/lib/utils/typeAdapters';

interface ElementUploadFormProps {
  onSubmit: (elementData: ElementUploadMetadata) => void;
  initialData?: Partial<ElementUploadMetadata>;
  className?: string;
}

const ElementUploadForm: React.FC<ElementUploadFormProps> = ({
  onSubmit,
  initialData = {},
  className = '',
}) => {
  // Form state
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [category, setCategory] = useState<string>(initialData.category?.toString() || ElementCategory.STICKERS);
  const [type, setType] = useState(initialData.type || 'standard');
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialData.imageUrl);
  const [attribution, setAttribution] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    toast.success('Image uploaded successfully');
  };
  
  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      return true;
    }
    return false;
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter an element name');
      return;
    }
    
    if (!imageUrl) {
      toast.error('Please upload an image');
      return;
    }
    
    setIsSubmitting(true);
    
    // Convert string category to enum if possible
    const categoryEnum = mapToElementCategory(category);
    
    try {
      const elementData: ElementUploadMetadata = {
        name: name.trim(),
        description: description.trim() || undefined,
        category: categoryEnum,
        type,
        tags,
        imageUrl,
        thumbnailUrl: imageUrl,
        attribution: attribution.trim() || undefined,
      };
      
      onSubmit(elementData);
      toast.success('Element data submitted successfully');
      
      // Reset form after submission if needed
      // resetForm();
    } catch (error) {
      console.error('Error submitting element:', error);
      toast.error('Failed to submit element data');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const categoryOptions = [
    { value: ElementCategory.STICKERS, label: 'Stickers' },
    { value: ElementCategory.TEAMS, label: 'Team Logos' },
    { value: ElementCategory.BADGES, label: 'Badges' },
    { value: ElementCategory.FRAMES, label: 'Frames' },
    { value: ElementCategory.EFFECTS, label: 'Effects' },
    { value: ElementCategory.BACKGROUNDS, label: 'Backgrounds' },
    { value: ElementCategory.OVERLAY, label: 'Overlays' },
    { value: ElementCategory.TEXTURE, label: 'Textures' },
    { value: ElementCategory.DECORATIVE, label: 'Decorations' },
    { value: ElementCategory.ICON, label: 'Icons' },
    { value: ElementCategory.SHAPE, label: 'Shapes' }
  ];

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Element Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter element name"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this element"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger>
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
          
          <div>
            <Label htmlFor="type">Element Type</Label>
            <Select
              value={type}
              onValueChange={setType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="animated">Animated</SelectItem>
                <SelectItem value="interactive">Interactive</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="attribution">Attribution (Optional)</Label>
            <Input
              id="attribution"
              value={attribution}
              onChange={(e) => setAttribution(e.target.value)}
              placeholder="Credit the creator if applicable"
            />
          </div>
          
          <div>
            <Label>Tags</Label>
            <TagInput 
              tags={tags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              placeholder="Add tags and press Enter"
            />
          </div>
        </div>
        
        <div>
          <Label>Element Image</Label>
          <div className="mt-2 space-y-4">
            {imageUrl ? (
              <div className="relative aspect-square max-w-xs mx-auto border rounded-md overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Element preview"
                  className="w-full h-full object-contain"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setImageUrl(undefined)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <ImageUploader
                onUploadComplete={handleImageUpload}
                title="Upload Element Image"
                maxSizeMB={2}
              />
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !name || !imageUrl}>
          {isSubmitting ? 'Submitting...' : 'Submit Element'}
        </Button>
      </div>
    </form>
  );
};

export default ElementUploadForm;
