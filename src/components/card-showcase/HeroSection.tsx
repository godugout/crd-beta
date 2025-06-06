
import React from 'react';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Sparkles, Zap, Star } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Enhanced background with gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)]"></div>
      
      {/* Animated gradient overlays */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-secondary)]/10 rounded-full blur-3xl animate-pulse-fast"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-[var(--brand-accent)]/15 to-[var(--brand-warning)]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-[var(--brand-success)]/10 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Enhanced hero typography */}
          <div className="mb-8">
            <h1 className="text-7xl md:text-8xl font-black text-white mb-6 tracking-tight leading-none">
              Cards Rendered
              <span className="block text-brand-gradient bg-clip-text text-transparent animate-gradient-shift">
                Digitally™
              </span>
            </h1>
            
            {/* Subtitle with better hierarchy */}
            <p className="text-2xl md:text-3xl text-[var(--text-secondary)] mb-4 font-semibold">
              Your CRD Collection
            </p>
            <p className="text-xl text-[var(--text-tertiary)] max-w-3xl mx-auto leading-relaxed">
              Transform ordinary cards into extraordinary digital experiences with advanced AR features, 
              stunning visual effects, and professional-grade creation tools.
            </p>
          </div>
          
          {/* Enhanced CTA buttons */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <div className="relative group">
              <CrdButton 
                size="lg" 
                onClick={() => navigate('/cards/create')}
                variant="spectrum"
                className="btn-sharp font-bold px-10 py-4 text-lg shadow-[var(--shadow-brand)]"
              >
                <PlusCircle className="mr-2 h-6 w-6" />
                Create New Card
              </CrdButton>
              {/* Sharp accent corner */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-warning)] clip-corner-tr opacity-90 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            <Button 
              variant="glass" 
              size="lg"
              onClick={() => navigate('/gallery')}
              className="font-bold px-10 py-4 text-lg border-2 border-[var(--border-highlight)] hover:border-[var(--border-glow)] hover:shadow-[var(--shadow-md)]"
            >
              <Search className="mr-2 h-6 w-6" />
              Browse Gallery
            </Button>
          </div>
          
          {/* Enhanced feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* AI-Powered Creation */}
            <div className="group">
              <div className="bento-card brand-card-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] clip-corner-tr"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">AI-Powered Creation</h3>
                  <p className="text-[var(--text-tertiary)] leading-relaxed">Smart detection, enhancement, and professional effects powered by advanced AI</p>
                </div>
              </div>
            </div>

            {/* 3D Experiences */}
            <div className="group">
              <div className="bento-card brand-card-accent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-warning)] clip-corner-tr"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-warning)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Immersive 3D</h3>
                  <p className="text-[var(--text-tertiary)] leading-relaxed">Experience your cards in stunning 3D with realistic physics and lighting</p>
                </div>
              </div>
            </div>

            {/* Community */}
            <div className="group">
              <div className="bento-card relative overflow-hidden bg-gradient-to-br from-[var(--brand-success)]/10 to-[var(--brand-success)]/5 border border-[var(--brand-success)]/20 hover:border-[var(--brand-success)]/40">
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[var(--brand-success)] to-[var(--brand-primary)] clip-corner-tr"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-[var(--brand-success)] to-[var(--brand-primary)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Vibrant Community</h3>
                  <p className="text-[var(--text-tertiary)] leading-relaxed">Share, discover, and connect with creators and collectors worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
