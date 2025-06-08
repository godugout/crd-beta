
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface OaklandMemory {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  memory_type: string;
  game_date?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  era?: string;
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  attendees?: string[];
  personal_significance?: string;
  historical_context?: string;
  emotions?: string[];
  fan_expressions?: string[];
  tags?: string[];
  visibility?: string;
  template_id?: string;
  effect_settings?: Record<string, any>;
  is_featured?: boolean;
  community_reactions?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useOaklandMemories = () => {
  const [memories, setMemories] = useState<OaklandMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('oakland_memories')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setMemories(data || []);
      } catch (err) {
        console.error('Error fetching Oakland memories:', err);
        setError(err instanceof Error ? err.message : 'Failed to load memories');
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  return { memories, loading, error, refetch: () => fetchMemories() };
};
