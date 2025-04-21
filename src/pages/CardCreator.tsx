
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useCards } from '@/context/CardContext';
import CardCreationStepper from '@/components/card-creation/CardCreationStepper';
import CardUploadStep from '@/components/card-creation/steps/CardUploadStep';
import CardDesignStep from '@/components/card-creation/steps/CardDesignStep';
import CardEffectsStep from '@/components/card-creation/steps/CardEffectsStep';
import CardTextStep from '@/components/card-creation/steps/CardTextStep';
import CardPreviewStep from '@/components/card-creation/steps/CardPreviewStep';
import CardPreview from '@/components/card-creation/CardPreview';
import { useCardEffectsStack } from '@/components/card-creation/hooks/useCardEffectsStack';
import { useLayers } from '@/components/card-creation/hooks/useLayers';
import { CardDesignState, CardLayer } from '@/components/card-creation/types/cardTypes';

/**
 * Unified Card Creator page that combines the functionality of the current
 * CardCreatorPage and Editor components
 */
const CardCreator: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { cards, getCardById, addCard, updateCard } = useCards();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Card data state
  const [currentStep, setCurrentStep] = useState(0);
  const [cardData, setCardData] = useState<CardDesignState>({
    title: '',
    description: '',
    tags: [] as string[],
    imageUrl: null as string | null,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    player: '',
    team: '',
    year: '',
  });

  // Initialize layers and effects hooks
  const { 
    layers, 
    activeLayerId, 
    setActiveLayer,
    addLayer, 
    updateLayer, 
    deleteLayer, 
    moveLayerUp, 
    moveLayerDown 
  } = useLayers();
  
  const { 
    activeEffects,
    addEffect, 
    removeEffect, 
    updateEffectSettings,
    effectStack = [],
    getEffectClasses = () => ""
  } = useCardEffectsStack();
  
  // Load card data for editing if ID is provided
  useEffect(() => {
    if (id) {
      const cardToEdit = getCardById(id);
      if (cardToEdit) {
        setCardData(prevData => ({
          ...prevData,
          ...cardToEdit,
          tags: cardToEdit.tags || [],
        }));
        toast({
          title: "Card loaded for editing",
          description: "Make your changes and save to update your CRD."
        });
      }
    }
    
    // Process data passed from CardDetector if available
    if (location.state) {
      const { imageUrl, metadata, cardType } = location.state;
      
      if (imageUrl) {
        setCardData(prevData => ({
          ...prevData,
          imageUrl,
          title: metadata?.title || '',
          description: metadata?.text || '',
          player: metadata?.player || '',
          team: metadata?.team || '',
          year: metadata?.year || '',
          tags: metadata?.tags || [],
        }));
        
        toast({
          title: "Card data loaded from detector",
          description: "Continue customizing your CRD."
        });
      }
    }
  }, [id, getCardById, location.state, toast]);

  // Handle step navigation
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle card submission
  const handleSaveCard = async () => {
    try {
      const fullCardData = {
        ...cardData,
        effectStack,
        layers,
        effectClasses: getEffectClasses(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (id) {
        await updateCard(id, fullCardData);
        toast({
          title: "Success!",
          description: "Your CRD has been updated."
        });
      } else {
        await addCard(fullCardData);
        toast({
          title: "Success!",
          description: "Your CRD has been created."
        });
      }
      
      navigate('/gallery');
    } catch (error) {
      console.error('Error saving card:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your CRD.",
        variant: "destructive"
      });
    }
  };

  const STEPS = [
    { name: "Upload", description: "Upload your image" },
    { name: "Design", description: "Customize the design" },
    { name: "Effects", description: "Add special effects" },
    { name: "Text", description: "Add text and details" },
    { name: "Preview", description: "Review and save" }
  ];

  const activeLayer = layers.find(layer => layer.id === activeLayerId) || null;

  return (
    <PageLayout
      title={id ? "Edit Card" : "Create a CRD"}
      description="Design your digital trading card with powerful customization tools"
    >
      <div className="container mx-auto max-w-7xl py-6">
        <CardCreationStepper 
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={(index) => {
            // Only allow clicking on steps that should be accessible
            if (cardData.imageUrl || index === 0) {
              setCurrentStep(index);
            } else {
              toast({
                title: "Please upload an image first",
                description: "You need to add an image before proceeding to other steps"
              });
            }
          }}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {currentStep === 0 && (
                  <CardUploadStep 
                    cardData={cardData}
                    setCardData={setCardData}
                    onContinue={goToNextStep}
                  />
                )}
                
                {currentStep === 1 && (
                  <CardDesignStep 
                    cardData={cardData}
                    setCardData={setCardData}
                    layers={layers}
                    activeLayer={activeLayer}
                    setActiveLayer={setActiveLayer}
                    addLayer={addLayer}
                    updateLayer={updateLayer}
                    deleteLayer={deleteLayer}
                    moveLayerUp={moveLayerUp}
                    moveLayerDown={moveLayerDown}
                    onContinue={goToNextStep}
                  />
                )}
                
                {currentStep === 2 && (
                  <CardEffectsStep 
                    effectStack={effectStack}
                    addEffect={addEffect}
                    removeEffect={removeEffect}
                    updateEffectSettings={updateEffectSettings}
                    onContinue={goToNextStep}
                  />
                )}
                
                {currentStep === 3 && (
                  <CardTextStep 
                    cardData={cardData}
                    setCardData={setCardData}
                    onContinue={goToNextStep}
                  />
                )}
                
                {currentStep === 4 && (
                  <CardPreviewStep 
                    cardData={cardData}
                    effectClasses={getEffectClasses()}
                    onSave={handleSaveCard}
                  />
                )}
              </CardContent>
            </Card>
            
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button onClick={goToNextStep}>
                  Continue
                </Button>
              ) : (
                <Button onClick={handleSaveCard}>
                  Save CRD
                </Button>
              )}
            </div>
          </div>
          
          <div className="order-first lg:order-last">
            <div className="sticky top-20">
              <h2 className="text-xl font-bold mb-4">Preview</h2>
              <CardPreview 
                cardData={cardData}
                effectClasses={getEffectClasses()}
              />
              
              {cardData.imageUrl && currentStep >= 1 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium">Applied Effects</h3>
                  <div className="text-sm text-gray-600">
                    {effectStack.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {effectStack.map(effect => (
                          <li key={effect.id}>{effect.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No effects applied</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardCreator;
