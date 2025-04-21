
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { uploadCardImage, CardMetadata } from '@/lib/upload/cardUpload';
import { toast } from 'sonner';

interface CardImageUploaderProps {
  onUploadComplete?: (imageUrl: string, assetId: string) => void;
}

const CardImageUploader: React.FC<CardImageUploaderProps> = ({ 
  onUploadComplete 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<CardMetadata>({
    title: '',
    description: '',
    player: '',
    team: '',
    year: '',
    tags: []
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an image');
      return;
    }

    const result = await uploadCardImage(file, metadata);
    
    if (result) {
      toast.success('Card uploaded successfully');
      onUploadComplete?.(result.imageUrl, result.assetId);
      // Reset form
      setFile(null);
      setPreview(null);
      setMetadata({
        title: '',
        description: '',
        player: '',
        team: '',
        year: '',
        tags: []
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Label>Upload Card Image</Label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {preview ? (
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-64 mx-auto rounded-lg"
                />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              </div>
            )}
          </div>
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <Label>Title</Label>
            <Input 
              value={metadata.title}
              onChange={(e) => setMetadata({...metadata, title: e.target.value})}
              placeholder="Card title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea 
              value={metadata.description}
              onChange={(e) => setMetadata({...metadata, description: e.target.value})}
              placeholder="Card description"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input 
              value={metadata.player || ''}
              onChange={(e) => setMetadata({...metadata, player: e.target.value})}
              placeholder="Player Name"
            />
            <Input 
              value={metadata.team || ''}
              onChange={(e) => setMetadata({...metadata, team: e.target.value})}
              placeholder="Team"
            />
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleUpload} 
        disabled={!file || !metadata.title || !metadata.description}
        className="w-full"
      >
        Upload Card
      </Button>
    </div>
  );
};

export default CardImageUploader;
