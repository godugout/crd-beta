
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssetGallery from '@/components/dam/AssetGallery';
import ImageUploader from '@/components/dam/ImageUploader';
import { ChevronLeft, Plus, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MediaLibrary = () => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleUploadComplete = () => {
    setActiveTab('gallery');
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <PageLayout title="Media Library" description="Manage your digital assets">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to dashboard
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Media Library</h1>
              <p className="text-gray-600">Upload and manage images for your cards and collections</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setActiveTab('upload')}>
                <Plus className="h-4 w-4 mr-2" />
                Upload New
              </Button>
              <Button variant="outline" asChild>
                <Link to="/batch-operations">
                  <Images className="h-4 w-4 mr-2" />
                  Batch Operations
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'gallery' | 'upload')}
        >
          <TabsList className="mb-8">
            <TabsTrigger value="gallery">Media Gallery</TabsTrigger>
            <TabsTrigger value="upload">Upload Media</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery">
            <AssetGallery 
              key={refreshTrigger}
              showActions={true}
            />
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto">
                  <ImageUploader 
                    title="Upload Image to Library"
                    maxSizeMB={10}
                    onUploadComplete={() => handleUploadComplete()}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default MediaLibrary;
