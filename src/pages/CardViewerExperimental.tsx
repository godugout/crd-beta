
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PbrCardRenderer from '@/components/pbr/PbrCardRenderer';
import { useParams } from 'react-router-dom';

const CardViewerExperimental = () => {
  const [activeTab, setActiveTab] = useState('pbr');
  const { id } = useParams();
  
  return (
    <PageLayout
      title="Card Viewer Lab | CardShow"
      description="Experimental card viewing features"
    >
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Card Viewer Lab</h1>
          <p className="text-muted-foreground mt-1">
            Experimental advanced card viewing technology
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="pbr">PBR Rendering</TabsTrigger>
            <TabsTrigger value="ar">AR Preview</TabsTrigger>
            <TabsTrigger value="animation">Animation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pbr" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Physically Based Rendering (PBR)</CardTitle>
                <CardDescription>
                  Experience cards with realistic materials and lighting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PbrCardRenderer cardId={id} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ar" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Augmented Reality Preview</CardTitle>
                <CardDescription>
                  View your cards in augmented reality
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-10 text-center">
                  <div className="text-gray-500 mb-4">
                    AR functionality will be available soon.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="animation" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Card Animation Studio</CardTitle>
                <CardDescription>
                  Create custom animations for your cards
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-10 text-center">
                  <div className="text-gray-500 mb-4">
                    Animation tools will be available soon.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </PageLayout>
  );
};

export default CardViewerExperimental;
