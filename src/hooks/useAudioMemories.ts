
import { useState, useEffect } from 'react';
import { audioMemoryOperations } from '@/repositories/oaklandRepository';
import { AudioMemory } from '@/lib/types/oaklandTypes';
import { useToast } from '@/hooks/use-toast';

export const useAudioMemories = () => {
  const [audioMemories, setAudioMemories] = useState<AudioMemory[]>([]);
  const [featuredAudio, setFeaturedAudio] = useState<AudioMemory[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAudioMemories = async () => {
    try {
      setLoading(true);
      const [allAudio, featured] = await Promise.all([
        audioMemoryOperations.getAll(),
        audioMemoryOperations.getFeatured()
      ]);
      
      setAudioMemories(allAudio);
      setFeaturedAudio(featured);
    } catch (err) {
      console.error('Error fetching audio memories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load audio memories');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (audioId: string) => {
    try {
      setCurrentlyPlaying(audioId);
      await audioMemoryOperations.incrementPlays(audioId);
      
      // Update play count in local state
      setAudioMemories(prev => prev.map(audio => 
        audio.id === audioId 
          ? { ...audio, plays_count: audio.plays_count + 1 }
          : audio
      ));
    } catch (err) {
      console.error('Error playing audio:', err);
      toast({
        title: "Playback Error",
        description: "Failed to play audio memory.",
        variant: "destructive"
      });
    }
  };

  const stopAudio = () => {
    setCurrentlyPlaying(null);
  };

  const getAudioByEra = async (era: string) => {
    try {
      const eraAudio = await audioMemoryOperations.getByEra(era);
      return eraAudio;
    } catch (err) {
      console.error('Error fetching audio by era:', err);
      return [];
    }
  };

  const createAudioMemory = async (audioData: Omit<AudioMemory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newAudio = await audioMemoryOperations.create(audioData);
      setAudioMemories(prev => [newAudio, ...prev]);
      toast({
        title: "Audio Memory Created!",
        description: "Your Oakland memory has been saved to the collection.",
      });
      return newAudio;
    } catch (err) {
      console.error('Error creating audio memory:', err);
      toast({
        title: "Error",
        description: "Failed to create audio memory. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchAudioMemories();
  }, []);

  return {
    audioMemories,
    featuredAudio,
    currentlyPlaying,
    loading,
    error,
    playAudio,
    stopAudio,
    getAudioByEra,
    createAudioMemory,
    refetch: fetchAudioMemories
  };
};
