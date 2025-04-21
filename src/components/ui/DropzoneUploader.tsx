
import React from 'react';

interface DropzoneUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  showPreview?: boolean;
  onUploaded: (cardIds: string[]) => void;
}

const DropzoneUploader: React.FC<DropzoneUploaderProps> = ({
  onFilesSelected,
  accept = { 'image/*': ['.jpeg', '.jpg', '.png'] },
  maxFiles = 5,
  showPreview = true,
  onUploaded
}) => {
  // Fake implementation for compatibility
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
      
      // Mock successful upload - in real implementation we'd upload files to server
      setTimeout(() => {
        onUploaded(['mock-card-1', 'mock-card-2']);
      }, 1000);
    }
  };
  
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <p className="mb-4 text-gray-600">Drag and drop files here or click to browse</p>
      <input 
        type="file" 
        multiple 
        accept={Object.entries(accept).map(([key, values]) => values.join(',')).join(',')}
        onChange={handleFileChange}
        className="hidden" 
        id="file-upload" 
      />
      <label 
        htmlFor="file-upload"
        className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
      >
        Select Files
      </label>
      
      {showPreview && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
            Preview
          </div>
        </div>
      )}
    </div>
  );
};

export default DropzoneUploader;
