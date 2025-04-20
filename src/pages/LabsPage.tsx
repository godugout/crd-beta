
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { BeakerIcon, Sparkles, ArrowRight, Eye, Layers3D, RotateCw } from 'lucide-react';
import { Link } from 'react-router-dom';

// Importing BeakerIcon from Lucide
const BeakerIconComponent = () => <BeakerIcon className="h-5 w-5" />;

const LabsPage = () => {
  return (
    <PageLayout 
      title="Dugout Labs | CardShow" 
      description="Experimental features and innovative card technologies"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="inline-flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-medium mb-2">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Experimental
            </div>
            <h1 className="text-3xl font-bold">Dugout Labs</h1>
            <p className="text-muted-foreground mt-1">
              Preview and test experimental features before they're released
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline">
              Submit Feedback
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
            <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 flex items-center justify-center">
              <Eye className="h-12 w-12 text-blue-500/70" />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2">Card Detection</h3>
              <p className="text-muted-foreground mb-4">
                Scan physical cards with your camera to automatically digitize them
              </p>
              <Button asChild variant="ghost" className="w-full justify-between">
                <Link to="/cards/detector">
                  Try Card Detection <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
            <div className="h-40 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30 flex items-center justify-center">
              <Layers3D className="h-12 w-12 text-purple-500/70" />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2">AR Card Viewer</h3>
              <p className="text-muted-foreground mb-4">
                View your cards in immersive 3D augmented reality
              </p>
              <Button asChild variant="ghost" className="w-full justify-between">
                <Link to="/ar-viewer">
                  Try AR Viewer <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
            <div className="h-40 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/30 flex items-center justify-center">
              <RotateCw className="h-12 w-12 text-amber-500/70" />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2">Animation Studio</h3>
              <p className="text-muted-foreground mb-4">
                Create animated cards with custom effects and transitions
              </p>
              <Button asChild variant="ghost" className="w-full justify-between">
                <Link to="/animation">
                  Try Animation Studio <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/50 border rounded-xl p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Labs Roadmap</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-6 w-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="h-3 w-3 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">AI-Powered Card Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Create unique cards using AI image generation based on text prompts
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-6 w-6 rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium">Voice Memories</h3>
                <p className="text-sm text-muted-foreground">
                  Add voice recordings to your cards to capture audio memories
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="h-3 w-3 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium">Multi-Card Interactions</h3>
                <p className="text-sm text-muted-foreground">
                  Create special effects when specific cards are placed together
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LabsPage;
