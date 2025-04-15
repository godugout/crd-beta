
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface CardCreationStep {
  id: string;
  label: string;
  component: React.ReactNode;
  isComplete?: boolean;
  isOptional?: boolean;
}

export interface CardCreationWizardProps {
  steps: CardCreationStep[];
  onSave: (data: any) => Promise<void>;
  className?: string;
  initialData?: any;
}

const CardCreationWizard: React.FC<CardCreationWizardProps> = ({
  steps,
  onSave,
  className,
  initialData = {}
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  
  const currentStep = steps[currentStepIndex];
  
  // Update form data from any step
  const updateFormData = useCallback((data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);
  
  // Mark current step as complete
  const completeCurrentStep = useCallback(() => {
    setCompletedSteps(prev => {
      const updated = new Set(prev);
      updated.add(currentStepIndex);
      return updated;
    });
  }, [currentStepIndex]);
  
  // Check if step is completed
  const isStepComplete = useCallback((index: number) => {
    return completedSteps.has(index) || steps[index].isComplete === true;
  }, [completedSteps, steps]);
  
  // Check if can navigate to next step
  const canGoNext = currentStepIndex < steps.length - 1 && isStepComplete(currentStepIndex);
  
  // Check if can navigate to previous step
  const canGoPrev = currentStepIndex > 0;
  
  // Handle next step
  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, steps.length]);
  
  // Handle previous step
  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);
  
  // Handle direct navigation to specific step
  const handleGoToStep = useCallback((index: number) => {
    // Only allow navigation to completed steps or the next incomplete step
    const nextIncompleteStep = [...completedSteps].length;
    if (index <= nextIncompleteStep || isStepComplete(index)) {
      setCurrentStepIndex(index);
    } else {
      toast.error("Please complete the current step first");
    }
  }, [completedSteps, isStepComplete]);
  
  // Handle save form data
  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await onSave(formData);
      toast.success("Card saved successfully!");
      navigate('/gallery');
    } catch (error) {
      console.error("Error saving card:", error);
      toast.error("Failed to save card. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [formData, onSave, navigate]);
  
  return (
    <div className={className}>
      <Tabs 
        value={currentStep.id} 
        onValueChange={(id) => {
          const index = steps.findIndex(step => step.id === id);
          if (index !== -1) handleGoToStep(index);
        }}
        className="w-full"
      >
        <div className="mb-6">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
            {steps.map((step, index) => (
              <TabsTrigger 
                key={step.id} 
                value={step.id}
                disabled={index > currentStepIndex && !isStepComplete(index - 1)}
                className="relative"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium 
                    ${isStepComplete(index) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {index + 1}
                  </div>
                  <span className="text-xs hidden sm:block">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute w-full h-0.5 bg-gray-200 top-3 left-1/2 z-0" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-5">
          {steps.map((step) => (
            <TabsContent key={step.id} value={step.id} className="m-0">
              <div className="py-2">
                {React.isValidElement(step.component)
                  ? React.cloneElement(step.component as React.ReactElement<any>, {
                      formData,
                      updateFormData,
                      completeStep: completeCurrentStep
                    })
                  : step.component}
              </div>
            </TabsContent>
          ))}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={!canGoPrev}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {currentStepIndex === steps.length - 1 ? (
              <Button
                onClick={handleSave}
                disabled={isSaving || !isStepComplete(currentStepIndex)}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Card'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canGoNext}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default CardCreationWizard;
