
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import CardMedia from '@/components/gallery/CardMedia';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Layers } from 'lucide-react';

const CardAnimation = () => {
  const { cards } = useCards();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [activeEffect, setActiveEffect] = useState('shine');
  const navigate = useNavigate();
  
  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };
  
  const effectOptions = [
    { id: 'shine', name: 'Shine Effect', icon: Sparkles },
    { id: 'pulse', name: 'Pulse', icon: Zap },
    { id: 'refractor', name: 'Refractor', icon: Layers }
  ];

  return (
    <PageLayout
      title="Card Animation"
      description="Animated card effects and transitions"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Card Animation</h1>
        <p className="text-gray-600 mb-8">Apply visual effects to your cards and see them come to life</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Selection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg border mb-4">
              <h3 className="font-medium mb-4">Select a Card</h3>
              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {cards.slice(0, 8).map(card => (
                  <div 
                    key={card.id} 
                    className={`cursor-pointer border rounded-lg overflow-hidden
                      ${selectedCard?.id === card.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleCardSelect(card)}
                  >
                    <div className="h-32">
                      <CardMedia card={card} onView={() => {}} className="h-full" />
                    </div>
                  </div>
                ))}
              </div>
              
              {cards.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No cards found in your collection</p>
                  <Button onClick={() => navigate('/cards/create')}>
                    Create Your First Card
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Animation Preview */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="effects" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="effects">Effects</TabsTrigger>
                <TabsTrigger value="animations">Animations</TabsTrigger>
                <TabsTrigger value="transitions">Transitions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="effects" className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium mb-4">Visual Effects</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {effectOptions.map(effect => (
                      <Button
                        key={effect.id}
                        variant={activeEffect === effect.id ? "default" : "outline"}
                        onClick={() => setActiveEffect(effect.id)}
                        className="flex items-center gap-2"
                      >
                        <effect.icon className="h-4 w-4" />
                        {effect.name}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Effect Preview */}
                  <div className="aspect-[2.5/3.5] max-w-xs mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    {selectedCard ? (
                      <div className={`relative w-full h-full ${activeEffect === 'shine' ? 'bg-gradient-to-tr from-blue-50 to-white' : ''}`}>
                        <CardMedia 
                          card={selectedCard} 
                          onView={() => {}} 
                          className={`h-full ${activeEffect === 'pulse' ? 'animate-pulse' : ''}`} 
                        />
                        {activeEffect === 'refractor' && (
                          <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/10 to-purple-200/20 mix-blend-overlay" />
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-gray-500">Select a card to preview effects</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="animations" className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium mb-4">Animation Controls</h3>
                  <p className="text-gray-600">Customize how your cards animate when viewed</p>
                  
                  <div className="mt-8 text-center py-12">
                    <p className="text-gray-500">Coming soon! More animation options will be available in a future update.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="transitions" className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium mb-4">Transition Effects</h3>
                  <p className="text-gray-600">Control how cards transition between states</p>
                  
                  <div className="mt-8 text-center py-12">
                    <p className="text-gray-500">Coming soon! Transition effects will be available in a future update.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardAnimation;
