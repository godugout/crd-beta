
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Camera, Heart, Users } from 'lucide-react';

const OaklandHeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#006341] via-[#003831] to-[#002620]">
      {/* Background elements with Oakland colors */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#EFB21E]/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#EFB21E]/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#EFB21E]/20 text-[#EFB21E] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="h-4 w-4" />
            Oakland Sports Legacy Project
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Preserve Your
            <span className="block text-[#EFB21E]">Oakland Fan Story</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Your memories from the Coliseum, tailgates, and championship moments are part of Oakland's 
            sports history. Create lasting digital memories before they're lost forever.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/oakland/create')}
              className="h-12 px-8 bg-[#EFB21E] hover:bg-[#EFB21E]/90 text-[#003831] font-semibold"
            >
              <Camera className="mr-2 h-5 w-5" />
              Create a Memory
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/oakland/gallery')}
              className="h-12 px-8 border-2 border-white text-white hover:bg-white/10"
            >
              <Users className="mr-2 h-5 w-5" />
              Browse Community
            </Button>
          </div>
        </div>
      </div>
      
      {/* Oakland-themed visual elements */}
      <div className="hidden md:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 w-full max-w-4xl z-0 opacity-30">
        <div className="grid grid-cols-3 gap-6">
          <div className="h-48 bg-[#EFB21E]/20 rounded-lg shadow-xl transform -rotate-6 border border-[#EFB21E]/30"></div>
          <div className="h-64 bg-[#EFB21E]/20 rounded-lg shadow-xl transform translate-y-8 border border-[#EFB21E]/30"></div>
          <div className="h-48 bg-[#EFB21E]/20 rounded-lg shadow-xl transform rotate-6 border border-[#EFB21E]/30"></div>
        </div>
      </div>
    </section>
  );
};

export default OaklandHeroSection;
