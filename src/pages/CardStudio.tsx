
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import CardCreationWizard from '@/components/card-studio/CardCreationWizard';
import TemplateSelector from '@/components/card-studio/TemplateSelector';
import { Card } from '@/lib/types/cardTypes';
import { CardTemplate } from '@/components/card-templates/TemplateLibrary';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const CardStudio: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // When a template is selected, start the creation process
  const handleTemplateSelect = (template: CardTemplate) => {
    setSelectedTemplate(template);
    setIsCreating(true);
    toast({
      title: "Template selected",
      description: `${template.name} template loaded. You can now customize your card.`
    });
  };

  // For quick creation without template selection
  const handleQuickCreate = () => {
    setIsCreating(true);
  };

  // Return to template selection
  const handleCancel = () => {
    setIsCreating(false);
    setSelectedTemplate(null);
  };

  // When the card is completed
  const handleCardComplete = (card: Card) => {
    toast({
      title: "Card created successfully!",
      description: "Your new card has been added to your collection."
    });
    navigate('/gallery');
  };

  return (
    <PageLayout
      title="Card Studio"
      description="Create custom trading cards with advanced design tools"
    >
      <div className="container mx-auto px-4 py-8">
        {!isCreating ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Select a Template</h2>
              <Button 
                onClick={handleQuickCreate}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Quick Create
              </Button>
            </div>
            
            <TemplateSelector onSelectTemplate={handleTemplateSelect} />
          </div>
        ) : (
          <CardCreationWizard 
            initialTemplate={selectedTemplate} 
            onComplete={handleCardComplete}
            onCancel={handleCancel}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default CardStudio;
