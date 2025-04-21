import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface MediaUploaderProps {
  onUploadComplete?: (url: string, metadata?: Record<string, any>) => void;
  title?: string;
  maxSizeMB?: number;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadComplete,
  title = 'Upload Media',
  maxSizeMB = 5
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    tags: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File size should not exceed ${maxSizeMB}MB`);
        return;
      }
      
      // Set file name as default title
      const fileName = selectedFile.name.split('.')[0];
      setMetadata(prev => ({
        ...prev,
        title: fileName
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      setFile(selectedFile);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would upload to your backend/storage here
      // For demo, we'll just use the file data URL as the "uploaded" URL
      
      if (onUploadComplete) {
        onUploadComplete(preview || '', {
          title: metadata.title || file.name,
          description: metadata.description,
          tags: metadata.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          originalFilename: file.name,
          mimeType: file.type,
          fileSize: file.size
        });
      }
      
      // Reset form
      setFile(null);
      setPreview(null);
      setMetadata({
        title: '',
        description: '',
        tags: ''
      });
      
      toast.success('Your file has been uploaded');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('There was a problem uploading your file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check if it's an image
      if (!droppedFile.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      // Validate file size
      if (droppedFile.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File size should not exceed ${maxSizeMB}MB`);
        return;
      }
      
      // Set file name as default title
      const fileName = droppedFile.name.split('.')[0];
      setMetadata(prev => ({
        ...prev,
        title: fileName
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(droppedFile);
      
      setFile(droppedFile);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Upload and add metadata to your media</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!file ? (
          <div 
            className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => document.getElementById('file-upload')?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500 text-center mb-1">
              Drag & drop your file here or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Maximum file size: {maxSizeMB}MB
            </p>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <ImageIcon className="h-16 w-16 text-gray-300" />
                )}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  name="title"
                  value={metadata.title}
                  onChange={handleInputChange}
                  placeholder="Enter a title for this file"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  value={metadata.description}
                  onChange={handleInputChange}
                  placeholder="Add a description (optional)"
                  rows={3}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="tags">Tags</Label>
                <Input 
                  id="tags"
                  name="tags"
                  value={metadata.tags}
                  onChange={handleInputChange}
                  placeholder="Add tags separated by commas (e.g. logo, banner, product)"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleUpload}
          disabled={!file || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MediaUploader;
