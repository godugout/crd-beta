
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Crop, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CardUpload from '@/components/card-upload/CardUpload';

interface UploadFlowProps {
  onSave: (cardData: any) => void;
  onBack: () => void;
  initialData?: any;
}

const UploadFlow: React.FC<UploadFlowProps> = ({ onSave, onBack, initialData }) => {
  const [step, setStep] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [cardData, setCardData] = useState({
    title: '',
    description: '',
    ...initialData
  });

  const steps = [
    { title: 'Upload Image', icon: Upload },
    { title: 'Crop & Adjust', icon: Crop },
    { title: 'Add Details', icon: Sparkles }
  ];

  const handleImageUpload = (file: File, previewUrl: string) => {
    setImageUrl(previewUrl);
    setStep(1);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleSave = () => {
    onSave({
      ...cardData,
      imageUrl,
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
          
          <div className="flex items-center gap-4">
            {steps.map((stepItem, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${index <= step ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}
                `}>
                  <stepItem.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${index < step ? 'bg-blue-500' : 'bg-white/20'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
          >
            {step === 0 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Upload Your Image</h2>
                <p className="text-gray-300 mb-6">
                  Drop your photo here and we'll help you turn it into a sick trading card
                </p>
                <CardUpload
                  onImageUpload={handleImageUpload}
                  className="w-full"
                />
              </div>
            )}

            {step === 1 && imageUrl && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Perfect Your Shot</h2>
                <p className="text-gray-300 mb-6">
                  Crop and adjust your image to look absolutely fire
                </p>
                <div className="aspect-[2.5/3.5] bg-gray-900 rounded-lg overflow-hidden mb-6">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <Button onClick={handleNext} className="w-full bg-blue-500 hover:bg-blue-600">
                  Looks Good!
                </Button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Add the Details</h2>
                <p className="text-gray-300 mb-6">
                  Give your card a name and description that hits different
                </p>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Card title (e.g. 'Beast Mode Activated')"
                    value={cardData.title}
                    onChange={(e) => setCardData({...cardData, title: e.target.value})}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  />
                  <textarea
                    placeholder="Description (optional but recommended for max vibes)"
                    value={cardData.description}
                    onChange={(e) => setCardData({...cardData, description: e.target.value})}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 h-32 resize-none"
                  />
                  <Button 
                    onClick={handleSave} 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold py-4"
                    disabled={!cardData.title.trim()}
                  >
                    Create Card 🔥
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
          >
            <h3 className="text-xl font-bold text-white mb-4">Live Preview</h3>
            <div className="aspect-[2.5/3.5] bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="Card preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="text-gray-400 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Upload an image to see preview</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UploadFlow;
