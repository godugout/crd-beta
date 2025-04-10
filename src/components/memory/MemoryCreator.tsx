import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { BatchMediaUploader } from '@/components/media/BatchMediaUploader';
import { createMemory } from '@/repositories/memoryRepository';
import { useUser } from '@/hooks/useUser';
import { useTeams } from '@/hooks/useTeams';
import { toast } from 'sonner';

interface MemoryCreatorProps {
  onCreated?: (memoryId: string) => void;
  defaultTeamId?: string;
  defaultGameId?: string;
  defaultVisibility?: 'public' | 'private' | 'shared';
}

export const MemoryCreator: React.FC<MemoryCreatorProps> = ({
  onCreated,
  defaultTeamId,
  defaultGameId,
  defaultVisibility = 'private'
}) => {
  const { user } = useUser();
  const { teams } = useTeams();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamId, setTeamId] = useState(defaultTeamId || '');
  const [gameId, setGameId] = useState(defaultGameId || '');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'shared'>(defaultVisibility);
  const [tags, setTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [location, setLocation] = useState<{ lat?: number; lng?: number; name?: string; stadiumSection?: string }>({});
  const [isCreating, setIsCreating] = useState(false);
  const [createdMemoryId, setCreatedMemoryId] = useState<string | null>(null);
  
  const handleTagsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      
      const newTag = tagsInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagsInput('');
      }
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleCreate = async () => {
    if (!user) {
      toast.error("You must be logged in to create memories");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title for your memory");
      return;
    }
    
    setIsCreating(true);
    
    try {
      const memory = await createMemory({
        userId: user.id,
        title,
        description,
        teamId: teamId || undefined,
        gameId: gameId || undefined,
        visibility,
        location: Object.keys(location).length > 0 ? location : undefined,
        tags,
        metadata: {}
      });
      
      setCreatedMemoryId(memory.id);
      toast.success("Memory created successfully");
      if (onCreated) {
        onCreated(memory.id);
      }
    } catch (error) {
      console.error('Error creating memory:', error);
      toast.error("Failed to create memory");
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleMediaUploadComplete = (mediaItems: any[]) => {
    toast.success(`Added ${mediaItems.length} media items to your memory`);
  };
  
  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>You need to be logged in to create memories.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Memory</CardTitle>
        <CardDescription>
          Capture and preserve your baseball moments
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!createdMemoryId ? (
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your memory a title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this memory"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Select value={teamId} onValueChange={setTeamId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No team</SelectItem>
                    {teams?.map(team => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={visibility} onValueChange={(value: 'public' | 'private' | 'shared') => setVisibility(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <div key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="text-blue-800 hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={handleTagsChange}
                placeholder="Add tags (press Enter or comma to add)"
              />
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Add Media</h3>
              <p className="text-sm text-gray-500">
                Upload photos or videos to your memory
              </p>
            </div>
            
            <BatchMediaUploader
              memoryId={createdMemoryId}
              userId={user.id}
              onUploadComplete={handleMediaUploadComplete}
              detectFaces={true}
              maxFiles={20}
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {!createdMemoryId ? (
          <>
            <Button variant="outline" onClick={() => onCreated?.('')}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isCreating || !title.trim()}>
              {isCreating ? 'Creating...' : 'Create Memory'}
            </Button>
          </>
        ) : (
          <Button onClick={() => {
            setCreatedMemoryId(null);
            setTitle('');
            setDescription('');
            setTeamId(defaultTeamId || '');
            setGameId(defaultGameId || '');
            setVisibility(defaultVisibility);
            setTags([]);
            setTagsInput('');
            setLocation({});
          }}>
            Create Another Memory
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
