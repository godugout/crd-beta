
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight } from 'lucide-react';
import CardUpload from '@/components/card-upload/CardUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CardUploadStepProps {
  cardData: any;
  setCardData: (data: any) => void;
  onContinue: () => void;
}

const CardUploadStep: React.FC<CardUploadStepProps> = ({
  cardData,
  setCardData,
  onContinue
}) => {
  const [activeTab, setActiveTab] = useState("front");
  
  const handleImageUpload = (file: File, previewUrl: string) => {
    if (activeTab === "front") {
      setCardData({
        ...cardData,
        imageUrl: previewUrl
      });
    } else {
      setCardData({
        ...cardData,
        backImageUrl: previewUrl
      });
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Upload CRD Image</h2>
        <p className="text-gray-500 mb-4">
          Start by uploading your card image. For best results, use a high-quality image with a 2.5:3.5 aspect ratio.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 w-[240px]">
            <TabsTrigger value="front">Front of Card</TabsTrigger>
            <TabsTrigger value="back">Back of Card</TabsTrigger>
          </TabsList>
          
          <TabsContent value="front" className="mt-4">
            <CardUpload
              onImageUpload={handleImageUpload}
              initialImageUrl={cardData.imageUrl}
              autoEnhance={true}
            />
          </TabsContent>
          
          <TabsContent value="back" className="mt-4">
            <CardUpload 
              onImageUpload={handleImageUpload}
              initialImageUrl={cardData.backImageUrl}
              autoEnhance={true}
            />
            <p className="text-sm text-gray-500 mt-2">
              The back of the card is optional
            </p>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border space-y-4">
        <h3 className="text-lg font-semibold">Card Details</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              name="title"
              value={cardData.title}
              onChange={handleTextChange}
              placeholder="Enter title for your card"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={cardData.description}
              onChange={handleTextChange}
              placeholder="Describe your card"
              rows={3}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="player">Player/Subject</Label>
              <Input
                id="player"
                name="player"
                value={cardData.player}
                onChange={handleTextChange}
                placeholder="Player or subject name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="team">Team/Group</Label>
              <Input
                id="team"
                name="team"
                value={cardData.team}
                onChange={handleTextChange}
                placeholder="Team or group name"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={onContinue}
          disabled={!cardData.imageUrl}
          className="flex items-center gap-2"
        >
          Continue <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CardUploadStep;
