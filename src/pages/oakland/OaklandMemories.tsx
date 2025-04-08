
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#003831] mb-2">Oakland A's Memories</h1>
              <p className="text-gray-600">
                Preserve your Oakland Athletics baseball memories from 1968 to today
              </p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <Button asChild className="bg-[#006341] hover:bg-[#003831]">
                <Link to="/teams/oakland/create">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Memory
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="border-[#006341] text-[#006341] hover:bg-[#003831]/10">
                <Link to="/group-memory-creator">
                  <Users className="h-4 w-4 mr-2" />
                  Group Memory
                </Link>
              </Button>
            </div>
          </div>
          
          <OaklandMemoryGallery />
        </div>
      </div>
    </>
  );
};

export default OaklandMemories;
