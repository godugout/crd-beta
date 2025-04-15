
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Beaker, 
  Camera, 
  Layers, 
  Orbit, 
  Pencil, 
  PencilRuler, 
  RotateCw, 
  Shirt, 
  SparkleIcon, 
  Wand2 
} from 'lucide-react';

interface LabFeature {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.FC<{ className?: string }>;
  status: 'stable' | 'experimental' | 'in-development';
}

const Labs = () => {
  const navigate = useNavigate();
  
  const labFeatures: LabFeature[] = [
    {
      id: 'card-detector',
      title: 'Card Detector',
      description: 'Advanced image processing to detect and extract cards from photos',
      path: '/labs/detector',
      icon: Camera,
      status: 'stable'
    },
    {
      id: 'pbr-rendering',
      title: 'PBR Rendering',
      description: 'Physically-based rendering for realistic card materials and lighting',
      path: '/labs/pbr',
      icon: Orbit,
      status: 'experimental'
    },
    {
      id: 'signature-analyzer',
      title: 'Signature Analyzer',
      description: 'AI-powered tool to verify and authenticate player signatures',
      path: '/labs/signature',
      icon: Pencil,
      status: 'experimental'
    },
    {
      id: 'card-animation',
      title: 'Card Animations',
      description: 'Dynamic card effects and transitions for enhanced viewing',
      path: '/labs/animation',
      icon: RotateCw,
      status: 'stable'
    },
    {
      id: 'uniforms',
      title: 'Uniform Texture Demo',
      description: 'Generate texture maps from uniform patterns and designs',
      path: '/labs/uniforms',
      icon: Shirt,
      status: 'experimental'
    },
    {
      id: 'card-creator',
      title: 'Advanced Card Creator',
      description: 'Professional-grade tools for creating custom digital cards',
      path: '/labs/card-creator',
      icon: Wand2,
      status: 'stable'
    },
    {
      id: 'showcase',
      title: 'Card Showcase',
      description: 'Interactive showcase featuring card design variations and effects',
      path: '/labs/showcase',
      icon: SparkleIcon,
      status: 'stable'
    }
  ];

  const getStatusColor = (status: LabFeature['status']) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-800';
      case 'experimental': return 'bg-amber-100 text-amber-800';
      case 'in-development': return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <PageLayout
      title="Dugout Labs"
      description="Experimental features and innovations for digital card enthusiasts"
    >
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-10">
          <div className="md:w-2/3">
            <div className="flex items-center gap-3 mb-4">
              <Beaker className="h-8 w-8 text-amber-500" />
              <h1 className="text-3xl font-bold">Dugout Labs</h1>
            </div>
            <p className="text-lg text-muted-foreground mb-4">
              Welcome to our innovation playground where we experiment with cutting-edge features
              for digital card collecting. Try out these experimental tools and let us know what you think!
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="bg-amber-100 text-amber-800 px-3 py-1 text-sm rounded-full font-medium">Experimental</div>
              <div className="bg-green-100 text-green-800 px-3 py-1 text-sm rounded-full font-medium">Stable</div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full font-medium">In Development</div>
            </div>
          </div>
          
          <div className="md:w-1/3 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
            <h3 className="font-medium mb-2">About Labs Features</h3>
            <p className="text-sm text-muted-foreground">
              Labs features are experimental and may change or be removed at any time.
              We welcome your feedback to help us improve these innovations.
            </p>
            <Button variant="outline" className="mt-4 w-full" onClick={() => navigate('/features/developer')}>
              Developer Documentation
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labFeatures.map((feature) => (
            <Card key={feature.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <feature.icon className="h-10 w-10 text-primary p-1.5 bg-primary/10 rounded-lg" />
                  <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(feature.status)}`}>
                    {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
                  </div>
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" onClick={() => navigate(feature.path)}>
                  Try It <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          <Card className="border-dashed">
            <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[220px]">
              <Beaker className="h-10 w-10 mb-4 text-muted-foreground" />
              <CardTitle className="text-center mb-2">Have an idea?</CardTitle>
              <CardDescription className="text-center">
                We're always looking for new experimental features to add to Labs
              </CardDescription>
              <Button variant="outline" className="mt-6">
                Submit Feature Idea
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Labs;
