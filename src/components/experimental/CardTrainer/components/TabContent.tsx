
import React from 'react';
import { Pen, Wand2, Layers } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DetectedCard, TabContentProps, TracingTabContentProps, DetectionTabContentProps, ComparisonTabContentProps } from '../types';
import TracingTab from './TracingTab';
import DetectionTab from './DetectionTab';
import ComparisonTab from './ComparisonTab';

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
  // Create a dummy HTMLImageElement for compatibility
  const dummyImage = new Image();
  if (image) {
    dummyImage.src = image;
  }

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
        
        <TabsContent value="trace">
          <TracingTabContent
            image={image}
            manualTraces={manualTraces}
            onAddTrace={onAddTrace}
            onClearTraces={onClearTraces}
            onCompareResults={onCompareResults}
          />
        </TabsContent>
        
        <TabsContent value="detect">
          <DetectionTabContent
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
          <ComparisonTabContent 
            detectedCards={detectedCards}
            manualTraces={manualTraces}
            uploadedImage={image ? dummyImage : null}
          />
        </TabsContent>
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
    </>
  );
};

// Create wrapper components to properly bridge the different props interfaces
const TracingTabContent: React.FC<TracingTabContentProps> = (props) => {
  // This component handles the conversion between TabContent props and TracingTab props
  return (
    <div className="tracing-tab-content">
      {props.image && 
        <div className="p-4 bg-white rounded border">
          <h3 className="mb-4 text-lg font-medium">Manual Tracing</h3>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <img src={props.image} alt="Upload" className="max-w-full h-auto rounded" />
              {props.manualTraces.length > 0 && props.manualTraces.map((trace, index) => (
                <div
                  key={index}
                  className="absolute border-2 border-blue-500"
                  style={{
                    left: `${trace.x}px`,
                    top: `${trace.y}px`,
                    width: `${trace.width}px`,
                    height: `${trace.height}px`,
                    transform: `rotate(${trace.rotation}deg)`,
                  }}
                ></div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={props.onAddTrace} variant="outline">Add Trace</Button>
              <Button onClick={props.onClearTraces} variant="outline">Clear Traces</Button>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

const DetectionTabContent: React.FC<DetectionTabContentProps> = (props) => {
  // This component handles the conversion between TabContent props and DetectionTab props
  return (
    <div className="detection-tab-content">
      {props.image && 
        <div className="p-4 bg-white rounded border">
          <h3 className="mb-4 text-lg font-medium">Auto Detection</h3>
          <div className="relative">
            <img src={props.image} alt="Upload" className="max-w-full h-auto rounded" />
            {props.detectedCards.map((card, index) => (
              <div
                key={index}
                className="absolute border-2 border-green-500"
                style={{
                  left: `${card.x}px`,
                  top: `${card.y}px`,
                  width: `${card.width}px`,
                  height: `${card.height}px`,
                  transform: `rotate(${card.rotation}deg)`,
                }}
              >
                <span className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1">
                  {(card.confidence !== undefined ? card.confidence * 100 : 0).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-edges"
                checked={props.showEdges}
                onChange={(e) => props.onToggleEdges(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="show-edges">Show Edges</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-contours"
                checked={props.showContours}
                onChange={(e) => props.onToggleContours(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="show-contours">Show Contours</label>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

const ComparisonTabContent: React.FC<ComparisonTabContentProps> = (props) => {
  // Create a dummy image if needed for compatibility
  return (
    <div className="comparison-tab-content">
      {props.uploadedImage && 
        <div className="p-4 bg-white rounded border">
          <h3 className="mb-4 text-lg font-medium">Comparison</h3>
          <div className="relative">
            <img src={props.uploadedImage.src} alt="Upload" className="max-w-full h-auto rounded" />
            {props.detectedCards.map((card, index) => (
              <div
                key={`auto-${index}`}
                className="absolute border-2 border-green-500"
                style={{
                  left: `${card.x}px`,
                  top: `${card.y}px`,
                  width: `${card.width}px`,
                  height: `${card.height}px`,
                  transform: `rotate(${card.rotation}deg)`,
                }}
              >
                <span className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1">Auto</span>
              </div>
            ))}
            {props.manualTraces.map((trace, index) => (
              <div
                key={`manual-${index}`}
                className="absolute border-2 border-blue-500"
                style={{
                  left: `${trace.x}px`,
                  top: `${trace.y}px`,
                  width: `${trace.width}px`,
                  height: `${trace.height}px`,
                  transform: `rotate(${trace.rotation}deg)`,
                }}
              >
                <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1">Manual</span>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
};

export default TabContent;
