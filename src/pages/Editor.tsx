
import React from 'react';
import Navbar from '@/components/Navbar';
import CardEditor from '@/components/CardEditor';

const Editor = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-8">
            <h1 className="text-3xl font-bold text-cardshow-dark mb-2">Create New Card</h1>
            <p className="text-cardshow-slate">
              Upload an image and add details to create your digital card. 
              Our editor will help you identify and extract cards from your images.
            </p>
          </div>
          
          <CardEditor />
        </div>
      </main>
    </div>
  );
};

export default Editor;
