
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssetCardCreator } from '@/components/cards/AssetCardCreator';
import { AssetCardDisplay } from '@/components/cards/AssetCardDisplay';
import PageLayout from '@/components/navigation/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const CardAssetCreatorPage = () => {
  const navigate = useNavigate();
  const [createdBundle, setCreatedBundle] = useState<{ cardId: string; bundleId: string } | null>(null);
  
  // Hardcoded user ID for demo purposes - in a real app, get this from authentication
  const userId = 'current-user';
  
  const handleComplete = (result: { cardId: string; bundleId: string }) => {
    setCreatedBundle(result);
  };
  
  const handleCreateAnother = () => {
    setCreatedBundle(null);
  };

  const handleViewCard = () => {
    if (createdBundle) {
      navigate(`/cards/${createdBundle.cardId}`);
    }
  };
  
  return (
    <PageLayout
      title="Create Card"
      description="Create a new card with your assets"
      hideBreadcrumbs={false}
    >
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {!createdBundle ? (
          <Card>
            <CardContent className="p-6">
              <AssetCardCreator 
                userId={userId} 
                onComplete={handleComplete} 
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                Your card has been created successfully!
              </p>
            </div>
            
            <AssetCardDisplay 
              bundleId={createdBundle.bundleId}
            />
            
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button 
                variant="outline"
                onClick={handleCreateAnother}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Another Card
              </Button>
              
              <Button onClick={handleViewCard}>
                View Card Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CardAssetCreatorPage;
