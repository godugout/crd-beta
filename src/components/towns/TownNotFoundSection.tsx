
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';

const TownNotFoundSection: React.FC = () => {
  return (
    <div className="text-center py-16">
      <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Town Not Found</h2>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        The town you're looking for doesn't exist or may have been moved.
      </p>
      <div className="flex gap-4 justify-center">
        <Button asChild>
          <Link to="/towns">Browse Towns</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default TownNotFoundSection;
