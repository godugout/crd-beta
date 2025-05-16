
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Update the button size to a valid value
// Replace 'xs' with 'sm' which is a valid size
const RecommendationEngine = () => {
  const selectRecommendation = (id: string) => {
    console.log(`Selected recommendation: ${id}`);
  };
  
  const rec = { id: 'sample-rec' };
  
  return (
    <Button variant="outline" size="sm" onClick={() => selectRecommendation(rec.id)}>
      <Plus size={14} className="mr-1" />
      Select
    </Button>
  );
};

export default RecommendationEngine;
