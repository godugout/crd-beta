
import React from 'react';
import Navbar from '@/components/Navbar';
import BaseballCardRenderer from '@/components/baseball/BaseballCardRenderer';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BaseballCardViewer = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />
      
      <div className="absolute top-16 left-4 z-10 mt-2">
        <Button asChild variant="ghost" className="text-white hover:bg-white/10">
          <Link to="/gallery" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Return to Gallery
          </Link>
        </Button>
      </div>
      
      <main className="flex-1 pt-16">
        <BaseballCardRenderer />
      </main>
    </div>
  );
};

export default BaseballCardViewer;
