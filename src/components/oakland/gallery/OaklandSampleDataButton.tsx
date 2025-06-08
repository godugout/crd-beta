
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { insertSampleMemories } from '@/lib/data/oakland/sampleMemories';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface OaklandSampleDataButtonProps {
  onDataAdded?: () => void;
}

const OaklandSampleDataButton: React.FC<OaklandSampleDataButtonProps> = ({ 
  onDataAdded 
}) => {
  const [loading, setLoading] = useState(false);

  const handleAddSampleData = async () => {
    try {
      setLoading(true);
      
      // For development, we'll use a hardcoded user ID or generate one
      // In a real app, this would come from authentication
      const userId = crypto.randomUUID();
      
      await insertSampleMemories(supabase, userId);
      
      toast.success('Sample Oakland memories added successfully!');
      onDataAdded?.();
    } catch (error) {
      console.error('Error adding sample data:', error);
      toast.error('Failed to add sample memories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAddSampleData} 
      disabled={loading}
      variant="outline"
      size="sm"
    >
      <Plus className="h-4 w-4 mr-2" />
      {loading ? 'Adding...' : 'Add Sample Data'}
    </Button>
  );
};

export default OaklandSampleDataButton;
