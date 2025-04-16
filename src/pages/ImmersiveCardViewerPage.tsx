
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCardById } from '@/lib/api/cards';
import ImmersiveCardViewer from '@/components/card-viewer/ImmersiveCardViewer';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const ImmersiveCardViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: card, isLoading, error } = useQuery({
    queryKey: ['card', id],
    queryFn: () => fetchCardById(id as string),
    enabled: !!id
  });

  // Log card data to help with debugging
  useEffect(() => {
    if (card) {
      console.log("Card loaded successfully:", card);
      console.log("Image URL:", card.imageUrl);
    } else if (error) {
      console.error("Error loading card:", error);
    }
  }, [card, error]);

  const handleBack = () => {
    navigate(-1);
  };

  // Add fallback images if card data is available but image URL is missing
  useEffect(() => {
    if (card && !card.imageUrl) {
      console.log("Adding fallback image to card");
      card.imageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475";
      toast({
        title: "Using fallback image",
        description: "The original card image couldn't be loaded",
      });
    }
  }, [card, toast]);

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
