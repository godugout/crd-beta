
import React from 'react';
import { Pen, Wand2, Layers } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DetectedCard } from '../types';
import TracingTab from './TracingTab';
import DetectionTab from './DetectionTab';
import ComparisonTab from './ComparisonTab';

interface TabContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  image: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  detectedCards: DetectedCard[];
  manualTraces: DetectedCard[];
  isProcessing: boolean;
  showEdges: boolean;
  showContours: boolean;
  onImageChange: (imageUrl: string) => void;
  onDetectCards: () => void;
  onAddTrace: () => void;
  onClearTraces: () => void;
  onCompareResults: () => void;
  onToggleEdges: (value: boolean) => void;
  onToggleContours: (value: boolean) => void;
  onClearDetection: () => void;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  setActiveTab,
  image,
  fileInputRef,
  detectedCards,
  manualTraces,
  isProcessing,
  showEdges,
  showContours,
  onImageChange,
  onDetectCards,
  onAddTrace,
  onClearTraces,
  onCompareResults,
  onToggleEdges,
  onToggleContours,
  onClearDetection
}) => {
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="trace" className="flex items-center gap-2">
            <Pen className="h-4 w-4" />
            Trace Cards
          </TabsTrigger>
          <TabsTrigger value="detect" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Detect Cards
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Compare Results
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="relative overflow-hidden"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target?.result) {
                    onImageChange(event.target.result as string);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          Upload Image
        </Button>
        
        {activeTab === 'detect' && (
          <Button 
            variant="default" 
            onClick={onDetectCards}
            disabled={!image || isProcessing}
          >
            <Wand2 className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
            Detect Cards
          </Button>
        )}
      </div>
      
      <TabsContent value="trace">
        <TracingTab 
          image={image}
          manualTraces={manualTraces}
          onAddTrace={onAddTrace}
          onClearTraces={onClearTraces}
          onCompareResults={onCompareResults}
        />
      </TabsContent>
      
      <TabsContent value="detect">
        <DetectionTab 
          image={image}
          detectedCards={detectedCards}
          isProcessing={isProcessing}
          showEdges={showEdges}
          showContours={showContours}
          onDetectCards={onDetectCards}
          onClearDetection={onClearDetection}
          onToggleEdges={onToggleEdges}
          onToggleContours={onToggleContours}
        />
      </TabsContent>
      
      <TabsContent value="compare">
        <ComparisonTab 
          detectedCards={detectedCards}
          manualTraces={manualTraces}
        />
      </TabsContent>
    </>
  );
};

export default TabContent;
