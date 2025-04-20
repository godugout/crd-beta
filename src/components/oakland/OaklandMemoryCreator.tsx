
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { OaklandTemplateType } from './OaklandCardTemplates';
import { useCards } from '@/context/CardContext';
import { OaklandMemoryData, DesignMetadata } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { OaklandMemoryForm } from './OaklandMemoryForm';
import OaklandTemplateSelector from './OaklandTemplateSelector';
import OaklandEditorIntegration from './OaklandEditorIntegration';
import { oaklandTemplates } from './OaklandCardTemplates';

const OaklandMemoryCreator: React.FC = () => {
  const navigate = useNavigate();
  const { addCard } = useCards();
  const [selectedTemplate, setSelectedTemplate] = useState<OaklandTemplateType>('classic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Base memory data with required fields
  const [memoryData, setMemoryData] = useState<Partial<OaklandMemoryData>>({
    title: '',
    description: '',
    template: 'classic',
    tags: ['oakland', 'athletics']
  });
  
  const handleTemplateChange = (template: OaklandTemplateType) => {
    setSelectedTemplate(template);
    setMemoryData(prev => ({
      ...prev,
      template
    }));
  };
  
  const handleSubmit = async (formData: OaklandMemoryData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Ensure required fields are set
      if (!formData.title || !formData.description) {
        toast.error('Title and description are required');
        setIsSubmitting(false);
        return;
      }
      
      // Create the card with Oakland Memory metadata
      const newCard = {
        id: uuidv4(),
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl || '',
        thumbnailUrl: formData.imageUrl || '',
        tags: formData.tags || ['oakland', 'athletics', 'memory'],
        effects: ['Vintage'],
        userId: 'current-user', // Add the required userId field
        designMetadata: {
          cardStyle: {
            template: formData.template || 'classic',
            effect: 'vintage',
            borderRadius: '12px',
            borderColor: '#006341',
            frameColor: '#EFB21E',
            frameWidth: 8,
            shadowColor: '#333333',
            teamSpecific: true
          },
          textStyle: {
            titleColor: '#EFB21E',
            titleAlignment: 'center',
            titleWeight: 'bold',
            descriptionColor: '#FFFFFF'
          },
          marketMetadata: {
            isPrintable: true,
            isForSale: false,
            includeInCatalog: true
          },
          cardMetadata: {
            category: 'memory',
            cardType: 'oaklandMemory',
            series: 'oakland'
          },
          oaklandMemory: {
            date: formData.date || '',
            opponent: formData.opponent || '',
            score: formData.score || '',
            location: formData.location || '',
            section: formData.section || '',
            memoryType: formData.memoryType || '',
            attendees: formData.attendees || [],
            template: formData.template,
            historicalContext: formData.historicalContext || '',
            personalSignificance: formData.personalSignificance || ''
          }
        }
      };
      
      await addCard(newCard);
      
      toast.success('Oakland memory card created successfully!');
      navigate('/oakland-memories');
    } catch (error) {
      console.error('Error creating Oakland memory:', error);
      toast.error('Failed to create memory card');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Create Oakland A's Memory</h1>
      <p className="text-gray-600 mb-6">
        Capture and share your favorite memories of the Oakland Athletics.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <OaklandMemoryForm
              initialData={{
                ...memoryData,
                template: selectedTemplate,
                title: memoryData.title || '',
                description: memoryData.description || ''
              }}
              onSubmit={handleSubmit}
            />
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <OaklandEditorIntegration
            selectedTemplate={selectedTemplate}
            onTemplateChange={handleTemplateChange}
            memoryData={{
              ...memoryData,
              title: memoryData.title || 'My Oakland Memory',
              description: memoryData.description || 'What happened at this memorable A\'s moment?'
            }}
            onMemoryDataChange={setMemoryData}
          />
          
          <div className="mt-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-3">About Oakland Memories</h2>
              <p className="text-sm text-gray-600 mb-2">
                Share your favorite memories from Oakland A's games, events, and moments.
                Whether it's a historic game, a special meeting, or just a great day
                at the Coliseum, preserve it here.
              </p>
              <p className="text-sm text-gray-600">
                Your memories will be preserved in the Oakland Athletics digital archive
                and can be shared with other fans.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OaklandMemoryCreator;
