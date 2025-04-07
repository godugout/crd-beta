
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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
        setResult({ error: error.message });
        return;
      }
      
      console.log('Database populated successfully:', data);
      toast.success(data.message || 'Database populated successfully');
      setResult(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
      setResult({ error: err.message });
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
      
      {result && (
        <div className={`mt-4 p-4 rounded ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
          {result.success ? (
            <>
              <p className="font-medium text-green-700">{result.message}</p>
              <p className="text-sm text-green-600 mt-2">Collection ID: {result.collectionId}</p>
            </>
          ) : (
            <p className="font-medium text-red-700">Error: {result.error}</p>
          )}
        </div>
      )}
    </Card>
  );
};

export default PopulateDatabase;
