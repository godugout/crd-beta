
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import PbrCardRenderer from '@/components/pbr/PbrCardRenderer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Tv2 } from 'lucide-react';

const PbrDemo = () => {
  const navigate = useNavigate();
  const [showEffects, setShowEffects] = useState(false);
  
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
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/baseball-card-viewer')}
                className="flex items-center gap-2"
              >
                <Tv2 className="h-4 w-4" />
                Immersive Viewer
              </Button>
              <Button variant="outline" onClick={() => navigate('/editor')}>
                Back to Editor
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              Technology Demo
            </Badge>
            <a 
              href="https://baseballhall.org/discover/card-corner/t206-honus-wagner-card-history" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              Learn about vintage baseball cards <ExternalLink className="ml-1 h-3 w-3" />
            </a>
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
