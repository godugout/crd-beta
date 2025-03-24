
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  isEmpty: boolean;
  isFiltered: boolean;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  isEmpty, 
  isFiltered,
  className = "" 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="bg-cardshow-neutral rounded-full p-6 mb-4">
        {isEmpty ? 
          <PlusCircle className="h-8 w-8 text-cardshow-slate" /> :
          <AlertCircle className="h-8 w-8 text-cardshow-slate" />
        }
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {isEmpty ? "No cards in your collection" : "No matching cards found"}
      </h3>
      <p className="text-cardshow-slate mb-6 max-w-md">
        {isEmpty 
          ? "You haven't created any cards yet. Create your first card to get started!" 
          : "Try adjusting your search or filters to find what you're looking for."}
      </p>
      {isEmpty && (
        <Button
          onClick={() => navigate('/editor')}
          className="flex items-center justify-center rounded-lg bg-cardshow-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Card
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
