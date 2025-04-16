
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Stars, Sparkles, Paintbrush, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LightbulbPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyEffect: (effect: string) => void;
}

const LightbulbPanel: React.FC<LightbulbPanelProps> = ({
  isOpen,
  onClose,
  onApplyEffect
}) => {
  const [previewEffect, setPreviewEffect] = useState<string | null>(null);

  if (!isOpen) return null;

  const effects = [
    {
      name: 'Holographic',
      icon: <Stars className="w-6 h-6" />,
      color: 'from-blue-400 to-purple-500'
    },
    {
      name: 'Refractor',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-green-400 to-emerald-500'
    },
    {
      name: 'Gold Foil',
      icon: <Paintbrush className="w-6 h-6" />,
      color: 'from-amber-400 to-yellow-500'
    },
    // Add more effects here
  ];

  const handleEffectClick = (effect: string) => {
    setPreviewEffect(effect);
    setTimeout(() => {
      onApplyEffect(effect);
      setPreviewEffect(null);
    }, 2000); // Duration of preview animation
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-background border-l shadow-lg p-4 animate-in slide-in-from-right">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-blue-500" />
          Visual Effects
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="grid grid-cols-3 gap-2 p-2">
          {effects.map((effect) => (
            <button
              key={effect.name}
              onClick={() => handleEffectClick(effect.name)}
              className={`
                aspect-square rounded-lg p-2
                bg-gradient-to-br ${effect.color}
                hover:scale-105 transition-transform
                flex items-center justify-center
                group relative
              `}
            >
              <div className="text-white transform group-hover:scale-110 transition-transform">
                {effect.icon}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      <AnimatePresence>
        {previewEffect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              className="w-64 h-96 relative"
              animate={{
                rotateY: [0, 360],
                transition: {
                  duration: 2,
                  ease: "easeInOut"
                }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg" />
              <div className="absolute inset-0 animate-pulse">
                {/* Trophy presentation effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                <div className="absolute inset-0 bg-[radial-gradient(closest-side,transparent,rgba(255,255,255,0.2))]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LightbulbPanel;
