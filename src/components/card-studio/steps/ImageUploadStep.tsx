
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload } from 'lucide-react';
import { toastUtils } from '@/lib/utils/toast-utils';

interface ImageUploadStepProps {
  imageUrl: string;
  onImageSelect: (url: string) => void;
}

const ImageUploadStep: React.FC<ImageUploadStepProps> = ({ imageUrl, onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(imageUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple validation
    if (!file.type.startsWith('image/')) {
      toastUtils.error("Invalid file", "Please select an image file");
      return;
    }

    setIsUploading(true);

    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onImageSelect(result);
      setIsUploading(false);
    };

    reader.onerror = () => {
      toastUtils.error("Error", "Failed to read the file");
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Upload Your Card Image</h2>
        <p className="text-gray-500 mt-2">
          Choose a high-quality image to use as the base for your card
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            disabled={isUploading}
          />

          <Card className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center cursor-pointer" onClick={openFileDialog}>
              {previewUrl ? (
                <div className="w-full aspect-[2.5/3.5] relative">
                  <img
                    src={previewUrl}
                    alt="Card preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white">Change Image</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="font-medium mb-1">Upload an image</h3>
                  <p className="text-sm text-gray-500">
                    Drag & drop or click to browse
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <div className="mt-4">
            <p className="text-xs text-gray-500">
              Recommended dimensions: 1050px × 1500px (2.5:3.5 ratio)
              <br />
              Max file size: 10MB
              <br />
              Supported formats: JPG, PNG, WebP
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Image Options</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-url">Or enter an image URL</Label>
              <Input
                id="image-url"
                type="text"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => onImageSelect(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                // This would activate the device camera in a real implementation
                toastUtils.info("Camera feature", "Camera capture would open here");
              }}
            >
              <Camera className="h-4 w-4 mr-2" />
              Use Camera
            </Button>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toastUtils.info("AI feature", "AI image generation would open here");
              }}
            >
              Generate Image with AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadStep;
