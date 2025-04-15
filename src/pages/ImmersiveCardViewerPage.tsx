
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCardById } from '@/lib/api/cards';
import ImmersiveCardViewer from '@/components/card-viewer/ImmersiveCardViewer';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ImmersiveCardViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: card, isLoading, error } = useQuery({
    queryKey: ['card', id],
    queryFn: () => fetchCardById(id as string),
    enabled: !!id
  });

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <PageLayout title="Loading Card..." fullWidth>
        <div className="p-6">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="h-[600px] w-full bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="w-48 h-6 mt-4" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !card) {
    return (
      <PageLayout title="Error" fullWidth>
        <div className="p-6">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="h-[600px] w-full bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Card Not Found</h2>
              <p className="text-gray-400">The card you're looking for doesn't exist or couldn't be loaded.</p>
              <Button className="mt-4" onClick={handleBack}>Return to Collection</Button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`3D View: ${card.title}`} fullWidth>
      <div className="p-6">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="h-[600px] w-full bg-gray-900 rounded-lg">
          <ImmersiveCardViewer card={card} />
        </div>
      </div>
    </PageLayout>
  );
};

export default ImmersiveCardViewerPage;
