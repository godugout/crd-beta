
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';

const PbrDemo = () => {
  return (
    <PageLayout
      title="PBR Demo"
      description="Physically Based Rendering demonstration"
    >
      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-3xl font-bold mb-6">PBR Demo</h1>
        <p>This is a placeholder for the PBR Demo page.</p>
      </div>
    </PageLayout>
  );
};

export default PbrDemo;
