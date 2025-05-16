
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
