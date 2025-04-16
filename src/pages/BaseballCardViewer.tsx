
import React from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import PageLayout from '@/components/navigation/PageLayout';
import BaseballCardRenderer from '@/components/baseball/BaseballCardRenderer';
import BaseballCardSidebar from '@/components/baseball/BaseballCardSidebar';

const BaseballCardViewer = () => {
  return (
    <PageLayout
      title="Baseball Card Viewer"
      description="Immersive baseball card viewing experience"
      fullWidth={true}
    >
      <div className="flex h-[calc(100vh-4rem)] mt-16 bg-gray-900">
        {/* Left sidebar */}
        <div className="hidden md:block w-72 border-r border-gray-800">
          <BaseballCardSidebar />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-hidden">
          <ErrorBoundary>
            <BaseballCardRenderer />
          </ErrorBoundary>
        </div>
      </div>
    </PageLayout>
  );
};

export default BaseballCardViewer;
