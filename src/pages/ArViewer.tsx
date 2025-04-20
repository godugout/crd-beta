
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Cube, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArViewer = () => {
  return (
    <PageLayout 
      title="AR Viewer | CardShow" 
      description="View cards in augmented reality"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/labs" className="text-muted-foreground hover:text-foreground inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Labs
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">AR Card Viewer</h1>
            <p className="text-muted-foreground mt-1">
              View your trading cards in augmented reality
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 bg-muted rounded-lg text-center">
          <Cube className="h-16 w-16 mb-4 text-muted-foreground" />
          <h2 className="text-xl font-medium mb-2">AR Viewer Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Our augmented reality card viewer is currently under development. 
            Check back soon for an immersive 3D card viewing experience!
          </p>
          <Button asChild>
            <Link to="/cards">Browse Cards</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ArViewer;
