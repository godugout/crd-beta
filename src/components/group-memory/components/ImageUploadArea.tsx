
import React from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, Plus } from 'lucide-react';

interface ImageUploadAreaProps {
  onFileSelected: (file: File) => Promise<void>;
}

const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({ onFileSelected }) => {
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await onFileSelected(files[0]);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4">Upload Images</h3>
      
      <div className="grid place-items-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileInputChange}
        />
        <div className="space-y-2">
          <div className="bg-gray-100 rounded-full p-4 mx-auto w-16 h-16 grid place-items-center">
            <UploadCloud className="h-8 w-8 text-gray-500" />
          </div>
          <div>
            <p className="text-lg font-semibold">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500 mt-1">
              Upload photos to detect faces and memorabilia
            </p>
          </div>
          <Button type="button">
            <Plus className="mr-1 h-4 w-4" />
            Select Image
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadArea;
