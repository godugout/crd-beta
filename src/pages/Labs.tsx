
import React, { Suspense, useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Beaker, Lightbulb, Sparkles, MessageSquare, ArrowLeft } from 'lucide-react';
import { CardEnhancedProvider } from '@/context/CardEnhancedContext';
import CardDetectorPage from '@/components/card-detector/CardDetectorPage';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="h-10 w-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
      <p>Loading Dugout Labs...</p>
    </div>
  </div>
);

const Labs = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const labFeatures = [
    {
      id: 'card-detector',
      title: "Card Detection & Cropping",
      description: "AI-powered tool to automatically detect and crop trading cards from images",
      icon: <Beaker className="h-6 w-6 text-blue-500" />,
      status: "experimental",
      component: CardDetectorPage
    },
    {
      id: 'ar-viewer',
      title: "AR Card Viewer",
      description: "See your cards come to life with augmented reality effects",
      icon: <Sparkles className="h-6 w-6 text-purple-500" />,
      status: "beta",
      link: "/ar-card-viewer"
    },
    {
      id: 'animation-studio',
      title: "Card Animation Studio",
      description: "Create animated effects and transitions for your digital cards",
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      status: "alpha",
      link: "/features/animation"
    },
    {
      id: 'collection-comparison',
      title: "Collection Comparison",
      description: "Compare your collection with others and find trade opportunities",
      icon: <Lightbulb className="h-6 w-6 text-green-500" />,
      status: "prototype",
      link: "/collections"
    }
  ];

  // If an active feature is selected, render it
  if (activeFeature) {
    const feature = labFeatures.find(f => f.id === activeFeature);
    if (feature && feature.component) {
      const FeatureComponent = feature.component;
      return (
        <CardEnhancedProvider>
          <PageLayout
            title={`${feature.title} | Dugout Labs`}
            description={feature.description}
          >
            <div className="min-h-screen bg-background">
              <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-gray-700 p-4">
                <Container>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      onClick={() => setActiveFeature(null)}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Labs
                    </Button>
                    <div>
                      <h1 className="text-xl font-semibold text-foreground">{feature.title}</h1>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <Badge 
                      variant={feature.status === 'beta' ? 'default' : 'outline'}
                      className={feature.status === 'experimental' ? 'bg-purple-500' : ''}
                    >
                      {feature.status}
                    </Badge>
                  </div>
                </Container>
              </div>
              <FeatureComponent />
            </div>
          </PageLayout>
        </CardEnhancedProvider>
      );
    }
  }

  // Default Labs overview page
  return (
    <CardEnhancedProvider>
      <PageLayout
        title="Dugout Labs | CardShow"
        description="Preview experimental features and provide feedback"
      >
        <Container className="py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dugout Labs</h1>
            <p className="text-muted-foreground mt-1">Preview experimental features and provide feedback to our team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {labFeatures.map(feature => (
              <Card key={feature.id} className="overflow-hidden dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    {feature.icon}
                    <Badge 
                      variant={feature.status === 'beta' ? 'default' : 'outline'}
                      className={feature.status === 'experimental' ? 'bg-purple-500' : ''}
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Button 
                    onClick={() => {
                      if (feature.component) {
                        setActiveFeature(feature.id);
                      } else if (feature.link) {
                        window.location.href = feature.link;
                      }
                    }}
                  >
                    Try It Out
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Feedback
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Submit Your Idea</h2>
            <p className="mb-6 text-muted-foreground">Have an idea for a new feature? We'd love to hear it!</p>
            <Button>
              <Lightbulb className="h-4 w-4 mr-2" />
              Submit Feature Idea
            </Button>
          </div>
        </Container>
      </PageLayout>
    </CardEnhancedProvider>
  );
};

export default Labs;
