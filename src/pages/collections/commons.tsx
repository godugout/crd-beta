
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingState } from '@/components/ui/loading-state';
import { checkCollectionExists } from '@/lib/supabase/collections';
import { collectionOperations } from '@/lib/supabase/collections';

const CommonsCardsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingExistence, setIsCheckingExistence] = useState(false);
  const [collectionExists, setCollectionExists] = useState<boolean | null>(null);
  const [collectionData, setCollectionData] = useState<any>(null);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    collectionId?: string;
    error?: string;
  } | null>(null);
  const navigate = useNavigate();

  // Collection ID for Commons Cards
  const COMMONS_COLLECTION_ID = '5d034aa4-86e0-4ca7-92c5-1fbd8e71943c';

  // Check if the collection exists when the component mounts
  useEffect(() => {
    const checkCollection = async () => {
      setIsCheckingExistence(true);
      try {
        // First try to get detailed collection data
        const { data, error } = await collectionOperations.getCollection(COMMONS_COLLECTION_ID);
        
        if (error) {
          console.log(`Error checking collection ${COMMONS_COLLECTION_ID}:`, error);
          const exists = await checkCollectionExists(COMMONS_COLLECTION_ID);
          console.log(`Collection ${COMMONS_COLLECTION_ID} exists:`, exists);
          setCollectionExists(exists);
          
          if (exists) {
            setResult({
              success: true,
              collectionId: COMMONS_COLLECTION_ID,
              message: "Commons Cards collection is available but couldn't load details"
            });
          }
        } else if (data) {
          setCollectionData(data);
          setCollectionExists(true);
          setResult({
            success: true,
            collectionId: COMMONS_COLLECTION_ID,
            message: "Commons Cards collection is already available"
          });
        } else {
          setCollectionExists(false);
        }
      } catch (err) {
        console.error("Error checking collection existence:", err);
        setCollectionExists(false);
      } finally {
        setIsCheckingExistence(false);
      }
    };

    checkCollection();
  }, [COMMONS_COLLECTION_ID]);

  // Check collection existence after generation
  useEffect(() => {
    if (result?.success && result?.collectionId && !collectionData) {
      const verifyCollection = async () => {
        try {
          const { data, error } = await collectionOperations.getCollection(result.collectionId);
            
          if (error || !data) {
            console.error('Collection verification failed:', error || 'No data returned');
            toast.error('Created collection could not be verified');
          } else {
            console.log('Collection verified:', data);
            setCollectionData(data);
            setCollectionExists(true);
          }
        } catch (err) {
          console.error('Error checking collection:', err);
        }
      };
      
      verifyCollection();
    }
  }, [result, collectionData]);

  const handleGenerateCommonsCards = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log("Starting Commons Cards generation request...");
      
      const { data, error } = await supabase.functions.invoke('populate-cards', {
        body: { 
          timestamp: new Date().toISOString(),
          collectionId: COMMONS_COLLECTION_ID
        }
      });
      
      console.log("Edge function response:", { data, error });
      
      if (error) {
        console.error('Error generating Commons Cards:', error);
        toast.error(`Failed to generate Commons Cards: ${error.message}`);
        setResult({ success: false, error: error.message });
        return;
      }
      
      if (!data || !data.collectionId) {
        console.error('Invalid response from function:', data);
        toast.error('Received invalid response from server');
        setResult({ 
          success: false, 
          error: 'The server returned an invalid response. Cards may not have been created correctly.' 
        });
        return;
      }
      
      console.log('Commons Cards generated successfully:', data);
      toast.success(data.message || 'Commons Cards collection created/updated successfully');
      
      // Set the result with the collection ID
      setResult({ 
        success: true, 
        message: data.message || 'Commons Cards created successfully!',
        collectionId: data.collectionId || COMMONS_COLLECTION_ID
      });
      
      // Refresh collection status
      setTimeout(async () => {
        const { data: collectionData } = await collectionOperations.getCollection(COMMONS_COLLECTION_ID);
        if (collectionData) {
          setCollectionData(collectionData);
          setCollectionExists(true);
        }
      }, 1000);
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
      setResult({ 
        success: false, 
        error: err.message || 'Connection error or timeout occurred' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCollection = () => {
    const collectionIdToUse = result?.collectionId || COMMONS_COLLECTION_ID;
    navigate(`/collections/${collectionIdToUse}?refresh=true`);
  };

  return (
    <PageLayout
      title="Commons Cards | CardShow"
      description="Generate a collection of cards using public domain images from Wikimedia Commons"
    >
      <Container className="py-8">
        <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Commons Cards Generator</h1>
            <p className="text-muted-foreground">
              Create or update a collection of trading cards featuring public domain images from Wikimedia Commons.
              Perfect for testing and demonstration purposes.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-8 shadow-sm">
            {isCheckingExistence ? (
              <div className="text-center p-6">
                <LoadingState size={24} className="mx-auto mb-4" />
                <p>Checking collection status...</p>
              </div>
            ) : collectionExists && !result?.error ? (
              <div className="text-center space-y-4">
                <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                  <h2 className="text-2xl font-semibold text-primary mb-2">
                    Commons Cards Collection Available
                  </h2>
                  {collectionData && (
                    <div className="mb-4">
                      <p className="font-medium">{collectionData.name}</p>
                      {collectionData.description && (
                        <p className="text-sm text-muted-foreground">{collectionData.description}</p>
                      )}
                    </div>
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
                
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    You can regenerate the Commons Cards collection if you want to refresh the content.
                  </p>
                  <Button 
                    onClick={handleGenerateCommonsCards}
                    variant="outline"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingState size={16} className="mr-2" /> 
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate Commons Cards
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : !result?.success && !result?.error ? (
              <div className="text-center">
                <p className="mb-6">
                  This will create or update the "Commons Cards" collection with sample trading cards
                  featuring public domain images from Wikimedia Commons.
                </p>

                <Button
                  onClick={handleGenerateCommonsCards}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <>
                      <LoadingState size={16} className="mr-2" />
                      Generating Commons Cards...
                    </>
                  ) : (
                    'Create/Update Commons Cards Collection'
                  )}
                </Button>
              </div>
            ) : null}

            {result?.error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {result.error}
                  <div className="mt-4">
                    <Button onClick={handleGenerateCommonsCards} variant="outline" className="mr-2" disabled={isLoading}>
                      {isLoading ? (
                        <LoadingState size={16} className="mr-2" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Try Again
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {result?.success && !collectionExists && (
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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingState size={16} className="mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
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
