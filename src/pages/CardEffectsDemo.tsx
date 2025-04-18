
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardEffectsGallery from '@/components/card-effects/CardEffectsGallery';

const demoCard = {
  id: 'demo-card-1',
  title: 'Demo Card',
  description: 'This is a demonstration of the card effects system',
  imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
  thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200',
  tags: ['Demo', 'Effects', 'Interactive'],
  userId: 'demo-user',
  player: 'Demo Player',
  team: 'All Stars',
  year: '2025',
  effects: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  designMetadata: {
    cardStyle: {
      template: 'standard',
      effect: 'holographic',
      borderRadius: '12px',
      borderColor: '#000000',
      shadowColor: '#000000',
      frameWidth: 10,
      frameColor: '#FFFFFF'
    },
    textStyle: {
      titleColor: '#FFFFFF',
      titleAlignment: 'center',
      titleWeight: 'bold',
      descriptionColor: '#CCCCCC'
    },
    cardMetadata: {
      category: 'demo',
      series: 'tutorial',
      cardType: 'player'
    },
    marketMetadata: {
      isPrintable: true,
      isForSale: false,
      includeInCatalog: true
    }
  }
};

const CardEffectsDemo: React.FC = () => {
  return (
    <PageLayout
      title="Card Effects Demo"
      description="Explore various special effects for your digital cards"
    >
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Card Effects System</CardTitle>
            <CardDescription>
              Interact with the card to see how the effects respond to movement. 
              Try enabling multiple effects to see how they combine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="demo">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="demo">Interactive Demo</TabsTrigger>
                <TabsTrigger value="reference">Effect Reference</TabsTrigger>
              </TabsList>
              <TabsContent value="demo" className="mt-4">
                <CardEffectsGallery card={demoCard} />
              </TabsContent>
              <TabsContent value="reference">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {['Holographic', 'Refractor', 'Vintage', 'Gold Foil', 'Prismatic'].map((effect) => (
                    <div key={effect} className="relative aspect-[3/4]">
                      <div className={`w-full h-full rounded-lg overflow-hidden effect-${effect.toLowerCase().replace(' ', '')}`}>
                        <img 
                          src={demoCard.imageUrl} 
                          alt={effect} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <h3 className="text-white font-bold">{effect} Effect</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CardEffectsDemo;
