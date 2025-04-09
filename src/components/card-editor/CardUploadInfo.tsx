
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CardUpload from '@/components/card-upload/CardUpload';
import TagInput from './TagInput';

interface CardUploadInfoProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  player: string;
  setPlayer: (player: string) => void;
  team: string;
  setTeam: (team: string) => void;
  year: string;
  setYear: (year: string) => void;
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
  const handleImageUpload = (file: File, previewUrl: string) => {
    setImageUrl(previewUrl);
    onFileChange(file);
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Upload & Card Info</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <CardUpload 
            initialImageUrl={imageUrl}
            onImageUpload={handleImageUpload}
            className="mb-6"
          />
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Card Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter a title for your card"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="player">Player Name</Label>
            <Input 
              id="player" 
              value={player} 
              onChange={(e) => setPlayer(e.target.value)} 
              placeholder="Player name (if applicable)"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team">Team</Label>
              <Input 
                id="team" 
                value={team} 
                onChange={(e) => setTeam(e.target.value)} 
                placeholder="Team name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input 
                id="year" 
                value={year} 
                onChange={(e) => setYear(e.target.value)} 
                placeholder="Card year"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Add a description or notes about this card"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagInput
              tags={tags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              className=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardUploadInfo;
