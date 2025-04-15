
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TownDisplayData } from '@/lib/types/town';

export const useTownGalleryData = (activeRegion: string = 'all', activeType: string = 'all') => {
  const [towns, setTowns] = useState<TownDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTowns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('teams')
        .select('*, team_members(count)');
      
      // Apply region filter if not "all"
      if (activeRegion !== 'all') {
        // Assuming region is stored in state field
        query = query.eq('state', activeRegion);
      }
      
      // For now, we don't have a type field, so this is for future implementation
      // if (activeType !== 'all') {
      //   query = query.eq('type', activeType);
      // }
      
      const { data, error } = await query.order('name', { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      const formattedTowns: TownDisplayData[] = data.map((town: any) => ({
        id: town.id,
        name: town.name,
        slug: town.team_code?.toLowerCase() || town.id,
        description: town.description || '',
        memberCount: town.team_members?.[0]?.count || 0,
        owner_id: town.owner_id,
        primary_color: town.primary_color || '#cccccc',
        secondary_color: town.secondary_color,
        founded_year: town.founded_year,
        city: town.city,
        state: town.state,
      }));
      
      setTowns(formattedTowns);
    } catch (err: any) {
      console.error('Error fetching towns:', err);
      setError(err.message || 'Failed to fetch towns');
      toast.error('Failed to fetch towns');
    } finally {
      setIsLoading(false);
    }
  }, [activeRegion, activeType]);

  useEffect(() => {
    fetchTowns();
  }, [fetchTowns]);

  return {
    towns,
    loading: isLoading,
    error,
    refetch: fetchTowns
  };
};

export default useTownGalleryData;
