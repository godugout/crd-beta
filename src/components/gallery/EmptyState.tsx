
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  isEmpty: boolean;
  isFiltered: boolean;
  onRefresh: () => Promise<void>;
}

const EmptyState: React.FC<EmptyStateProps> = ({ isEmpty, isFiltered, onRefresh }) => {
  const navigate = useNavigate();
  
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-amber-100 rounded-full p-6 mb-4">
          <Filter className="h-8 w-8 text-amber-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No matching cards</h3>
        <p className="text-cardshow-slate mb-6 max-w-md">
          We couldn't find any cards matching your current filters. Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }
  
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-cardshow-neutral rounded-full p-6 mb-4">
          <PlusCircle className="h-8 w-8 text-cardshow-slate" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No cards yet</h3>
        <p className="text-cardshow-slate mb-6 max-w-md">
          Your collection is empty. Start by creating your first card!
        </p>
        <Button 
          onClick={() => navigate('/editor')}
          className="flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Your First Card
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-blue-100 rounded-full p-6 mb-4">
        <RefreshCw className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
      <p className="text-cardshow-slate mb-6 max-w-md">
        We couldn't load your cards. Please try refreshing.
      </p>
      <Button 
        onClick={() => onRefresh()}
        variant="outline"
        className="flex items-center"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
};

export default EmptyState;
