
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ImageUploader from '@/components/dam/ImageUploader';
import { AssetSelector } from '@/components/media/AssetSelector';
import { createAssetBundle } from '@/lib/assetManager';
import { toast } from 'sonner';
import { Tag, Plus, X, Pencil } from 'lucide-react';

interface AssetCardCreatorProps {
  userId: string;
  onComplete: (result: { cardId: string; bundleId: string }) => void;
}

export const AssetCardCreator: React.FC<AssetCardCreatorProps> = ({ 
  userId,
  onComplete
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamId, setTeamId] = useState('');
  const [year, setYear] = useState<number | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [uploadedMediaIds, setUploadedMediaIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('upload');

  const handleTagAdd = () => {
    const newTag = tagsInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagsInput('');
    }
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleTagAdd();
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleMediaUploadComplete = (mediaItem: any) => {
    setUploadedMediaIds(prev => [...prev, mediaItem.id]);
    toast.success('Media uploaded successfully');
  };
  
  const handleExistingAssetSelect = (selectedAssetIds: string[]) => {
    setUploadedMediaIds(selectedAssetIds);
  };
  
  const handleCreateCard = async () => {
    if (!title.trim() || uploadedMediaIds.length === 0) {
      toast.error('Please provide a title and at least one image');
      return;
    }
    
    setIsCreating(true);
    
    try {
      const result = await createAssetBundle(
        uploadedMediaIds,
        {
          title,
          description,
          teamId,
          year,
          tags,
          isCustom: true,
        },
        userId
      );
      
      toast.success('Card created successfully');
      onComplete({
        cardId: result.cardId,
        bundleId: result.id
      });
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card');
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Card Title</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter a title for your card"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Describe your card"
            className="mt-1"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="team">Team</Label>
            <Input 
              id="team" 
              value={teamId} 
              onChange={(e) => setTeamId(e.target.value)} 
              placeholder="Team name"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="year">Year</Label>
            <Input 
              id="year" 
              type="number" 
              value={year || ''} 
              onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : undefined)} 
              placeholder="Year"
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="tags">Tags</Label>
          <div className="flex flex-wrap gap-2 mt-1 mb-2">
            {tags.map(tag => (
              <div key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-1">
                <Tag size={12} />
                <span>{tag}</span>
                <button 
                  type="button" 
                  onClick={() => removeTag(tag)}
                  className="text-primary/70 hover:text-primary ml-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tags (press Enter to add)"
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleTagAdd}
              disabled={!tagsInput.trim()}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Card Images</h3>
          <div className="text-sm text-gray-500">
            {uploadedMediaIds.length} image(s) selected
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
            <TabsTrigger value="existing">Use Existing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4 pt-4">
            <Card>
              <CardContent className="p-6">
                <ImageUploader
                  title="Upload Image"
                  onUploadComplete={handleMediaUploadComplete}
                  maxSizeMB={10}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="existing" className="space-y-4 pt-4">
            <AssetSelector
              userId={userId}
              onSelect={handleExistingAssetSelect}
              maxSelections={5}
              initialSelection={uploadedMediaIds}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="pt-4 border-t">
        <Button 
          onClick={handleCreateCard} 
          disabled={isCreating || !title.trim() || uploadedMediaIds.length === 0}
          className="w-full"
        >
          {isCreating ? (
            <>Creating Card...</>
          ) : (
            <>Create Card</>
          )}
        </Button>
      </div>
    </div>
  );
};
