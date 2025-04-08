
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChevronLeft, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import MobileLayout from '@/components/layout/MobileLayout';
import CardCreator from '@/components/card-experiences/CardCreator';
import CardGalleryView from '@/components/card-experiences/CardGalleryView';
import CardCollectionView from '@/components/card-experiences/CardCollectionView';
import CardDetailView from '@/components/card-experiences/CardDetailView';

const Experiences = () => {
  const [activeView, setActiveView] = useState<'create' | 'gallery' | 'collections' | 'detail'>('create');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
    setActiveView('detail');
  };

  const handleBackClick = () => {
    if (activeView === 'detail') {
      setActiveView('gallery');
      setSelectedCardId(null);
    } else {
      navigate('/');
    }
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-gray-800">
          <div className="container flex items-center justify-between h-16 px-4">
            <button 
              onClick={handleBackClick}
              className="flex items-center text-sm text-gray-300 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              {activeView === 'detail' ? 'Back to Gallery' : 'Back to Home'}
            </button>
            
            <div className="flex items-center space-x-4">
              {activeView === 'gallery' && (
                <Button 
                  onClick={() => setActiveView('create')}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Card
                </Button>
              )}
            </div>
          </div>
        </header>

        {activeView === 'detail' && selectedCardId ? (
          <CardDetailView cardId={selectedCardId} onBack={() => setActiveView('gallery')} />
        ) : (
          <div className="container px-4 py-6">
            <Tabs 
              defaultValue={activeView}
              value={activeView} 
              onValueChange={(value) => setActiveView(value as any)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="mt-0">
                <CardCreator onComplete={(card) => {
                  setSelectedCardId(card.id);
                  setActiveView('detail');
                }}/>
              </TabsContent>
              
              <TabsContent value="gallery" className="mt-0">
                <CardGalleryView onCardClick={handleCardSelect} />
              </TabsContent>
              
              <TabsContent value="collections" className="mt-0">
                <CardCollectionView onCardClick={handleCardSelect} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Experiences;
