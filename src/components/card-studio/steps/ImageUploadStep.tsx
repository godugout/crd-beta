
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera, LinkIcon, X } from 'lucide-react';
import { toastUtils } from '@/lib/utils/toast-utils';

interface ImageUploadStepProps {
  imageUrl: string;
  onImageSelect: (url: string) => void;
}

const ImageUploadStep: React.FC<ImageUploadStepProps> = ({ imageUrl, onImageSelect }) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  
  // Method to upload an image file
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastUtils.error(
        "File too large", 
        "Please select an image under 5MB"
      );
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toastUtils.error(
        "Invalid file type", 
        "Please select a valid image file"
      );
      return;
    }
    
    setUploading(true);
    
    // Simulate file upload (would connect to a real service)
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelect(e.target.result.toString());
        toastUtils.success(
          "Image uploaded",
          "Your image has been uploaded successfully"
        );
      }
      setUploading(false);
    };
    
    reader.onerror = () => {
      toastUtils.error(
        "Upload failed",
        "There was a problem uploading your image"
      );
      setUploading(false);
    };
    
    reader.readAsDataURL(file);
  }, [onImageSelect]);
  
  // Add image from URL
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!urlInput.trim()) return;
    
    try {
      new URL(urlInput); // Validate URL
      onImageSelect(urlInput);
    } catch (error) {
      toastUtils.error(
        "Invalid URL",
        "Please enter a valid image URL"
      );
    }
  };
  
  // Clear the selected image
  const handleClearImage = () => {
    onImageSelect('');
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Upload Card Image</h2>
      
      {imageUrl ? (
        <div className="relative aspect-[2.5/3.5] max-w-xs mx-auto border rounded-md overflow-hidden">
          <img
            src={imageUrl}
            alt="Selected card"
            className="w-full h-full object-contain"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleClearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File upload option */}
          <Card className="border-dashed cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-6 flex flex-col items-center">
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="file-upload"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Upload Image</h3>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Drag and drop or click to browse
                </p>
              </label>
            </CardContent>
          </Card>
          
          {/* URL input option */}
          <Card className="border-dashed hover:border-primary transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <LinkIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Image URL</h3>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Paste a direct link to an image
                </p>
                <form onSubmit={handleUrlSubmit} className="w-full mt-4">
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-grow"
                    />
                    <Button type="submit" size="sm">
                      Add
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Image tips */}
      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
        <h3 className="font-semibold mb-2">Tips for best results:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use high resolution images (at least 1000px width)</li>
          <li>Images with clear subject and minimal background work best</li>
          <li>For sports cards, use player photos with good lighting</li>
          <li>Keep the file size under 5MB</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploadStep;
