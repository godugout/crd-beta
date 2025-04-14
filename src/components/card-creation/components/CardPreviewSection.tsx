
import React from 'react';
import CardWizardHeader from './CardWizardHeader';
import CardPreviewSidebar from './CardPreviewSidebar';
import CardWizardFeatures from './CardWizardFeatures';
import { CardDesignState, CardLayer } from '../types/cardTypes';

interface CardPreviewSectionProps {
  cardData: CardDesignState;
  layers: CardLayer[];
  activeLayer: CardLayer | null;
  setActiveLayerId: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<CardLayer>) => void;
  effectClasses: string;
  previewCanvasRef: React.RefObject<HTMLDivElement>;
}

const CardPreviewSection: React.FC<CardPreviewSectionProps> = ({
  cardData,
  layers,
  activeLayer,
  setActiveLayerId,
  updateLayer,
  effectClasses,
  previewCanvasRef
}) => {
  return (
    <div className="md:col-span-2 flex max-w-[576px] grow shrink-0 basis-0 flex-col items-start gap-2 self-stretch rounded-md bg-card px-8 py-8 shadow-lg">
      <CardWizardHeader />
      
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start justify-center gap-4">
        <div className="relative w-full aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-lg">
          <CardPreviewSidebar
            cardData={cardData}
            layers={layers}
            activeLayerId={activeLayer?.id || null}
            effectClasses={effectClasses}
            onLayerSelect={setActiveLayerId}
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
