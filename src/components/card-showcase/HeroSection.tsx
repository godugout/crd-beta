
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-blue-50 opacity-50 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Digital Card Collection
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create, collect, and showcase your trading cards with advanced AR features
            and stunning visual effects.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/editor')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create New Card
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/gallery')}
            >
              Browse Gallery
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -top-8 -right-8 w-48 h-48 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
    </section>
  );
};

export default HeroSection;
