
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
import { X, PlusCircle, Tags, Users, Shield, Calendar } from 'lucide-react';
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
      <Card className="bg-white dark:bg-litmus-gray-800 shadow-md">
        <CardContent className="pt-6">
          <p className="text-center text-gray-500 dark:text-gray-400">You need to be logged in to create memories.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl dark:shadow-litmus-purple/5 border border-gray-200 dark:border-litmus-gray-700">
      <CardHeader className="bg-gradient-to-r from-litmus-purple/10 to-litmus-purple-secondary/5 dark:from-litmus-purple-dark/20 dark:to-litmus-purple/10 border-b border-gray-100 dark:border-litmus-gray-800">
        <CardTitle className="text-litmus-purple-secondary dark:text-litmus-purple-light">Create New Memory</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Capture and preserve your baseball moments
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {!createdMemoryId ? (
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar size={16} className="text-litmus-purple" />
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your memory a title"
                required
                className="border-gray-300 dark:border-litmus-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <PlusCircle size={16} className="text-litmus-purple" />
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this memory"
                rows={3}
                className="border-gray-300 dark:border-litmus-gray-700 rounded-lg resize-none focus:ring-litmus-purple focus:border-litmus-purple"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="team" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Users size={16} className="text-litmus-purple" />
                  Team
                </Label>
                <Select value={teamId} onValueChange={setTeamId}>
                  <SelectTrigger className="border-gray-300 dark:border-litmus-gray-700 rounded-lg focus:ring-litmus-purple focus:border-litmus-purple">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-litmus-gray-800">
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
                <Label htmlFor="visibility" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Shield size={16} className="text-litmus-purple" />
                  Visibility
                </Label>
                <Select value={visibility} onValueChange={(value: 'public' | 'private' | 'shared') => setVisibility(value)}>
                  <SelectTrigger className="border-gray-300 dark:border-litmus-gray-700 rounded-lg focus:ring-litmus-purple focus:border-litmus-purple">
                    <SelectValue placeholder="Visibility" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-litmus-gray-800">
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="tags" className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Tags size={16} className="text-litmus-purple" />
                Tags
              </Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map(tag => (
                  <div key={tag} className="bg-litmus-purple/10 text-litmus-purple dark:text-litmus-purple-light dark:bg-litmus-purple-dark/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    #{tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="text-litmus-purple hover:text-litmus-purple-secondary dark:text-litmus-purple-light dark:hover:text-white ml-1"
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
                className="border-gray-300 dark:border-litmus-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tags help others find your memory
              </p>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-litmus-teal/10 dark:bg-litmus-teal-dark/20 rounded-lg p-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-litmus-teal/20 dark:bg-litmus-teal-dark/30 flex items-center justify-center mr-3">
                <span className="text-litmus-teal">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-litmus-teal dark:text-litmus-teal-light">Memory Created!</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Now add media to bring your memory to life
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-litmus-purple-secondary dark:text-litmus-purple-light">Add Media</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload photos or videos to make your memory more vivid
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-litmus-gray-900/50 rounded-lg p-6">
              <BatchMediaUploader
                memoryId={createdMemoryId}
                userId={user.id}
                onUploadComplete={handleMediaUploadComplete}
                detectFaces={true}
                maxFiles={20}
              />
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-gray-100 dark:border-litmus-gray-800 py-4">
        {!createdMemoryId ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => onCreated?.('')}
              className="border-gray-300 dark:border-litmus-gray-700 text-gray-600 dark:text-gray-400"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={isCreating || !title.trim()}
              variant="gradient"
              className="relative"
            >
              <span className="relative z-10">
                {isCreating ? 'Creating...' : 'Create Memory'}
              </span>
            </Button>
          </>
        ) : (
          <div className="w-full flex justify-between">
            <Button
              variant="outline"
              onClick={() => onCreated?.(createdMemoryId)}
            >
              Finish
            </Button>
            <Button 
              variant="ghost"
              onClick={() => {
                setCreatedMemoryId(null);
                setTitle('');
                setDescription('');
                setTeamId(defaultTeamId || '');
                setGameId(defaultGameId || '');
                setVisibility(defaultVisibility);
                setTags([]);
                setTagsInput('');
                setLocation({});
              }}
            >
              Create Another Memory
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
