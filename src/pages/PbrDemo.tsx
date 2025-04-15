
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PbrCardRenderer from '@/components/pbr/PbrCardRenderer';

const PbrDemo = () => {
  return (
    <PageLayout
      title="PBR Demo"
      description="Physically Based Rendering demonstration"
    >
      <Container className="pt-24 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">PBR Card Rendering</h1>
          <p className="text-muted-foreground mt-2">
            Experience your cards with realistic materials and lighting using physically-based rendering
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Card Material Demo</CardTitle>
            <CardDescription>
              Interact with the 3D card and adjust material properties in the settings tab
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <PbrCardRenderer />
          </CardContent>
        </Card>
        
        <div className="mt-8 bg-muted/50 p-6 rounded-lg">
          <h2 className="text-xl font-medium mb-2">About Physically Based Rendering</h2>
          <p className="text-muted-foreground">
            PBR simulates how light interacts with different materials in a physically accurate way. 
            This creates more realistic visuals with proper reflections, metallic surfaces, and lighting effects.
          </p>
        </div>
      </Container>
    </PageLayout>
  );
};

export default PbrDemo;
