
import React from 'react';
import Navbar from '@/components/Navbar';
import OaklandMemoryCreator from '@/components/oakland/OaklandMemoryCreator';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const OaklandMemoryCreatorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <Link to="/oakland-memories">
            <Button variant="ghost" className="mb-4 -ml-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Memories
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#003831]">Create A's Memory</h1>
              <p className="text-gray-600 mt-2">
                Capture and preserve your Oakland A's moments from the Coliseum and beyond.
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
        
        <OaklandMemoryCreator />
      </main>
    </div>
  );
};

export default OaklandMemoryCreatorPage;
