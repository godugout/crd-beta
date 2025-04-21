
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CRDEditor from '@/components/card-editor/CRDEditor';

const CRDEditorPage: React.FC = () => {
  return (
    <PageLayout
      title="CRD Editor"
      description="Create stunning collectible digital cards with our advanced editor"
    >
      <CRDEditor />
    </PageLayout>
  );
};

export default CRDEditorPage;
