
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Grid3X3 } from 'lucide-react';

interface GalleryHeaderProps {
  title?: string;
  description?: string;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({ 
  title = "Your Card Gallery",
  description = "Browse, search, and manage your digital card collection"
}) => {
  return (
    <>
      <div className="flex items-center text-sm text-gray-500 py-4">
        <Link to="/" className="hover:text-cardshow-blue">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-cardshow-dark font-medium">Gallery</span>
      </div>
      
      <div className="py-6">
        <div className="flex items-center gap-3 mb-2">
          <Grid3X3 className="h-6 w-6 text-cardshow-blue" />
          <h1 className="text-3xl font-bold text-cardshow-dark">{title}</h1>
        </div>
        <p className="text-cardshow-slate">
          {description}
        </p>
      </div>
    </>
  );
};

export default GalleryHeader;
