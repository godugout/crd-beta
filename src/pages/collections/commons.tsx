
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useCards } from '@/context/CardContext';

const CommonsCardsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    collectionId?: string;
    error?: string;
  } | null>(null);
  const navigate = useNavigate();
  const { addCard, createCollection } = useCards();

  const handleGenerateCommonsCards = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      // In a production app, this would call the Supabase function to generate cards
      // For now, we'll simulate creating a collection with sample cards
      
      // Create the collection
      const collection = createCollection({
        name: "Commons Cards",
        description: "A collection of trading cards featuring public domain images",
        coverImageUrl: "/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png",
      });
      
      // Add some sample cards to it
      const cardData = [
        {
          title: "Vintage Baseball Card",
          description: "A classic baseball card from the golden era",
          imageUrl: "/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png",
          thumbnailUrl: "/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png",
          tags: ["baseball", "vintage", "collectible"],
          collectionId: collection.id,
          designMetadata: {
            player: "Honus Wagner",
            team: "Pittsburgh Pirates",
            year: "1909-11"
          }
        },
        {
          title: "Mickey Mantle Card",
          description: "Iconic 1952 Topps Mickey Mantle rookie card",
          imageUrl: "/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png",
          thumbnailUrl: "/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png",
          tags: ["baseball", "rookie", "valuable"],
          collectionId: collection.id,
          designMetadata: {
            player: "Mickey Mantle",
            team: "New York Yankees",
            year: "1952"
          }
        },
        {
          title: "Babe Ruth Card",
          description: "Historic Babe Ruth baseball card",
          imageUrl: "/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png",
          thumbnailUrl: "/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png",
          tags: ["baseball", "legend", "collectible"],
          collectionId: collection.id,
          designMetadata: {
            player: "Babe Ruth",
            team: "New York Yankees",
            year: "1933"
          }
        }
      ];
      
      // Add each card
      cardData.forEach(card => {
        addCard(card);
      });
      
      toast.success('Commons Cards collection created/updated successfully');
      
      setResult({
        success: true,
        message: 'Commons Cards collection created/updated successfully',
        collectionId: collection.id
      });
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
      setResult({ 
        success: false, 
        error: err.message || 'Error occurred while creating Commons Cards' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCollection = () => {
    if (result?.collectionId) {
      navigate(`/collections/${result.collectionId}`);
    }
  };

  return (
    <PageLayout
      title="Commons Cards | CardShow"
      description="Generate a collection of cards using public domain images"
    >
      <Container className="py-8">
        <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Commons Cards Generator</h1>
            <p className="text-muted-foreground">
              Create or update a collection of trading cards featuring public domain images.
              Perfect for testing and demonstration purposes.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-8 shadow-sm">
            {!result?.success && !result?.error && (
              <div className="text-center">
                <p className="mb-6">
                  This will create or update the "Commons Cards" collection with sample trading cards
                  featuring public domain images.
                </p>

                <Button
                  onClick={handleGenerateCommonsCards}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size={16} className="mr-2" />
                      Generating Commons Cards...
                    </>
                  ) : (
                    'Create/Update Commons Cards Collection'
                  )}
                </Button>
              </div>
            )}

            {result?.error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {result.error}
                  <div className="mt-4">
                    <Button onClick={handleGenerateCommonsCards} variant="outline" className="mr-2">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {result?.success && (
              <div className="text-center space-y-4">
                <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                  <h2 className="text-2xl font-semibold text-primary mb-2">{result.message}</h2>
                  {result.collectionId && (
                    <p className="text-sm text-muted-foreground mb-4">Collection ID: {result.collectionId}</p>
                  )}
                  <Button 
                    onClick={handleViewCollection}
                    size="lg"
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Commons Cards Collection
                  </Button>
                </div>
                
                <Button 
                  onClick={handleGenerateCommonsCards} 
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Commons Cards
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default CommonsCardsPage;
