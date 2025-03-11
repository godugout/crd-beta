
import React from 'react';
import Navbar from '@/components/Navbar';
import CardGallery from '@/components/CardGallery';

const Gallery = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-8">
            <h1 className="text-3xl font-bold text-cardshow-dark mb-2">Your Card Gallery</h1>
            <p className="text-cardshow-slate">
              Browse, search, and manage your digital card collection
            </p>
          </div>
          
          <CardGallery />
        </div>
      </main>
    </div>
  );
};

export default Gallery;
