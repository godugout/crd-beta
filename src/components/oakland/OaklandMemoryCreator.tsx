
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCards } from '@/context/CardContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OaklandMemoryForm } from './OaklandMemoryForm';
import ImageUploader from '@/components/dam/ImageUploader';
import OaklandMemoryCard from './OaklandMemoryCard';
import { OaklandTemplateType } from './OaklandCardTemplates';
import { OaklandMemoryData } from '@/lib/types';

interface OaklandMemoryCreatorProps {
  className?: string;
}

const OaklandMemoryCreator: React.FC<OaklandMemoryCreatorProps> = ({ className }) => {
  const navigate = useNavigate();
  const { addCard } = useCards();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [memoryData, setMemoryData] = useState<OaklandMemoryData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<OaklandTemplateType>('classic');
  const [activeTab, setActiveTab] = useState<string>('upload');

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setActiveTab('details');
  };

  const handleMemoryDataSubmit = (data: OaklandMemoryData) => {
    // Update with the imageUrl
    const updatedData = {
      ...data,
      imageUrl: imageUrl
    };
    setMemoryData(updatedData);
    setActiveTab('preview');
  };

  const templateOptions: Array<{id: OaklandTemplateType, name: string}> = [
    { id: 'classic', name: 'Classic Green & Gold' },
    { id: 'moneyball', name: 'Moneyball Era' },
    { id: 'dynasty', name: 'Dynasty Years' },
    { id: 'coliseum', name: 'Coliseum' },
    { id: 'tailgate', name: 'Tailgate Party' },
  ];

  const handleSaveCard = async () => {
    if (!imageUrl || !memoryData) {
      toast.error('Please upload an image and provide memory details');
      return;
    }

    try {
      // Prepare the metadata for storage
      const oaklandMetadata = {
        date: memoryData.date,
        opponent: memoryData.opponent,
        score: memoryData.score,
        location: memoryData.location,
        section: memoryData.section,
        memoryType: memoryData.memoryType,
        attendees: memoryData.attendees,
        template: selectedTemplate,
        teamId: 'oakland-athletics',
        imageUrl: imageUrl,
        historicalContext: memoryData.historicalContext,
        personalSignificance: memoryData.personalSignificance,
      };

      // Create card with Oakland specific metadata
      await addCard({
        title: memoryData.title,
        description: memoryData.description,
        imageUrl: imageUrl,
        thumbnailUrl: imageUrl,
        tags: memoryData.tags || [],
        designMetadata: {
          cardStyle: {
            effect: selectedTemplate,
            teamSpecific: true,
          },
          textStyle: {
            titleColor: '#EFB21E',
            descriptionColor: '#FFFFFF',
          },
          oaklandMemory: oaklandMetadata
        } as any
      });

      toast.success('Memory card created!');
      navigate('/oakland-memories');
    } catch (error) {
      console.error('Error creating memory card:', error);
      toast.error('Failed to create memory card');
    }
  };

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="upload">1. Upload Image</TabsTrigger>
          <TabsTrigger value="details" disabled={!imageUrl}>2. Memory Details</TabsTrigger>
          <TabsTrigger value="preview" disabled={!imageUrl || !memoryData}>3. Preview & Save</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="p-4 bg-white rounded-lg shadow-sm">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-center mb-6 text-[#003831]">Upload Your Memory</h2>
            <p className="text-center text-gray-600 mb-6">
              Upload a photo of your Oakland A's memory. It could be from a game, tailgate, or memorabilia.
            </p>
            <ImageUploader 
              onUploadComplete={handleImageUpload}
              title="Upload A's Memory"
              maxSizeMB={5}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-center mb-6 text-[#003831]">Add Memory Details</h2>
          <OaklandMemoryForm 
            onSubmit={handleMemoryDataSubmit}
            initialData={memoryData || undefined}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-center mb-6 text-[#003831]">Preview Your Memory</h2>
          
          {memoryData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-4 text-gray-700">Choose a Template:</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {templateOptions.map((template) => (
                    <div 
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`cursor-pointer p-3 rounded-lg border-2 ${
                        selectedTemplate === template.id 
                          ? 'border-[#006341] bg-[#006341]/10' 
                          : 'border-gray-200 hover:border-[#006341]/50'
                      }`}
                    >
                      <p className="text-sm font-medium">{template.name}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleSaveCard}
                    className="px-6 py-3 bg-[#006341] hover:bg-[#003831] text-white font-medium rounded-lg transition-colors"
                  >
                    Save Memory Card
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="max-w-[300px] w-full">
                  <OaklandMemoryCard
                    memory={{
                      title: memoryData.title,
                      description: memoryData.description,
                      date: memoryData.date || '',
                      memoryType: memoryData.memoryType || '',
                      opponent: memoryData.opponent,
                      score: memoryData.score,
                      location: memoryData.location,
                      section: memoryData.section,
                      attendees: memoryData.attendees || [],
                      tags: memoryData.tags || [],
                      imageUrl: imageUrl,
                      historicalContext: memoryData.historicalContext,
                      personalSignificance: memoryData.personalSignificance
                    }}
                    templateType={selectedTemplate}
                  />
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OaklandMemoryCreator;
