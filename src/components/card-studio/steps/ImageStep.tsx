
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const ImageStep: React.FC<ImageStepProps> = ({ cardData, onUpdate }) => {
  const [dragActive, setDragActive] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };
  
  const handleFileChange = (file: File) => {
    // Create URL for the image
    const imageUrl = URL.createObjectURL(file);
    
    // Update card data with the new image
    onUpdate({
      imageUrl,
      // We'd typically generate a thumbnail here, but for simplicity
      // we'll use the same image for the thumbnail
      thumbnailUrl: imageUrl
    });
  };
  
  // Handle URL input for remote images
  const handleUrlSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem('imageUrl') as HTMLInputElement;
    
    if (input.value) {
      onUpdate({
        imageUrl: input.value,
        thumbnailUrl: input.value
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Upload Card Image</h2>
      
      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-64 transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {cardData.imageUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={cardData.imageUrl}
              alt="Card preview"
              className="max-h-full max-w-full object-contain"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => onUpdate({ imageUrl: '', thumbnailUrl: '' })}
            >
              Remove
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Drag and drop your image here or</p>
            </div>
            <Input
              type="file"
              id="image-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
            <Button asChild>
              <label htmlFor="image-upload" className="cursor-pointer">
                Select File
              </label>
            </Button>
          </>
        )}
      </div>
      
      {/* URL input */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Or enter image URL</Label>
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <Input
            type="url"
            id="imageUrl"
            name="imageUrl"
            placeholder="https://example.com/image.jpg"
            className="flex-1"
          />
          <Button type="submit">Use URL</Button>
        </form>
      </div>
    </div>
  );
};

export default ImageStep;
