
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, Crop, Sparkles, Maximize2, RotateCw, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CardUpload from '@/components/card-upload/CardUpload';
import ImageEditor from '@/components/card-upload/ImageEditor';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';

interface UploadFlowProps {
  onSave: (cardData: any) => void;
  onBack: () => void;
  initialData?: any;
}

const UploadFlow: React.FC<UploadFlowProps> = ({ onSave, onBack, initialData }) => {
  const [step, setStep] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [cardData, setCardData] = useState({
    title: '',
    description: '',
    ...initialData
  });

  const steps = [
    { title: 'Upload Image', icon: Upload },
    { title: 'Crop & Extract', icon: Crop },
    { title: 'Add Details', icon: Sparkles }
  ];

  const handleImageUpload = (file: File, previewUrl: string) => {
    setImageUrl(previewUrl);
    setCurrentFile(file);
    setStep(1);
    setShowEditor(true);
  };

  const handleCropComplete = (file: File, url: string, memorabiliaType?: MemorabiliaType, metadata?: any) => {
    setImageUrl(url);
    setCurrentFile(file);
    setShowEditor(false);
    
    // Auto-populate metadata if available
    if (metadata) {
      setCardData(prev => ({
        ...prev,
        title: metadata.title || prev.title,
        description: metadata.description || prev.description,
        player: metadata.player || prev.player,
        team: metadata.team || prev.team,
        year: metadata.year || prev.year
      }));
    }
    
    setStep(2);
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

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <h2 className="text-3xl font-bold text-white mb-4">Upload Your Image</h2>
                <p className="text-gray-300 mb-6">
                  Drop your photo here and we'll help you extract the perfect card
                </p>
                <CardUpload
                  onImageUpload={handleImageUpload}
                  className="w-full"
                />
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <h3 className="text-xl font-bold text-white mb-4">Tips for Best Results</h3>
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">1</div>
                    <div>
                      <p className="font-medium text-white">Good Lighting</p>
                      <p className="text-sm">Make sure your card is well-lit with minimal shadows</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">2</div>
                    <div>
                      <p className="font-medium text-white">Clear Focus</p>
                      <p className="text-sm">Ensure the card text and details are sharp and readable</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">3</div>
                    <div>
                      <p className="font-medium text-white">Full Card Visible</p>
                      <p className="text-sm">Include the entire card with some background space</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="crop"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Extract Your Card</h2>
                <p className="text-gray-300">
                  Our AI detected the card in your image. Adjust the selection if needed.
                </p>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
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
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                  <textarea
                    placeholder="Description (optional but recommended for max vibes)"
                    value={cardData.description}
                    onChange={(e) => setCardData({...cardData, description: e.target.value})}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 h-32 resize-none focus:border-blue-500 focus:outline-none"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Player name"
                      value={cardData.player || ''}
                      onChange={(e) => setCardData({...cardData, player: e.target.value})}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Team"
                      value={cardData.team || ''}
                      onChange={(e) => setCardData({...cardData, team: e.target.value})}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSave} 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold py-4 text-lg"
                    disabled={!cardData.title.trim()}
                  >
                    Create Card 🔥
                  </Button>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <h3 className="text-xl font-bold text-white mb-4">Live Preview</h3>
                <div className="aspect-[2.5/3.5] bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Card preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Upload className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                </div>
                
                {cardData.title && (
                  <div className="mt-4 p-4 bg-white/10 rounded-lg">
                    <h4 className="text-white font-semibold">{cardData.title}</h4>
                    {cardData.description && (
                      <p className="text-gray-300 text-sm mt-1">{cardData.description}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      {cardData.player && (
                        <Badge variant="outline" className="bg-blue-500/20 border-blue-500/50 text-blue-200">
                          {cardData.player}
                        </Badge>
                      )}
                      {cardData.team && (
                        <Badge variant="outline" className="bg-purple-500/20 border-purple-500/50 text-purple-200">
                          {cardData.team}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ImageEditor
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        editorImage={imageUrl}
        currentFile={currentFile}
        onCropComplete={handleCropComplete}
        autoEnhance={true}
      />
    </div>
  );
};

export default UploadFlow;
