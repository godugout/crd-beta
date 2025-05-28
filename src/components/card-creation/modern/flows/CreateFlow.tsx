
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Layout, Layers, Type, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreateFlowProps {
  onSave: (cardData: any) => void;
  onBack: () => void;
  initialData?: any;
}

const CreateFlow: React.FC<CreateFlowProps> = ({ onSave, onBack, initialData }) => {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const steps = [
    { title: 'Choose Template', icon: Layout },
    { title: 'Add Layers', icon: Layers },
    { title: 'Typography', icon: Type },
    { title: 'Final Touch', icon: Sparkles }
  ];

  const templates = [
    { id: 'sport-classic', name: 'Classic Sports', preview: '⚾', color: 'from-blue-500 to-indigo-600' },
    { id: 'holographic', name: 'Holographic', preview: '✨', color: 'from-purple-500 to-pink-500' },
    { id: 'vintage', name: 'Vintage Vibes', preview: '📸', color: 'from-amber-500 to-orange-500' },
    { id: 'futuristic', name: 'Cyber Future', preview: '🤖', color: 'from-cyan-500 to-blue-500' },
    { id: 'minimalist', name: 'Clean & Simple', preview: '⬜', color: 'from-gray-500 to-slate-600' },
    { id: 'graffiti', name: 'Street Art', preview: '🎨', color: 'from-red-500 to-pink-500' }
  ];

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
          
          <div className="flex items-center gap-4">
            {steps.map((stepItem, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${index <= step ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}
                `}>
                  <stepItem.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${index < step ? 'bg-purple-500' : 'bg-white/20'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Template</h2>
            <p className="text-gray-300 mb-8">Pick a style that matches your vibe</p>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`
                    cursor-pointer p-6 rounded-2xl border-2 transition-all
                    ${selectedTemplate === template.id 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                    }
                  `}
                >
                  <div className={`
                    w-full aspect-[2.5/3.5] rounded-lg mb-4 flex items-center justify-center text-4xl
                    bg-gradient-to-br ${template.color}
                  `}>
                    {template.preview}
                  </div>
                  <h3 className="text-white font-semibold text-center">{template.name}</h3>
                </motion.div>
              ))}
            </div>

            {selectedTemplate && (
              <div className="mt-8 text-center">
                <Button 
                  onClick={() => setStep(1)}
                  className="bg-purple-500 hover:bg-purple-600 px-8 py-3"
                >
                  Continue with Template
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {step > 0 && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-white mb-4">Coming Soon!</h2>
            <p className="text-gray-300 mb-8">This step is still in development. For now, let's create your card!</p>
            <Button 
              onClick={() => onSave({ template: selectedTemplate, createdAt: new Date().toISOString() })}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Create Card
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateFlow;
