
import React from 'react';
import { Grid3X3 } from 'lucide-react';

interface GalleryHeaderProps {
  title?: string;
  description?: string;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({ 
  title = "Your Card Gallery",
  description = "Browse, search, and manage your digital card collection"
}) => {
  return (
    <div className="py-6">
      <div className="flex items-center gap-3 mb-2">
        <Grid3X3 className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      </div>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default GalleryHeader;
