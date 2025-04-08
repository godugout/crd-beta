
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import OaklandMemoryGallery from '@/components/oakland/OaklandMemoryGallery';
import MetaTags from '@/components/shared/MetaTags';

const OaklandMemories: React.FC = () => {
  return (
    <>
      <MetaTags 
        title="Oakland A's Memories"
        description="Explore fan memories and experiences from Oakland Athletics baseball games."
        canonicalPath="/teams/oakland/memories"
      />
      
      <div className="container mx-auto max-w-6xl px-4 pt-8 pb-24">
        <div className="py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#003831] mb-2">Oakland A's Memories</h1>
              <p className="text-gray-600">
                Your personal collection of Oakland Athletics baseball memories
              </p>
            </div>
            
            <Button asChild className="bg-[#006341] hover:bg-[#003831]">
              <Link to="/teams/oakland/create">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Memory
              </Link>
            </Button>
          </div>
          
          <OaklandMemoryGallery />
        </div>
      </div>
    </>
  );
};

export default OaklandMemories;
