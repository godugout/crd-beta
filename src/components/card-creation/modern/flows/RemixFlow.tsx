
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shuffle, Zap, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RemixFlowProps {
  onSave: (cardData: any) => void;
  onBack: () => void;
  initialData?: any;
}

const RemixFlow: React.FC<RemixFlowProps> = ({ onSave, onBack, initialData }) => {
  const [isRemixing, setIsRemixing] = useState(false);
  const [currentRemix, setCurrentRemix] = useState<any>(null);

  const remixElements = {
    backgrounds: ['🌟', '🔥', '⚡', '🌊', '🎨', '🎭', '🚀', '💎'],
    frames: ['Classic', 'Holographic', 'Neon', 'Vintage', 'Cyber', 'Graffiti'],
    effects: ['Sparkle', 'Glitch', 'Rainbow', 'Neon Glow', 'Retro', 'Matrix'],
    titles: ['Beast Mode', 'Legendary', 'Epic Fail', 'No Cap', 'Fire Alert', 'Chaos Mode', 'Vibe Check', 'Main Character'],
    adjectives: ['Absolutely', 'Completely', 'Totally', 'Utterly', 'Ridiculously', 'Suspiciously', 'Mysteriously', 'Definitely']
  };

  const generateRemix = () => {
    setIsRemixing(true);
    
    setTimeout(() => {
      const remix = {
        background: remixElements.backgrounds[Math.floor(Math.random() * remixElements.backgrounds.length)],
        frame: remixElements.frames[Math.floor(Math.random() * remixElements.frames.length)],
        effect: remixElements.effects[Math.floor(Math.random() * remixElements.effects.length)],
        title: `${remixElements.adjectives[Math.floor(Math.random() * remixElements.adjectives.length)]} ${remixElements.titles[Math.floor(Math.random() * remixElements.titles.length)]}`,
        id: Date.now()
      };
      
      setCurrentRemix(remix);
      setIsRemixing(false);
    }, 2000);
  };

  useEffect(() => {
    generateRemix();
  }, []);

  const handleSave = () => {
    onSave({
      ...currentRemix,
      type: 'remix',
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            AI Remix Generator
          </h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-black text-white mb-4">
              Chaos Mode Activated 🎲
            </h2>
            <p className="text-xl text-gray-300">
              Let our AI create the most unhinged card combinations possible
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
            >
              <AnimatePresence mode="wait">
                {isRemixing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-20"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 mx-auto mb-4"
                    >
                      <Shuffle className="w-full h-full text-orange-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Cooking up chaos...</h3>
                    <p className="text-gray-300">The AI is getting creative 👨‍🍳</p>
                  </motion.div>
                ) : currentRemix ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="aspect-[2.5/3.5] bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 mb-6 relative overflow-hidden">
                      <div className="text-6xl mb-4 text-center">{currentRemix.background}</div>
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">{currentRemix.title}</h3>
                        <p className="text-sm text-orange-200">{currentRemix.frame} Frame</p>
                        <p className="text-sm text-orange-200">{currentRemix.effect} Effect</p>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    </div>
                    
                    <div className="space-y-3">
                      <Button
                        onClick={generateRemix}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 flex items-center gap-2"
                      >
                        <Shuffle className="w-4 h-4" />
                        Remix Again
                      </Button>
                      
                      <Button
                        onClick={handleSave}
                        variant="outline"
                        className="w-full border-green-500/50 text-green-400 hover:bg-green-500/20 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Save This Chaos
                      </Button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">How Remix Works</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Random Everything</h4>
                    <p className="text-gray-300 text-sm">
                      Our AI randomly combines frames, effects, titles, and elements for maximum chaos
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shuffle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Infinite Possibilities</h4>
                    <p className="text-gray-300 text-sm">
                      Keep hitting remix until you find something that makes you laugh
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Save the Good Ones</h4>
                    <p className="text-gray-300 text-sm">
                      When you find a combination that hits different, save it and share the vibes
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-orange-200 text-sm">
                  💡 <strong>Pro tip:</strong> The weirder the combination, the more legendary the card becomes
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemixFlow;
