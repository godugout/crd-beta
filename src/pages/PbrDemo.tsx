
import React from 'react';
import Navbar from '@/components/Navbar';
import PbrCardRenderer from '@/components/pbr/PbrCardRenderer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PbrDemo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cardshow-dark mb-2">PBR Card Renderer</h1>
              <p className="text-cardshow-slate">
                Proof of concept for physically-based rendering with WebGL
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/editor')}>
              Back to Editor
            </Button>
          </div>
          
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <PbrCardRenderer />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PbrDemo;
