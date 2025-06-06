
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
    // Update with the imageUrl and set Oakland defaults
    const updatedData = {
      ...data,
      imageUrl: imageUrl,
      // Set Oakland-specific defaults if not provided
      tags: data.tags || ['oakland', 'athletics', 'memory'],
      location: data.location || 'Oakland Coliseum'
    };
    setMemoryData(updatedData);
    setActiveTab('preview');
  };

  // Expanded Oakland template options with era-specific designs
  const templateOptions: Array<{id: OaklandTemplateType, name: string, description: string, era: string}> = [
    { 
      id: 'classic', 
      name: 'Classic Green & Gold', 
      description: 'Timeless A\'s colors with clean design',
      era: 'All-Time Classic'
    },
    { 
      id: 'moneyball', 
      name: 'Moneyball Era', 
      description: 'Early 2000s statistical revolution style',
      era: '2002-2006'
    },
    { 
      id: 'dynasty', 
      name: 'Dynasty Years', 
      description: 'Championship glory of the 70s',
      era: '1972-1974'
    },
    { 
      id: 'coliseum', 
      name: 'Coliseum Classic', 
      description: 'Vintage ballpark atmosphere',
      era: 'Stadium Heritage'
    },
    { 
      id: 'tailgate', 
      name: 'Tailgate Party', 
      description: 'Fan community celebration style',
      era: 'Fan Culture'
    },
    {
      id: 'bashbrothers',
      name: 'Bash Brothers',
      description: 'Power-hitting era of the late 80s',
      era: '1988-1990'
    }
  ];

  const handleSaveCard = async () => {
    if (!imageUrl || !memoryData) {
      toast.error('Please upload an image and provide memory details');
      return;
    }

    try {
      // Prepare Oakland-specific metadata with enhanced theming
      const oaklandMetadata = {
        date: memoryData.date,
        opponent: memoryData.opponent,
        score: memoryData.score,
        location: memoryData.location || 'Oakland Coliseum',
        section: memoryData.section,
        memoryType: memoryData.memoryType,
        attendees: memoryData.attendees,
        template: selectedTemplate,
        teamId: 'oakland-athletics',
        imageUrl: imageUrl,
        historicalContext: memoryData.historicalContext,
        personalSignificance: memoryData.personalSignificance,
        // Oakland theme defaults
        primaryColor: '#006341',
        secondaryColor: '#EFB21E',
        teamColors: true,
        eraTheme: templateOptions.find(t => t.id === selectedTemplate)?.era || 'Classic'
      };

      // Create card with Oakland-specific branding
      await addCard({
        title: memoryData.title,
        description: memoryData.description,
        imageUrl: imageUrl,
        thumbnailUrl: imageUrl,
        tags: memoryData.tags || ['oakland', 'athletics', 'memory'],
        designMetadata: {
          cardStyle: {
            effect: selectedTemplate,
            teamSpecific: true,
            primaryColor: '#006341',
            secondaryColor: '#EFB21E',
          },
          textStyle: {
            titleColor: '#EFB21E',
            descriptionColor: '#FFFFFF',
            backgroundColor: '#006341',
          },
          oaklandMemory: oaklandMetadata
        } as any
      });

      toast.success('🏟️ Oakland memory saved! Your story is now part of A\'s history.');
      navigate('/');
    } catch (error) {
      console.error('Error creating Oakland memory card:', error);
      toast.error('Failed to create memory card');
    }
  };

  return (
    <div className={className}>
      <div className="max-w-6xl mx-auto">
        {/* Oakland-branded header */}
        <div className="text-center mb-8 p-6 bg-gradient-to-r from-[#006341] to-[#003831] rounded-lg">
          <h1 className="text-3xl font-bold text-[#EFB21E] mb-2">Create Your Oakland Memory</h1>
          <p className="text-white/90">
            Preserve your A's memories with Oakland-themed designs celebrating our team's legacy
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-[#006341]/10">
            <TabsTrigger value="upload" className="data-[state=active]:bg-[#006341] data-[state=active]:text-white">
              1. Upload Memory
            </TabsTrigger>
            <TabsTrigger value="details" disabled={!imageUrl} className="data-[state=active]:bg-[#006341] data-[state=active]:text-white">
              2. Memory Details
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!imageUrl || !memoryData} className="data-[state=active]:bg-[#006341] data-[state=active]:text-white">
              3. Preview & Save
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-[#EFB21E]">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-bold text-center mb-6 text-[#003831]">Upload Your A's Memory</h2>
              <p className="text-center text-gray-600 mb-6">
                Share a photo from a game, tailgate, championship celebration, or any Oakland A's moment that matters to you.
              </p>
              <ImageUploader 
                onUploadComplete={handleImageUpload}
                title="Upload Oakland Memory"
                maxSizeMB={5}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-[#EFB21E]">
            <h2 className="text-xl font-bold text-center mb-6 text-[#003831]">Tell Your Oakland Story</h2>
            <OaklandMemoryForm 
              onSubmit={handleMemoryDataSubmit}
              initialData={memoryData || undefined}
            />
          </TabsContent>
          
          <TabsContent value="preview" className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-[#EFB21E]">
            <h2 className="text-xl font-bold text-center mb-6 text-[#003831]">Choose Your Oakland Theme</h2>
            
            {memoryData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-4 text-gray-700">Select Oakland Era Design:</h3>
                  <div className="grid grid-cols-1 gap-4 mb-8 max-h-96 overflow-y-auto">
                    {templateOptions.map((template) => (
                      <div 
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                          selectedTemplate === template.id 
                            ? 'border-[#006341] bg-[#006341]/10 shadow-md' 
                            : 'border-gray-200 hover:border-[#006341]/50 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-medium text-[#003831]">{template.name}</p>
                          <span className="text-xs bg-[#EFB21E] text-[#003831] px-2 py-1 rounded-full font-medium">
                            {template.era}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{template.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={handleSaveCard}
                      className="px-8 py-3 bg-[#006341] hover:bg-[#003831] text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                      🏟️ Save Oakland Memory
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
                        location: memoryData.location || 'Oakland Coliseum',
                        section: memoryData.section,
                        attendees: memoryData.attendees || [],
                        tags: memoryData.tags || ['oakland', 'athletics'],
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
    </div>
  );
};

export default OaklandMemoryCreator;
