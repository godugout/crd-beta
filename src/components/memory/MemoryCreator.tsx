
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { useTeams } from '@/hooks/useTeams';
import { createMemory } from '@/repositories/memoryRepository';
import { BatchMediaUploader } from '@/components/media/BatchMediaUploader';
import { toast } from 'sonner';

export interface MemoryCreatorProps {
  onCreated?: (id: string) => void;
  teamId?: string;
  defaultVisibility?: 'public' | 'private' | 'shared';
}

export const MemoryCreator: React.FC<MemoryCreatorProps> = ({ 
  onCreated,
  teamId: defaultTeamId,
  defaultVisibility = 'private'
}) => {
  const { user } = useUser();
  const { teams } = useTeams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamId, setTeamId] = useState(defaultTeamId || '');
  const [visibility, setVisibility] = useState<'public'|'private'|'shared'>(defaultVisibility);
  const [createdMemoryId, setCreatedMemoryId] = useState<string|null>(null);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleCreate = async () => {
    if (!user) {
      toast.error('You must be logged in to create memories');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please enter a title for your memory');
      return;
    }
    
    setCreating(true);
    try {
      const mem = await createMemory({
        userId: user.id,
        title,
        description,
        teamId: teamId || undefined,
        visibility,
        tags: [],
        metadata: {}
      });
      
      setCreatedMemoryId(mem.id);
      toast.success('Memory created successfully');
      onCreated?.(mem.id);
    } catch (err) {
      console.error('Error creating memory:', err);
      toast.error('Failed to create memory');
    } finally {
      setCreating(false);
    }
  };

  const handleMediaUploadComplete = (items: any[]) => {
    setUploading(false);
    toast.success(`Added ${items.length} media items to your memory`);
  };

  const handleStartOver = () => {
    setTitle('');
    setDescription('');
    setTeamId(defaultTeamId || '');
    setVisibility(defaultVisibility);
    setCreatedMemoryId(null);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{createdMemoryId ? 'Add Media' : 'Create Memory'}</CardTitle>
        <CardDescription>
          {createdMemoryId 
            ? 'Upload photos and videos to your memory'
            : 'Preserve your sports moment'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!createdMemoryId ? (
          <>
            <div>
              <Label htmlFor="memory-title">Title</Label>
              <Input 
                id="memory-title"
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a title for your memory"
              />
            </div>
            
            <div>
              <Label htmlFor="memory-description">Description</Label>
              <Textarea 
                id="memory-description"
                rows={3} 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your memory (optional)"
              />
            </div>
            
            <div>
              <Label htmlFor="memory-team">Team</Label>
              <select 
                id="memory-team"
                value={teamId} 
                onChange={e => setTeamId(e.target.value)} 
                className="w-full p-2 border rounded-md"
              >
                <option value="">No Team</option>
                {teams?.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="memory-visibility">Visibility</Label>
              <select 
                id="memory-visibility"
                value={visibility} 
                onChange={e => setVisibility(e.target.value as any)} 
                className="w-full p-2 border rounded-md"
              >
                <option value="private">Private</option>
                <option value="shared">Shared</option>
                <option value="public">Public</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Your memory "{title}" has been created! Upload photos and videos below.
            </p>
            
            <BatchMediaUploader
              memoryId={createdMemoryId}
              userId={user?.id || ''}
              onUploadComplete={handleMediaUploadComplete}
              onError={(err) => {
                console.error('Upload error:', err);
                toast.error('Failed to upload media');
              }}
            />
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {!createdMemoryId ? (
          <div className="flex gap-2 w-full justify-end">
            <Button 
              variant="outline" 
              onClick={() => onCreated?.('')}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!title.trim() || creating}
            >
              {creating ? 'Creating...' : 'Create Memory'}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 w-full justify-end">
            <Button variant="outline" onClick={handleStartOver}>
              Create Another
            </Button>
            <Button onClick={() => onCreated?.(createdMemoryId)}>
              Done
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
