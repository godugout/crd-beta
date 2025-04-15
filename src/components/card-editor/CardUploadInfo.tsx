
import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCardEditor } from '@/lib/state/card-editor/context';

const CardUploadInfo: React.FC = () => {
  const { design, updateDesign } = useCardEditor();
  
  const handleFileChange = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    updateDesign({ imageUrl: url });
  }, [updateDesign]);
  
  const onFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  }, [handleFileChange]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Card Information</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Add basic details and upload an image for your card.
        </p>
      </div>
      
      {/* Image Upload Section */}
      <div className="space-y-2">
        <Label htmlFor="cardImage">Card Image</Label>
        <div 
          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => document.getElementById('cardImage')?.click()}
        >
          {design.imageUrl ? (
            <div className="flex flex-col items-center">
              <div className="max-w-xs mx-auto relative aspect-[2.5/3.5] mb-2">
                <img 
                  src={design.imageUrl} 
                  alt="Card preview" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <span className="text-sm text-blue-600">Click to change image</span>
            </div>
          ) : (
            <div className="py-10">
              <div className="flex flex-col items-center">
                <svg
                  className="w-10 h-10 text-muted-foreground mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="text-muted-foreground">Click to upload an image</span>
                <span className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, GIF up to 10MB
                </span>
              </div>
            </div>
          )}
          <input
            type="file"
            id="cardImage"
            className="hidden"
            accept="image/*"
            onChange={onFileSelected}
          />
        </div>
      </div>
      
      {/* Card Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title"
          value={design.title}
          onChange={(e) => updateDesign({ title: e.target.value })}
          placeholder="Enter card title"
        />
      </div>
      
      {/* Card Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={design.description}
          onChange={(e) => updateDesign({ description: e.target.value })}
          placeholder="Enter card description"
          rows={3}
        />
      </div>
      
      {/* Card Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="player">Player Name</Label>
          <Input 
            id="player"
            value={design.player || ''}
            onChange={(e) => updateDesign({ player: e.target.value })}
            placeholder="e.g. Babe Ruth"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="team">Team</Label>
          <Input 
            id="team"
            value={design.team || ''}
            onChange={(e) => updateDesign({ team: e.target.value })}
            placeholder="e.g. New York Yankees"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input 
            id="year"
            value={design.year || ''}
            onChange={(e) => updateDesign({ year: e.target.value })}
            placeholder="e.g. 1927"
          />
        </div>
      </div>
      
      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input 
          id="tags"
          value={design.tags?.join(', ') || ''}
          onChange={(e) => {
            const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
            updateDesign({ tags });
          }}
          placeholder="e.g. vintage, baseball, collectible"
        />
      </div>
    </div>
  );
};

export default CardUploadInfo;
