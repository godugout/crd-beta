import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { checkCollectionExists } from '@/lib/supabase/collections';
import { collectionOperations } from '@/lib/supabase/collections';

export const useCommonsCollection = (collectionId: string) => {
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

  const checkCollection = async () => {
    setIsCheckingExistence(true);
    try {
      const { data, error } = await collectionOperations.getCollection(collectionId);
      
      if (error) {
        console.log(`Error checking collection ${collectionId}:`, error);
        
        try {
          const exists = await checkCollectionExists(collectionId);
          console.log(`Collection ${collectionId} exists check result:`, exists);
          setCollectionExists(exists);
          
          if (exists) {
            setResult({
              success: true,
              collectionId: collectionId,
              message: "Commons Cards collection is available but couldn't load details"
            });
          } else {
            setResult({
              success: false,
              message: "Commons Cards collection does not exist"
            });
          }
        } catch (fallbackErr) {
          console.error("Error in fallback existence check:", fallbackErr);
          setCollectionExists(false);
          setResult({
            success: false,
            error: "Unable to connect to database. Please check your connection."
          });
        }
      } else if (data) {
        setCollectionData(data);
        setCollectionExists(true);
        setResult({
          success: true,
          collectionId: collectionId,
          message: "Commons Cards collection is already available"
        });
      } else {
        setCollectionExists(false);
        setResult({
          success: false,
          message: "Commons Cards collection does not exist"
        });
      }
    } catch (err: any) {
      console.error("Error checking collection existence:", err);
      setCollectionExists(false);
      setResult({
        success: false,
        error: err.message || "Unable to connect to database"
      });
    } finally {
      setIsCheckingExistence(false);
    }
  };

  const generateCommonsCards = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log("Starting Commons Cards generation request...");
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out after 15 seconds')), 15000);
      });
      
      const fetchPromise = supabase.functions.invoke('populate-cards', {
        body: { 
          timestamp: new Date().toISOString(),
          collectionId: collectionId
        }
      });
      
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      const { data, error } = response as any;
      
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
      
      setResult({ 
        success: true, 
        message: data.message || 'Commons Cards created successfully!',
        collectionId: data.collectionId || collectionId
      });
      
      setTimeout(async () => {
        try {
          const { data: collectionData } = await collectionOperations.getCollection(collectionId);
          if (collectionData) {
            setCollectionData(collectionData);
            setCollectionExists(true);
          }
        } catch (refreshErr) {
          console.error('Error refreshing collection data:', refreshErr);
        }
      }, 1000);
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.error(err.message || 'An unexpected error occurred');
      setResult({ 
        success: false, 
        error: err.message || 'Connection error or timeout occurred' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (collectionId) {
      checkCollection();
    }
  }, [collectionId]);

  return {
    isLoading,
    isCheckingExistence,
    collectionExists,
    collectionData,
    result,
    generateCommonsCards,
    checkCollection
  };
};
