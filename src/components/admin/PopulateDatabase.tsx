
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const PopulateDatabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    collectionId?: string;
    error?: string;
  } | null>(null);

  const handlePopulateDatabase = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      // Add a timeout to the request to prevent hanging indefinitely
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out after 15 seconds')), 15000);
      });
      
      // Call the edge function with a race against the timeout
      const responsePromise = supabase.functions.invoke('populate-cards');
      const result = await Promise.race([responsePromise, timeoutPromise]);
      
      const { data, error } = result as any; // Cast the result of the race
      
      if (error) {
        console.error('Error populating database:', error);
        toast.error('Failed to populate database');
        setResult({ success: false, error: error.message });
        return;
      }
      
      console.log('Database populated successfully:', data);
      toast.success(data.message || 'Database populated successfully');
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
  
  // Function to retry connection
  const handleRetry = () => {
    // Clear any cached error states
    setResult(null);
    // Try again
    handlePopulateDatabase();
  };
  
  return (
    <Card className="p-6 shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Populate Database with Sample Cards</h2>
      <p className="text-gray-600 mb-6">
        This will add sample trading cards to your database for testing. The cards include sports
        memorabilia and trading card game collectibles with images sourced from Wikimedia Commons.
      </p>
      
      {!result?.success && result?.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {result.error}
            <div className="mt-2 text-sm">
              Make sure your Supabase Edge Function is deployed and configured correctly.
              {result.error.includes('fetch') && (
                <div className="mt-1">
                  This could be a connection issue. Check your network and Supabase project status.
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex space-x-3">
        <Button 
          onClick={handlePopulateDatabase} 
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Populating Database...
            </>
          ) : 'Populate Database with Sample Cards'}
        </Button>
        
        {result?.error && (
          <Button 
            onClick={handleRetry}
            variant="outline" 
            className="px-3"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {result?.success && (
        <div className="mt-4 p-4 rounded bg-green-50">
          <p className="font-medium text-green-700">{result.message}</p>
          {result.collectionId && (
            <p className="text-sm text-green-600 mt-2">Collection ID: {result.collectionId}</p>
          )}
        </div>
      )}
    </Card>
  );
};

export default PopulateDatabase;
