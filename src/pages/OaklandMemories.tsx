
import React from 'react';
import Navbar from '@/components/Navbar';
import OaklandMemoryGallery from '@/components/oakland/OaklandMemoryGallery';

const OaklandMemories = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#003831]">Oakland A's Memories</h1>
              <p className="text-gray-600 mt-2">
                Preserve and share your cherished Oakland Athletics memories and experiences.
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
        
        <OaklandMemoryGallery />
      </main>
    </div>
  );
};

export default OaklandMemories;
