
import React from 'react';

const TeamGalleryLoading: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="mt-4 text-gray-600">Loading teams...</p>
    </div>
  );
};

export default TeamGalleryLoading;
