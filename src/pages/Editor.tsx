import React from 'react';
import Navbar from '@/components/Navbar';
import CardEditor from '@/components/CardEditor';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Box, Layers, Zap } from 'lucide-react';

const Editor = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cardshow-dark mb-2">Create New Card</h1>
              <p className="text-cardshow-slate">
                Upload an image and add details to create your digital card. 
                Our editor will help you identify and extract cards from your images.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/pbr">
                <Button variant="outline" className="gap-2">
                  Try PBR Renderer
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    New
                  </span>
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/ar-card-viewer" className="group bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-lg p-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full">
                  <Box className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-indigo-900">AR Card Viewer</h3>
              </div>
              <p className="text-sm text-indigo-700 group-hover:text-indigo-900">
                Experience your cards in augmented reality with our interactive viewer.
              </p>
            </Link>
            
            <Link to="/card-comparison" className="group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-lg p-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-purple-900">Card Comparison</h3>
              </div>
              <p className="text-sm text-purple-700 group-hover:text-purple-900">
                Compare multiple cards side by side to analyze differences.
              </p>
            </Link>
            
            <Link to="/card-animation" className="group bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-lg p-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-amber-900">Animation Studio</h3>
              </div>
              <p className="text-sm text-amber-700 group-hover:text-amber-900">
                Create stunning card animations for presentations and social media.
              </p>
            </Link>
          </div>
          
          <CardEditor />
        </div>
      </main>
    </div>
  );
};

export default Editor;
