
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilePreviewGridProps {
  files: File[];
  previews: string[];
  onRemoveFile: (index: number) => void;
  disabled: boolean;
}

const FilePreviewGrid: React.FC<FilePreviewGridProps> = ({
  files,
  previews,
  onRemoveFile,
  disabled
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {files.map((file, idx) => (
        <div key={idx} className="border relative rounded overflow-hidden">
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-6 h-6 rounded-full z-10"
            onClick={() => onRemoveFile(idx)}
            disabled={disabled}
          >
            <X size={14}/>
          </Button>
          {idx < previews.length && (
            <div className="aspect-square bg-black flex items-center justify-center">
              {file.type.startsWith('image/') ? (
                <img src={previews[idx]} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`}/>
              ) : file.type.startsWith('video/') ? (
                <video src={previews[idx]} className="w-full h-full object-cover"/>
              ) : (
                <div className="text-white">Unsupported</div>
              )}
            </div>
          )}
          <div className="p-2 text-xs truncate">
            {file.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilePreviewGrid;
