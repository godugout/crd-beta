
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';

const TownNotFound: React.FC = () => {
  return (
    <PageLayout title="Town Not Found" description="The requested town could not be found">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-lg mx-auto">
          <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold mb-4">Town Not Found</h1>
          <p className="text-gray-600 mb-6">
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
      </div>
    </PageLayout>
  );
};

export default TownNotFound;
