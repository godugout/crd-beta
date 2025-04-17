
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw, AlertTriangle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const CommonsCardsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    collectionId?: string;
    error?: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleGenerateCommonsCards = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log("Starting Commons Cards generation request...");
      
      // Call the edge function with proper error handling
      const { data, error } = await supabase.functions.invoke('populate-cards', {
        body: { timestamp: new Date().toISOString() }
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
      setResult({ ...data, success: true });
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
    if (result?.collectionId) {
      navigate(`/collections/${result.collectionId}`);
    }
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
            {!result?.success && !result?.error && (
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
