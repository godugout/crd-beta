
import React from 'react';
import { Beaker, Sparkles, FlaskConical, Atom, TestTube, Wand, Zap, Flask } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { motion } from 'framer-motion';

interface LabFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  status: 'alpha' | 'beta' | 'concept';
  color: string;
}

const labFeatures: LabFeature[] = [
  {
    id: 'card-detection',
    title: 'AI Card Detection',
    description: 'Help train our AI to automatically detect and crop cards from images.',
    icon: Beaker,
    path: '/labs/card-detection',
    status: 'beta',
    color: 'bg-amber-500'
  },
  {
    id: 'pbr-rendering',
    title: 'PBR Card Rendering',
    description: 'Experience physically-based rendering for ultra-realistic digital cards.',
    icon: Sparkles,
    path: '/labs/pbr',
    status: 'alpha',
    color: 'bg-blue-500'
  },
  {
    id: 'signature-analyzer',
    title: 'Signature Analyzer',
    description: 'Analyze and authenticate player signatures using advanced pattern recognition.',
    icon: Wand,
    path: '/labs/signature',
    status: 'concept',
    color: 'bg-purple-500'
  },
  {
    id: 'group-memories',
    title: 'Group Memory Creator',
    description: 'Create shared memories with friends from group photos.',
    icon: FlaskConical,
    path: '/group-memory-creator',
    status: 'beta',
    color: 'bg-green-500'
  },
  {
    id: 'card-effects',
    title: 'Advanced Card Effects',
    description: 'Experiment with holographic, refractor, and other premium card effects.',
    icon: Atom,
    path: '/labs/effects',
    status: 'alpha',
    color: 'bg-pink-500'
  },
  {
    id: 'memorabilia-detection',
    title: 'Memorabilia Detection',
    description: 'AI-powered detection of sports memorabilia in images.',
    icon: TestTube,
    path: '/labs/memorabilia',
    status: 'concept',
    color: 'bg-indigo-500'
  }
];

// Helper function to get badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'alpha':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'beta':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'concept':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Labs = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-amber-100 rounded-full mb-4">
            <FlaskConical className="h-10 w-10 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Dugout Labs</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Experimental features and new technologies. Try them out and help shape the future of CardShow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                onClick={() => navigate(feature.path)}
              >
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-medium">{feature.title}</h3>
                    <Badge className={`ml-2 capitalize ${getStatusColor(feature.status)}`}>
                      {feature.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
                <div className="mt-auto p-4 border-t bg-gray-50 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Try it out</span>
                  <Button variant="ghost" size="sm">
                    <Zap className="h-4 w-4 mr-1" /> Explore
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Labs;
