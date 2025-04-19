
import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface DropzoneAreaProps {
  onImageUpload: (file: File) => Promise<void> | void;
}

const DropzoneArea: React.FC<DropzoneAreaProps> = ({ onImageUpload }) => {
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div 
      className="w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input 
        id="file-input"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <Upload className="h-10 w-10 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">Drag & drop an image or click to browse</p>
    </div>
  );
};

export default DropzoneArea;
