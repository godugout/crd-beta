import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUploadHandling } from './hooks/useUploadHandling';
import { GroupUploadType } from '@/lib/types';

interface GroupImageUploaderProps {
  onComplete?: (uploadedFiles: File[]) => void;
  title?: string;
  description?: string;
  uploadType?: GroupUploadType;
}

const GroupImageUploader: React.FC<GroupImageUploaderProps> = ({
  onComplete,
  title = 'Upload Images',
  description = 'Drag and drop images here or click to browse',
  uploadType = 'group'
}) => {
  const [files, setFiles] = useState<File[]>([]);
  
  // Fix the useUploadHandling hook usage
  const uploadHandler = useUploadHandling({
    uploadType,
  });

  // Fix the handleFileSelected function type and implementation
  const handleFileSelected = async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    
    // Process each file
    try {
      // Call your processing logic
      // ...
      
      // When complete, call the onComplete callback with the files
      if (onComplete) {
        onComplete(acceptedFiles);
      }
    } catch (error) {
      console.error('Error processing files:', error);
    }
  };

  // Fix the handleSingleFileSelect function type and implementation
  const handleSingleFileSelect = async (file: File) => {
    if (!file) return;
    // Wrap single file in an array when calling handleFileSelected
    await handleFileSelected([file]);
  };

  // Fix the button click handler to properly handle files
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Create a file input and trigger it
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // Convert FileList to File[] and pass to handler
        const fileArray = Array.from(files);
        handleFileSelected(fileArray);
      }
    };
    input.click();
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">{title}</span>
          </p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <Button onClick={handleButtonClick} className="mt-4">Select Files</Button>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Selected Files ({files.length})</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center">
                <span className="w-4 h-4 mr-2 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GroupImageUploader;
