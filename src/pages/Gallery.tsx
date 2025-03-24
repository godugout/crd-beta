
import React from 'react';
import Navbar from '@/components/Navbar';
import CardGallery from '@/components/CardGallery';
import { ChevronRight, Grid3X3, GalleryHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';

const Gallery = () => {
  const { cards } = useCards();
  
  // Check if we have baseball cards in the collection
  const hasBaseballCards = cards.some(card => 
    card.tags?.some(tag => ['baseball', 'vintage'].includes(tag.toLowerCase()))
  );
  
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
          
          {/* Baseball Card Immersive View Promotion */}
          {hasBaseballCards && (
            <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg overflow-hidden shadow-lg">
              <div className="p-6 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-white text-xl font-bold mb-2 flex items-center">
                    <GalleryHorizontal className="mr-2 h-5 w-5" />
                    Immersive Baseball Card Viewer
                  </h2>
                  <p className="text-blue-100">
                    Experience your vintage baseball cards in 3D with our new immersive viewer
                  </p>
                </div>
                <Button 
                  className="bg-white text-blue-700 hover:bg-blue-50"
                  onClick={() => window.location.href = '/baseball-card-viewer'}
                >
                  Launch 3D Viewer
                </Button>
              </div>
            </div>
          )}
          
          <CardGallery />
        </div>
      </main>
    </div>
  );
};

export default Gallery;
