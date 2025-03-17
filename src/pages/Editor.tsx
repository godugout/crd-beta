
import React from 'react';
import Navbar from '@/components/Navbar';
import CardEditor from '@/components/CardEditor';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
            <Link to="/pbr">
              <Button variant="outline" className="gap-2">
                Try PBR Renderer
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  New
                </span>
              </Button>
            </Link>
          </div>
          
          <CardEditor />
        </div>
      </main>
    </div>
  );
};

export default Editor;
