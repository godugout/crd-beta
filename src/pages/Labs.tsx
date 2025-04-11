
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Beaker, Lightbulb, Sparkles, MessageSquare } from 'lucide-react';

const Labs = () => {
  const labFeatures = [
    {
      id: 1,
      title: "AR Card Viewer",
      description: "See your cards come to life with augmented reality effects",
      icon: <Sparkles className="h-6 w-6 text-purple-500" />,
      status: "beta",
      link: "/ar-viewer"
    },
    {
      id: 2,
      title: "Card Animation Studio",
      description: "Create animated effects and transitions for your digital cards",
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      status: "alpha",
      link: "/animation-studio"
    },
    {
      id: 3,
      title: "Card Condition Detector",
      description: "AI-powered tool to analyze and grade physical card conditions",
      icon: <Beaker className="h-6 w-6 text-blue-500" />,
      status: "experimental",
      link: "/card-detector"
    },
    {
      id: 4,
      title: "Collection Comparison",
      description: "Compare your collection with others and find trade opportunities",
      icon: <Lightbulb className="h-6 w-6 text-green-500" />,
      status: "prototype",
      link: "/collection-compare"
    }
  ];

  return (
    <PageLayout
      title="Dugout Labs | CardShow"
      description="Preview experimental features and provide feedback"
    >
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dugout Labs</h1>
          <p className="text-muted-foreground mt-1">Preview experimental features and provide feedback to our team</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {labFeatures.map(feature => (
            <Card key={feature.id} className="overflow-hidden">
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
                <Button asChild>
                  <a href={feature.link}>Try It Out</a>
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feedback
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border">
          <h2 className="text-xl font-semibold mb-4">Submit Your Idea</h2>
          <p className="mb-6 text-muted-foreground">Have an idea for a new feature? We'd love to hear it!</p>
          <Button>
            <Lightbulb className="h-4 w-4 mr-2" />
            Submit Feature Idea
          </Button>
        </div>
      </Container>
    </PageLayout>
  );
};

export default Labs;
