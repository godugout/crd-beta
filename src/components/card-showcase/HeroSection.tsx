
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-litmus-purple-light/10 via-white to-litmus-teal-light/10 dark:from-litmus-purple-dark dark:via-litmus-gray-900 dark:to-litmus-gray-800 z-0"></div>
      
      {/* Decorative circles */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-litmus-purple/10 dark:bg-litmus-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-litmus-teal/10 dark:bg-litmus-teal/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-litmus-purple via-litmus-purple-secondary to-litmus-purple-tertiary dark:from-white dark:to-litmus-purple-light bg-clip-text text-transparent">
            Your Digital Card Collection
          </h1>
          
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed">
            Create, collect, and showcase your trading cards with advanced AR features
            and stunning visual effects.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/editor')}
              variant="gradient"
              className="h-12 px-8"
            >
              <PlusCircle className="mr-1 h-5 w-5" />
              Create New Card
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/gallery')}
              className="h-12 px-8 border-2"
            >
              <Search className="mr-1 h-5 w-5" />
              Browse Gallery
            </Button>
          </div>
        </div>
      </div>
      
      {/* Card preview mockup */}
      <div className="hidden md:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 w-full max-w-4xl z-0 opacity-50">
        <div className="grid grid-cols-3 gap-6">
          <div className="h-48 bg-white dark:bg-litmus-gray-800 rounded-lg shadow-xl transform -rotate-6"></div>
          <div className="h-64 bg-white dark:bg-litmus-gray-800 rounded-lg shadow-xl transform translate-y-8"></div>
          <div className="h-48 bg-white dark:bg-litmus-gray-800 rounded-lg shadow-xl transform rotate-6"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
