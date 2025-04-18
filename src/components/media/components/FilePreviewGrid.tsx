
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilePreviewGridProps {
  files: File[];
  previews: string[];
  onRemoveFile: (index: number) => void;
  disabled?: boolean;
}

export const FilePreviewGrid: React.FC<FilePreviewGridProps> = ({
  files,
  previews,
  onRemoveFile,
  disabled
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file, index) => (
        <div 
          key={`${file.name}-${index}`}
          className="relative border border-gray-200 rounded-lg overflow-hidden"
        >
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-6 h-6 rounded-full z-10"
            onClick={() => onRemoveFile(index)}
            disabled={disabled}
          >
            <X size={12} />
          </Button>
          
          <div className="aspect-square bg-black flex items-center justify-center">
            {index < previews.length && (
              file.type.startsWith('image/') ? (
                <img 
                  src={previews[index]} 
                  alt={`Preview ${index + 1}`} 
                  className="max-h-full max-w-full object-cover w-full h-full"
                />
              ) : file.type.startsWith('video/') ? (
                <video 
                  src={previews[index]} 
                  className="max-h-full max-w-full"
                />
              ) : (
                <div className="text-white">Unsupported file</div>
              )
            )}
          </div>
          
          <div className="p-2 text-xs truncate bg-white">
            {file.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilePreviewGrid;
