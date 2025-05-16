
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import ElementsSystemDemo from '@/components/element-system/ElementsSystemDemo';

const ElementsSystem = () => {
  return (
    <PageLayout
      title="Elements System"
      description="Create and manage custom elements for your cards"
    >
      <ElementsSystemDemo />
    </PageLayout>
  );
};

export default ElementsSystem;
