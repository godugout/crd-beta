
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2, Palette, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const CardWizardIntro = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-bold">
          Create a <span className="text-litmus-green">CRD</span> in 5 Simple Steps
        </h1>
        <p className="text-gray-600 mt-2">
          Our wizard will guide you through creating your own digital trading card with custom effects
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="bg-litmus-green/10 p-3 rounded-full mb-3">
              <Upload className="h-6 w-6 text-litmus-green" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload Image</h3>
            <p className="text-sm text-gray-500">
              Upload a photo or scan of your physical card to digitize it
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="bg-litmus-green/10 p-3 rounded-full mb-3">
              <Palette className="h-6 w-6 text-litmus-green" />
            </div>
            <h3 className="text-lg font-medium mb-2">Customize Design</h3>
            <p className="text-sm text-gray-500">
              Enhance your card with borders, backgrounds and custom colors
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="bg-litmus-green/10 p-3 rounded-full mb-3">
              <Sparkles className="h-6 w-6 text-litmus-green" />
            </div>
            <h3 className="text-lg font-medium mb-2">Add Effects</h3>
            <p className="text-sm text-gray-500">
              Apply special effects like holo, refractor, chrome and more
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          onClick={() => navigate('/card-creator')}
          className="px-6"
          size="lg"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          Start Creating
        </Button>
      </div>
    </div>
  );
};

export default CardWizardIntro;
