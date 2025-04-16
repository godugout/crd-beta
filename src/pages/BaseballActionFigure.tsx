
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import ActionFigure from '@/components/baseball/ActionFigure';
import KeyboardShortcuts from '@/components/gallery/viewer-components/KeyboardShortcuts';

const BaseballActionFigure = () => {
  return (
    <PageLayout 
      title="Baseball Action Figure"
      description="Customize your own baseball action figure"
      fullWidth={true}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-900/70 backdrop-blur-md rounded-xl overflow-hidden shadow-xl h-[calc(100vh-12rem)]">
          <div className="grid grid-cols-1 h-full relative">
            <div className="h-full">
              <ActionFigure />
            </div>
            <KeyboardShortcuts />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BaseballActionFigure;
