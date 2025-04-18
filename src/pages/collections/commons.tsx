
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorAlert } from '@/components/commons/ErrorAlert';
import { CollectionStatus } from '@/components/commons/CollectionStatus';
import { InitialGenerationState } from '@/components/commons/InitialGenerationState';
import { useCommonsCollection } from '@/hooks/useCommonsCollection';

const COMMONS_COLLECTION_ID = '5d034aa4-86e0-4ca7-92c5-1fbd8e71943c';

const CommonsCardsPage = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    isCheckingExistence,
    collectionExists,
    collectionData,
    result,
    generateCommonsCards,
    checkCollection
  } = useCommonsCollection(COMMONS_COLLECTION_ID);

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
                <LoadingState size="lg" className="mx-auto mb-4" />
                <p>Checking collection status...</p>
              </div>
            ) : collectionExists && !result?.error ? (
              <CollectionStatus
                collectionData={collectionData}
                isLoading={isLoading}
                onViewCollection={handleViewCollection}
                onRegenerate={generateCommonsCards}
              />
            ) : !result?.success && !result?.error ? (
              <InitialGenerationState
                onGenerate={generateCommonsCards}
                isLoading={isLoading}
              />
            ) : null}

            {result?.error && (
              <ErrorAlert
                error={result.error}
                onRetry={generateCommonsCards}
                isLoading={isLoading}
              />
            )}

            {result?.success && !collectionExists && (
              <CollectionStatus
                collectionData={collectionData}
                isLoading={isLoading}
                onViewCollection={handleViewCollection}
                onRegenerate={generateCommonsCards}
              />
            )}
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default CommonsCardsPage;
