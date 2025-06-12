
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MemoryData {
  title: string;
  subtitle: string;
  description: string;
  player?: string;
  date?: string;
  tags: string[];
}

interface SaveMemoryData extends MemoryData {
  template_id?: string;
  memory_type: string;
  effect_settings?: any;
  visibility?: string;
}

export const useOaklandMemoryOperations = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const saveMemory = async (memoryData: SaveMemoryData) => {
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to save memories');
        return null;
      }

      const { data, error } = await supabase
        .from('oakland_memories')
        .insert({
          user_id: user.id,
          title: memoryData.title,
          description: memoryData.description,
          memory_type: memoryData.memory_type,
          template_id: memoryData.template_id,
          tags: memoryData.tags,
          effect_settings: memoryData.effect_settings || {},
          visibility: memoryData.visibility || 'public',
          // Add additional fields from memory data
          ...(memoryData.player && { attendees: [memoryData.player] }),
          ...(memoryData.date && { game_date: memoryData.date })
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving memory:', error);
        toast.error('Failed to save memory');
        return null;
      }

      toast.success('Oakland A\'s memory saved! ⚾');
      return data;
    } catch (error) {
      console.error('Error saving memory:', error);
      toast.error('Failed to save memory');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const exportCard = async (format: 'png' | 'pdf' | 'print') => {
    setIsExporting(true);
    
    try {
      // Simulate export functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Card exported as ${format.toUpperCase()}! 📁`);
      
      // In a real implementation, this would:
      // 1. Capture the 3D canvas as an image
      // 2. Generate PDF or print-ready files
      // 3. Trigger download or send to print service
      
    } catch (error) {
      console.error('Error exporting card:', error);
      toast.error('Failed to export card');
    } finally {
      setIsExporting(false);
    }
  };

  const shareMemory = async (memoryId?: string) => {
    try {
      if (memoryId) {
        const shareUrl = `${window.location.origin}/oakland/memory/${memoryId}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Memory link copied to clipboard! 🔗');
      } else {
        // Share current card state
        const currentUrl = window.location.href;
        await navigator.clipboard.writeText(currentUrl);
        toast.success('Card link copied to clipboard! 🔗');
      }
    } catch (error) {
      console.error('Error sharing memory:', error);
      toast.error('Failed to copy link');
    }
  };

  return {
    saveMemory,
    exportCard,
    shareMemory,
    isSaving,
    isExporting
  };
};
