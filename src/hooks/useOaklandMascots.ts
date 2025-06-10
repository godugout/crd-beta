
import { useState, useEffect } from 'react';
import { mascotOperations } from '@/repositories/oaklandRepository';
import { OaklandMascot } from '@/lib/types/oaklandTypes';
import { useToast } from '@/hooks/use-toast';

export const useOaklandMascots = () => {
  const [mascots, setMascots] = useState<OaklandMascot[]>([]);
  const [featuredMascots, setFeaturedMascots] = useState<OaklandMascot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMascots = async () => {
    try {
      setLoading(true);
      const [allMascots, featured] = await Promise.all([
        mascotOperations.getAll(),
        mascotOperations.getFeatured()
      ]);
      
      setMascots(allMascots);
      setFeaturedMascots(featured);
    } catch (err) {
      console.error('Error fetching mascots:', err);
      setError(err instanceof Error ? err.message : 'Failed to load mascots');
    } finally {
      setLoading(false);
    }
  };

  const adoptMascot = async (mascotId: string) => {
    try {
      await mascotOperations.adoptMascot(mascotId);
      toast({
        title: "Mascot Adopted!",
        description: "You've officially adopted this Oakland mascot!",
      });
      // Update local state
      setMascots(prev => prev.map(m => 
        m.id === mascotId 
          ? { ...m, adoption_count: m.adoption_count + 1 }
          : m
      ));
    } catch (err) {
      console.error('Error adopting mascot:', err);
      toast({
        title: "Error",
        description: "Failed to adopt mascot. Please try again.",
        variant: "destructive"
      });
    }
  };

  const favoriteMascot = async (mascotId: string) => {
    try {
      await mascotOperations.favoriteMascot(mascotId);
      toast({
        title: "Mascot Favorited!",
        description: "Added to your favorite Oakland mascots!",
      });
      // Update local state
      setMascots(prev => prev.map(m => 
        m.id === mascotId 
          ? { ...m, fan_favorites: m.fan_favorites + 1 }
          : m
      ));
    } catch (err) {
      console.error('Error favoriting mascot:', err);
      toast({
        title: "Error",
        description: "Failed to favorite mascot. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getMascotsByEra = async (era: string) => {
    try {
      const eraMascots = await mascotOperations.getByEra(era);
      return eraMascots;
    } catch (err) {
      console.error('Error fetching mascots by era:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchMascots();
  }, []);

  return {
    mascots,
    featuredMascots,
    loading,
    error,
    adoptMascot,
    favoriteMascot,
    getMascotsByEra,
    refetch: fetchMascots
  };
};
