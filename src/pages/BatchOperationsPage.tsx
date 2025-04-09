
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageLayout from '@/components/navigation/PageLayout';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import BatchOperations from '@/components/dam/BatchOperations';
import BatchImageUploader from '@/components/dam/BatchImageUploader';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { toast } from 'sonner';
import AssetOrganizer from '@/components/dam/AssetOrganizer';
import { useDam } from '@/providers/DamProvider';

const BatchOperationsPage = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { refreshAssets } = useDam(); // Use our new DAM context

  const handleBatchUploadComplete = (urls: string[]) => {
    setUploadedImages(urls);
    toast.success(`Successfully uploaded ${urls.length} images`);
    setRefreshTrigger(prev => prev + 1);
    refreshAssets(); // Refresh assets after upload
  };

  return (
    <PageLayout title="Batch Operations" description="Manage multiple assets and cards">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link 
            to="/media-library"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Media Library
          </Link>
          
          <h1 className="text-3xl font-bold mt-4 mb-2">Batch Operations</h1>
          <p className="text-gray-600">Efficiently manage multiple assets and update cards in bulk</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="manage">Manage Cards</TabsTrigger>
            <TabsTrigger value="upload">Batch Upload</TabsTrigger>
            <TabsTrigger value="organize">Organize Assets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <BatchOperations 
                  key={`operations-${refreshTrigger}`}
                  onComplete={() => {
                    setRefreshTrigger(prev => prev + 1);
                    refreshAssets(); // Refresh assets when operations complete
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardContent className="pt-6">
                <BatchImageUploader
                  onComplete={handleBatchUploadComplete}
                />
                
                {uploadedImages.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Recently Uploaded</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="aspect-square rounded-md overflow-hidden">
                          <OptimizedImage
                            src={url}
                            alt={`Uploaded image ${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="organize">
            <Card>
              <CardContent className="pt-6">
                <AssetOrganizer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default BatchOperationsPage;
