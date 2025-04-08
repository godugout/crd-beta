
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadAreaProps {
  onFileSelected: (file: File) => void;
  maxSize?: number; // In MB
  acceptedTypes?: string[];
}

const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  onFileSelected,
  maxSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
  }, [onFileSelected]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedTypes.map(type => `.${type.split('/')[1]}`)
    },
    maxSize: maxSize * 1024 * 1024,
    maxFiles: 1,
    onDropRejected: (fileRejections) => {
      if (fileRejections.length > 0) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === 'file-too-large') {
          toast.error(`File is too large. Max size is ${maxSize}MB`);
        } else if (errors[0]?.code === 'file-invalid-type') {
          toast.error('File type not supported');
        } else {
          toast.error(errors[0]?.message || 'Error uploading file');
        }
      }
    }
  });
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4">Upload a Group Photo</h3>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
          }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 grid place-items-center mb-4">
            <Upload className="h-8 w-8 text-gray-500" />
          </div>
          <p className="text-lg font-semibold mb-2">
            {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse files
          </p>
          <Button type="button" className="px-8">Select Files</Button>
          
          <p className="text-xs text-gray-500 mt-4">
            Supported formats: JPEG, PNG, WebP
          </p>
          <p className="text-xs text-gray-500">
            Max file size: {maxSize}MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadArea;
