
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { ElementUploadMetadata, ElementCategory } from '@/lib/types/cardElements';

interface ElementUploadFormProps {
  onSubmit: (data: FormData, metadata: ElementUploadMetadata) => Promise<void>;
  onCancel: () => void;
  initialCategory?: ElementCategory;
  className?: string;
}

const ElementUploadForm: React.FC<ElementUploadFormProps> = ({
  onSubmit,
  onCancel,
  initialCategory = ElementCategory.STICKER,
  className = '',
}) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ElementCategory>(initialCategory);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [premium, setPremium] = useState<boolean>(false);
  const [attribution, setAttribution] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError(null);
  };

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!name) {
      setError('Please enter a name for the element');
      return;
    }
    
    if (!file) {
      setError('Please upload an image file');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Create metadata object
      const metadata: ElementUploadMetadata = {
        category,
        tags,
        description: description || '',
        attribution: attribution || '',
        premium,
      };

      await onSubmit(formData, metadata);
    } catch (err: any) {
      console.error('Error uploading element:', err);
      setError(err.message || 'An error occurred while uploading');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - File upload */}
        <div className="w-full md:w-1/3 space-y-6">
          <div>
            <Label htmlFor="element-category">Element Category</Label>
            <select
              id="element-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ElementCategory)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value={ElementCategory.STICKER}>Sticker</option>
              <option value={ElementCategory.LOGO}>Logo</option>
              <option value={ElementCategory.FRAME}>Frame</option>
              <option value={ElementCategory.BADGE}>Badge</option>
              <option value={ElementCategory.OVERLAY}>Overlay</option>
              <option value={ElementCategory.BACKGROUND}>Background</option>
              <option value={ElementCategory.TEXTURE}>Texture</option>
              <option value={ElementCategory.DECORATION}>Decoration</option>
              <option value={ElementCategory.ICON}>Icon</option>
              <option value={ElementCategory.SHAPE}>Shape</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="element-file">Upload Element File</Label>
            <div 
              className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                id="element-file"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {preview ? (
                <div className="w-full flex flex-col items-center">
                  <img
                    src={preview}
                    alt="Element preview"
                    className="mb-2 max-h-48 object-contain rounded"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPreview(null);
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">Click to upload or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column - Metadata */}
        <div className="w-full md:w-2/3 space-y-6">
          <div>
            <Label htmlFor="element-name">Element Name</Label>
            <Input
              id="element-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter element name"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="element-description">Description</Label>
            <Textarea
              id="element-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description of the element"
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="element-tags">Tags</Label>
            <div className="mt-1 flex items-center">
              <Input
                id="element-tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter tags and press Enter"
                className="flex-grow"
              />
              <Button 
                type="button" 
                onClick={handleAddTag} 
                variant="ghost" 
                className="ml-2"
              >
                <PlusIcon />
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-primary hover:text-primary/80"
                    >
                      <Cross2Icon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="element-attribution">Attribution (Optional)</Label>
            <Input
              id="element-attribution"
              value={attribution}
              onChange={(e) => setAttribution(e.target.value)}
              placeholder="Credit the creator or source"
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="premium"
              checked={premium}
              onCheckedChange={setPremium}
            />
            <Label htmlFor="premium">Premium Element</Label>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="text-destructive text-sm">{error}</div>
      )}
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !file || !name}
        >
          {isSubmitting ? 'Uploading...' : 'Upload Element'}
        </Button>
      </div>
    </form>
  );
};

export default ElementUploadForm;
