
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const OaklandNoResults: React.FC = () => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No memories match your filters</h3>
      <p className="text-gray-500 mb-6">Try adjusting your search criteria or create a new memory</p>
      <Button asChild>
        <Link to="/oakland-memory-creator">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Memory
        </Link>
      </Button>
    </div>
  );
};

export default OaklandNoResults;
