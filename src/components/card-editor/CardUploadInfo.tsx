
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ImageUploader from '@/components/dam/ImageUploader';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CardUploadInfoProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  player: string;
  setPlayer: (value: string) => void;
  team: string;
  setTeam: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  onFileChange: (file: File) => void;
}

const CardUploadInfo: React.FC<CardUploadInfoProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  player,
  setPlayer,
  team,
  setTeam,
  year,
  setYear,
  tags,
  setTags,
  imageUrl,
  setImageUrl,
  onFileChange
}) => {
  const [tagInput, setTagInput] = React.useState('');
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="card-title">CRD Title</Label>
          <Input
            id="card-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title for your CRD"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="card-description">Description</Label>
          <Textarea
            id="card-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your CRD"
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="card-player">Player</Label>
            <Input
              id="card-player"
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              placeholder="Player name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="card-team">Team</Label>
            <Input
              id="card-team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              placeholder="Team name"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="card-year">Year</Label>
          <Input
            id="card-year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Card year"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="card-tags">Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button 
                  type="button" 
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex items-center">
            <Input
              id="card-tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add a tag and press Enter"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => {
                if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                  setTags([...tags, tagInput.trim()]);
                  setTagInput('');
                }
              }}
              className="ml-2 p-2 bg-litmus-green text-white rounded-md hover:bg-litmus-green-secondary"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label>Card Image</Label>
        {imageUrl ? (
          <div className="relative aspect-[2.5/3.5] max-w-xs mx-auto border rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt="Card preview"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <ImageUploader
            onUploadComplete={setImageUrl}
            title="Upload Card Image"
            maxSizeMB={5}
          />
        )}
        
        <p className="text-sm text-gray-500 mt-2">
          For best results, use a high-quality image with a 2.5:3.5 aspect ratio
        </p>
      </div>
    </div>
  );
};

export default CardUploadInfo;
