
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
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
      const { data, error } = await supabase.functions.invoke('populate-cards');
      
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
      setResult({ success: false, error: err.message });
    } finally {
      setIsLoading(false);
    }
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
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handlePopulateDatabase} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Populating Database...
          </>
        ) : 'Populate Database with Sample Cards'}
      </Button>
      
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
