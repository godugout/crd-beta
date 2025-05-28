
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import CardUpload from '@/components/card-upload/CardUpload';

interface UploadFlowProps {
  onSave: (cardData: any) => void;
  onBack: () => void;
  initialData?: any;
}

const UploadFlow: React.FC<UploadFlowProps> = ({
  onSave,
  onBack,
  initialData
}) => {
  const [cardData, setCardData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    player: initialData?.player || '',
    team: initialData?.team || '',
    year: initialData?.year || '',
    ...initialData
  });

  const handleImageUpload = (file: File, previewUrl: string) => {
    setCardData(prev => ({
      ...prev,
      imageUrl: previewUrl,
      file
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!cardData.imageUrl) {
      return;
    }
    
    onSave(cardData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Upload & Style</h1>
            <p className="text-gray-300">Transform your photo into a collectible card</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Card Image
              </h2>
              <CardUpload
                onImageUpload={handleImageUpload}
                initialImageUrl={cardData.imageUrl}
                autoEnhance={true}
              />
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Card Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Title</Label>
                  <Input 
                    id="title"
                    value={cardData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter card title"
                    className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={cardData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your card"
                    rows={3}
                    className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="player" className="text-white">Player/Subject</Label>
                    <Input
                      id="player"
                      value={cardData.player}
                      onChange={(e) => handleInputChange('player', e.target.value)}
                      placeholder="Player name"
                      className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="team" className="text-white">Team/Group</Label>
                    <Input
                      id="team"
                      value={cardData.team}
                      onChange={(e) => handleInputChange('team', e.target.value)}
                      placeholder="Team name"
                      className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="year" className="text-white">Year</Label>
                  <Input
                    id="year"
                    value={cardData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="2024"
                    className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!cardData.imageUrl}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  Create Card
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UploadFlow;
