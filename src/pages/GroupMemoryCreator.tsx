
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import GroupImageUploader from '@/components/group-memory/GroupImageUploader';

const GroupMemoryCreator = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <Link to="/teams/oakland/memories">
            <Button variant="ghost" className="mb-4 -ml-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Memories
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#003831]">Group Memory Creator</h1>
              <p className="text-gray-600 mt-2">
                Capture and preserve group experiences at the Coliseum and beyond
              </p>
            </div>
            
            <div className="h-16 w-16">
              <img 
                src="/oakland/oak-fan-logo.png" 
                alt="Oakland A's" 
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          
          <div className="h-1 bg-gradient-to-r from-[#003831] via-[#006341] to-[#EFB21E] mt-4"></div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <GroupImageUploader />
        </div>
      </main>
    </div>
  );
};

export default GroupMemoryCreator;
