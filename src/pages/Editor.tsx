
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CardEditor from '@/components/CardEditor';
import PageLayout from '@/components/navigation/PageLayout';

const Editor = () => {
  const navigate = useNavigate();
  
  return (
    <PageLayout
      title="Create New Card"
      description="Upload an image and add details to create your digital card."
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-cardshow-dark mb-2">Create New Card</h1>
          <p className="text-cardshow-slate">
            Upload an image and add details to create your digital card.
          </p>
        </div>
        
        <CardEditor />
      </div>
    </PageLayout>
  );
};

export default Editor;
