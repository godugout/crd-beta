
import React from 'react';
import { CardDesignState, CardLayer } from '../CardCreator';
import CardPreviewSidebar from './CardPreviewSidebar';
import CardWizardHeader from './CardWizardHeader';
import CardWizardFeatures from './CardWizardFeatures';

interface CardPreviewSectionProps {
  cardData: CardDesignState;
  layers: CardLayer[];
  activeLayerId: string | null;
  effectClasses: string;
  setActiveLayer: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<CardLayer>) => void;
  previewCanvasRef: React.RefObject<HTMLDivElement>;
}

const CardPreviewSection: React.FC<CardPreviewSectionProps> = ({
  cardData,
  layers,
  activeLayerId,
  effectClasses,
  setActiveLayer,
  updateLayer,
  previewCanvasRef
}) => {
  return (
    <div className="flex max-w-[576px] grow shrink-0 basis-0 flex-col items-start gap-2 self-stretch rounded-md bg-card px-8 py-8 shadow-lg">
      <CardWizardHeader />
      
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start justify-center gap-4">
        <div className="relative w-full aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-lg">
          <CardPreviewSidebar
            cardData={cardData}
            layers={layers}
            activeLayerId={activeLayerId}
            effectClasses={effectClasses}
            onLayerSelect={setActiveLayer}
            onLayerUpdate={updateLayer}
            previewCanvasRef={previewCanvasRef}
            hideControls={true}
          />
        </div>
      </div>
      
      <CardWizardFeatures />
    </div>
  );
};

export default CardPreviewSection;
