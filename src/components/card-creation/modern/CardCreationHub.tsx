
import React, { useState } from 'react';
import { ArrowLeft, Upload, Wand2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UploadFlow from './flows/UploadFlow';
import CreateFlow from './flows/CreateFlow';

interface CardCreationHubProps {
  onSave: (cardData: any) => void;
  isEditing?: boolean;
  initialData?: any;
}

const CardCreationHub: React.FC<CardCreationHubProps> = ({
  onSave,
  isEditing = false,
  initialData
}) => {
  const [currentFlow, setCurrentFlow] = useState<'home' | 'upload' | 'create'>('home');

  const handleBack = () => {
    if (currentFlow === 'home') {
      window.history.back();
    } else {
      setCurrentFlow('home');
    }
  };

  if (currentFlow === 'upload') {
    return (
      <UploadFlow
        onSave={onSave}
        onBack={handleBack}
        initialData={initialData}
      />
    );
  }

  if (currentFlow === 'create') {
    return (
      <CreateFlow
        onSave={onSave}
        onBack={handleBack}
        initialData={initialData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0B] via-[#111115] to-[#1A1A20]">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
            <div className="h-6 w-px bg-white/10" />
            <h1 className="text-xl font-bold text-white">Create Card</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
              Create Your
              <span className="block bg-gradient-to-r from-[#4F87FF] via-[#00D4FF] to-[#4F87FF] bg-clip-text text-transparent">
                Digital Card
              </span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Transform your photos into stunning digital collectibles with AI-powered tools and professional effects
            </p>
          </div>

          {/* Creation Options */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Flow Card */}
            <div 
              onClick={() => setCurrentFlow('upload')}
              className="group cursor-pointer"
            >
              <div className="bg-gradient-to-br from-[#4F87FF]/10 to-[#00D4FF]/5 border border-[#4F87FF]/20 rounded-2xl p-8 transition-all duration-300 hover:border-[#4F87FF]/40 hover:shadow-2xl hover:shadow-[#4F87FF]/10 hover:scale-[1.02] relative overflow-hidden">
                {/* Sharp accent corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#4F87FF] to-[#00D4FF] clip-path-[polygon(100%_0,0_0,100%_100%)]"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4F87FF] to-[#00D4FF] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">Upload & Enhance</h3>
                  <p className="text-white/60 mb-6 leading-relaxed">
                    Upload your photo and let our AI extract, enhance, and transform it into a professional digital card
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-[#4F87FF]/20 border border-[#4F87FF]/30 rounded text-[#4F87FF] text-sm font-medium">AI Detection</span>
                    <span className="px-3 py-1 bg-[#00D4FF]/20 border border-[#00D4FF]/30 rounded text-[#00D4FF] text-sm font-medium">Auto Enhance</span>
                    <span className="px-3 py-1 bg-[#4F87FF]/20 border border-[#4F87FF]/30 rounded text-[#4F87FF] text-sm font-medium">Pro Effects</span>
                  </div>
                  
                  <div className="flex items-center text-[#4F87FF] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Start Uploading
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </div>
                </div>
              </div>
            </div>

            {/* Template Flow Card */}
            <div 
              onClick={() => setCurrentFlow('create')}
              className="group cursor-pointer"
            >
              <div className="bg-gradient-to-br from-[#FF6B9D]/10 to-[#FF8A4C]/5 border border-[#FF6B9D]/20 rounded-2xl p-8 transition-all duration-300 hover:border-[#FF6B9D]/40 hover:shadow-2xl hover:shadow-[#FF6B9D]/10 hover:scale-[1.02] relative overflow-hidden">
                {/* Sharp accent corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#FF6B9D] to-[#FF8A4C] clip-path-[polygon(100%_0,0_0,100%_100%)]"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B9D] to-[#FF8A4C] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Wand2 className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">Design from Scratch</h3>
                  <p className="text-white/60 mb-6 leading-relaxed">
                    Choose from premium templates and create your card step-by-step with our guided design tools
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-[#FF6B9D]/20 border border-[#FF6B9D]/30 rounded text-[#FF6B9D] text-sm font-medium">Templates</span>
                    <span className="px-3 py-1 bg-[#FF8A4C]/20 border border-[#FF8A4C]/30 rounded text-[#FF8A4C] text-sm font-medium">Custom Design</span>
                    <span className="px-3 py-1 bg-[#FF6B9D]/20 border border-[#FF6B9D]/30 rounded text-[#FF6B9D] text-sm font-medium">Pro Tools</span>
                  </div>
                  
                  <div className="flex items-center text-[#FF6B9D] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Start Creating
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Powered by Advanced AI
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00F5A0] to-[#00D4AA] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Smart Detection</h3>
                <p className="text-white/60 text-sm">Automatically detects and extracts cards from photos</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFE45E] to-[#FF9A4C] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Enhancement</h3>
                <p className="text-white/60 text-sm">Improves image quality with professional-grade processing</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#B794F6] to-[#9F7AEA] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Instant Results</h3>
                <p className="text-white/60 text-sm">See your card come to life in real-time 3D</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreationHub;
