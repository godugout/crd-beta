
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import OldCardCreator from '@/components/OldCardCreator';

const Collections = () => {
  const navigate = useNavigate();
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  const handleTitleClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        toast.success("You found the easter egg! Original card creator unlocked!");
        setShowEasterEgg(true);
        return 0;
      }
      return newCount;
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-8 flex justify-between items-center">
            <div>
              <h1 
                className="text-3xl font-bold text-cardshow-dark mb-2"
                onClick={handleTitleClick}
                style={{ cursor: 'pointer' }}
              >
                Your Collections
              </h1>
              <p className="text-cardshow-slate">
                Organize your cards into themed collections
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/editor')}
              className="flex items-center gap-2"
            >
              <PlusCircle size={18} />
              New Card
            </Button>
          </div>
          
          {showEasterEgg ? (
            <div className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-xl font-semibold mb-2 text-blue-800">Original Card Creator</h3>
                <p className="text-blue-600 mb-4">
                  This is where it all began! The original card creator from the first build.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEasterEgg(false)}
                  className="text-blue-600 border-blue-300"
                >
                  Hide Easter Egg
                </Button>
              </div>
              
              <OldCardCreator />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-cardshow-neutral rounded-full p-6 mb-4">
                <PlusCircle className="h-8 w-8 text-cardshow-slate" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
              <p className="text-cardshow-slate mb-6 max-w-md">
                Start organizing your cards into collections. Create your first collection to get started!
              </p>
              <Button 
                onClick={() => navigate('/editor')}
                className="flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Create a Card First
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Collections;
