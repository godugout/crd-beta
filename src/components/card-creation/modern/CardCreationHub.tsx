
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Shuffle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UploadFlow from './flows/UploadFlow';
import CreateFlow from './flows/CreateFlow';
import RemixFlow from './flows/RemixFlow';

type CreationMode = 'hub' | 'upload' | 'create' | 'remix';

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
  const [mode, setMode] = useState<CreationMode>('hub');

  const creationOptions = [
    {
      id: 'upload',
      title: 'Upload & Style',
      description: 'Start with your photo and transform it into a collectible card',
      icon: Upload,
      color: 'from-blue-500 to-cyan-400',
      accent: 'border-blue-500/30 bg-blue-500/10',
      emoji: '📸'
    },
    {
      id: 'create',
      title: 'Design from Scratch',
      description: 'Choose templates, add layers, and craft your perfect card',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-400',
      accent: 'border-purple-500/30 bg-purple-500/10',
      emoji: '✨'
    },
    {
      id: 'remix',
      title: 'AI Remix',
      description: 'Let our AI create wild combinations for hilarious results',
      icon: Shuffle,
      color: 'from-orange-500 to-red-400',
      accent: 'border-orange-500/30 bg-orange-500/10',
      emoji: '🎲'
    }
  ];

  const handleModeSelect = (selectedMode: CreationMode) => {
    setMode(selectedMode);
  };

  const handleBack = () => {
    setMode('hub');
  };

  if (mode === 'upload') {
    return <UploadFlow onSave={onSave} onBack={handleBack} initialData={initialData} />;
  }

  if (mode === 'create') {
    return <CreateFlow onSave={onSave} onBack={handleBack} initialData={initialData} />;
  }

  if (mode === 'remix') {
    return <RemixFlow onSave={onSave} onBack={handleBack} initialData={initialData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
            Create Epic Cards
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose your creation style and make cards that slap different
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {creationOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => handleModeSelect(option.id as CreationMode)}
            >
              <div className={`
                relative p-8 rounded-3xl border backdrop-blur-xl transition-all duration-500
                bg-gradient-to-br from-white/5 to-white/10 border-white/20
                group-hover:${option.accent} group-hover:shadow-2xl group-hover:shadow-white/10
              `}>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                     style={{
                       background: `linear-gradient(135deg, ${option.color.split(' ')[1]}, ${option.color.split(' ')[3]})`
                     }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl">{option.emoji}</div>
                    <option.icon className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                    {option.title}
                  </h3>
                  
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors leading-relaxed">
                    {option.description}
                  </p>
                  
                  <div className="mt-6">
                    <Button 
                      className={`
                        w-full bg-gradient-to-r ${option.color} text-white font-semibold py-3
                        transform transition-all duration-300 group-hover:scale-105
                        shadow-lg group-hover:shadow-xl
                      `}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 text-sm">
            Pro tip: Each path creates different vibes - experiment to find your style! 🔥
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CardCreationHub;
