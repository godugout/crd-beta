
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Upload, X, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface AssetUploaderProps {
  onUpload: (file: File, metadata: Record<string, any>) => Promise<any>;
  isUploading: boolean;
  folder?: string;
  allowedTypes?: string[];
  maxFileSize?: number;
  className?: string;
}

const AssetUploader: React.FC<AssetUploaderProps> = ({
  onUpload,
  isUploading,
  folder = 'uploads',
  allowedTypes,
  maxFileSize = 10, // MB
  className = '',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return { valid: false, error: `File size cannot exceed ${maxFileSize}MB` };
    }
    
    // Check file type if allowed types are specified
    if (allowedTypes && allowedTypes.length > 0) {
      const fileType = file.type;
      const isAllowed = allowedTypes.some(type => 
        type.endsWith('*') 
          ? fileType.startsWith(type.replace('*', '')) 
          : fileType === type
      );
      
      if (!isAllowed) {
        return { valid: false, error: `File type not allowed. Accepted: ${allowedTypes.join(', ')}` };
      }
    }
    
    return { valid: true };
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validation = validateFile(selectedFile);
      
      if (validation.valid) {
        setFile(selectedFile);
        setTitle(selectedFile.name.split('.')[0]);
        
        // Create preview for images
        if (selectedFile.type.startsWith('image/')) {
          const objectUrl = URL.createObjectURL(selectedFile);
          setPreviewUrl(objectUrl);
        } else {
          setPreviewUrl(null);
        }
      } else {
        toast.error(validation.error);
      }
    }
  };
  
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validation = validateFile(droppedFile);
      
      if (validation.valid) {
        setFile(droppedFile);
        setTitle(droppedFile.name.split('.')[0]);
        
        // Create preview for images
        if (droppedFile.type.startsWith('image/')) {
          const objectUrl = URL.createObjectURL(droppedFile);
          setPreviewUrl(objectUrl);
        } else {
          setPreviewUrl(null);
        }
      } else {
        toast.error(validation.error);
      }
    }
  }, [validateFile]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    try {
      const metadata = {
        title: title || file.name,
        description,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        folder
      };
      
      await onUpload(file, metadata);
      
      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setTitle('');
      setDescription('');
      setTags('');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Upload error:', error);
    }
  };
  
  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  return (
    <div className={`max-w-xl mx-auto ${className}`}>
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Upload Asset</h3>
              <p className="text-sm text-gray-500">
                Upload files to your digital asset library
              </p>
            </div>
            
            {/* File Drop Area */}
            <div 
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!file ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-1">
                    Drag and drop your file here
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    or click to browse your files
                  </p>
                  <Button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                  
                  {allowedTypes && (
                    <p className="text-xs text-gray-500 mt-4">
                      Accepted file types: {allowedTypes.join(', ')}
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Max file size: {maxFileSize}MB
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {previewUrl ? (
                    <div className="relative w-full max-w-xs mx-auto">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-[200px] mx-auto object-contain" 
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0"
                        onClick={clearFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      ) : (
                        <div className="p-2 bg-gray-100 rounded">
                          <div className="text-xs font-bold uppercase">
                            {file.name.split('.').pop()}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={clearFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={allowedTypes?.join(',')}
              />
            </div>
            
            {/* Metadata Fields */}
            {file && (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Asset title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Asset description"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Enter tags separated by commas"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate tags with commas (e.g. logo, branding, event)
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Asset
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AssetUploader;
