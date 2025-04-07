
import React from 'react';
import Navbar from '../components/Navbar';

const BaseballCardViewer = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-3xl font-bold mb-6">Baseball Card Viewer</h1>
        <p>This is a placeholder for the Baseball Card Viewer page.</p>
      </div>
    </div>
  );
};

export default BaseballCardViewer;
