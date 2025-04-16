
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import ActionFigure from '@/components/baseball/ActionFigure';

const BaseballActionFigure = () => {
  return (
    <PageLayout 
      title="Baseball Action Figure"
      description="Customize your own baseball action figure"
      fullWidth={true}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-900/70 backdrop-blur-md rounded-xl overflow-hidden shadow-xl">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-2">Baseball Action Figure</h1>
            <p className="text-gray-300 mb-6">Customize your player with interchangeable parts. Drag to rotate.</p>
            
            <div className="h-[600px]">
              <ActionFigure />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BaseballActionFigure;
