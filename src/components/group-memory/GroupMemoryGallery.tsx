
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GroupMemory {
  id: string;
  title: string;
  created_at: string;
  image_url: string;
  processed: boolean;
  face_count?: number;
}

interface GroupMemoryGalleryProps {
  teamId?: string;
}

const GroupMemoryGallery: React.FC<GroupMemoryGalleryProps> = ({ teamId }) => {
  const [memories, setMemories] = useState<GroupMemory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGroupMemories();
  }, [teamId]);

  const fetchGroupMemories = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('cards')
        .select('*')
        .eq('tags', 'group-memory')
        .order('created_at', { ascending: false });
      
      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching group memories:', error);
        toast({
          variant: "destructive",
          title: "Error fetching memories",
          description: error.message
        });
        return;
      }

      // Map database results to our interface
      const processedMemories = data.map(item => ({
        id: item.id,
        title: item.title || 'Untitled Group Memory',
        created_at: item.created_at,
        image_url: item.image_url || '',
        processed: true,
        face_count: item.design_metadata?.face_count || 0
      }));

      setMemories(processedMemories);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        variant: "destructive",
        title: "Failed to load memories",
        description: "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Failed to delete memory",
          description: error.message
        });
        return;
      }

      setMemories(memories.filter(memory => memory.id !== id));
      toast({
        title: "Memory deleted",
        description: "The group memory has been removed"
      });
    } catch (err) {
      console.error('Error deleting memory:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete memory"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium mb-2">No Group Memories Found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create your first group memory to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {memories.map(memory => (
          <Card key={memory.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={memory.image_url} 
                alt={memory.title}
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholders/group-memory.png';
                }}
              />
              {memory.face_count > 0 && (
                <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                  {memory.face_count} {memory.face_count === 1 ? 'person' : 'people'}
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{memory.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {new Date(memory.created_at).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleDelete(memory.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupMemoryGallery;
