
import React from 'react';
import Navbar from '@/components/Navbar';
import CardGallery from '@/components/CardGallery';
import { ChevronRight, Grid3X3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Gallery = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 py-4">
            <Link to="/" className="hover:text-cardshow-blue">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-cardshow-dark font-medium">Gallery</span>
          </div>
          
          <div className="py-6">
            <div className="flex items-center gap-3 mb-2">
              <Grid3X3 className="h-6 w-6 text-cardshow-blue" />
              <h1 className="text-3xl font-bold text-cardshow-dark">Your Card Gallery</h1>
            </div>
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
