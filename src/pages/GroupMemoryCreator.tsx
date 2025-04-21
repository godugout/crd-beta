
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import GroupImageUploader from '@/components/group-memory/GroupImageUploader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const GroupMemoryCreator = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('upload');
  const [uploadedCardIds, setUploadedCardIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCardUploadComplete = (cardIds: string[]) => {
    setUploadedCardIds(cardIds);
    if (cardIds.length > 0) {
      toast.success(`${cardIds.length} ${cardIds.length === 1 ? 'card' : 'cards'} uploaded successfully`);
      // Auto-advance to next step if cards were uploaded
      setSelectedTab('title');
    }
  };
  
  const handleImageSelect = (files: File[]) => {
    console.log('Selected files:', files);
    // This handler is required by the component props but the actual implementation
    // will be handled by the GroupImageUploader component internally
  };
  
  const handleSubmitGroup = async () => {
    if (uploadedCardIds.length === 0) {
      toast.error('Upload at least one image first');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const groupId = uuidv4();
      
      // Here we would normally save the group memory to the database
      // For now we'll just simulate a successful creation
      
      toast.success('Group memory created successfully!');
      navigate(`/group-memories/${groupId}`);
    } catch (error) {
      console.error('Error creating group memory:', error);
      toast.error('Failed to create group memory');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      title="Create Group Memory"
      description="Upload multiple photos to create a group memory"
    >
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="upload">Upload Photos</TabsTrigger>
            <TabsTrigger value="title">Add Details</TabsTrigger>
            <TabsTrigger value="layout">Choose Layout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Your Photos</h2>
              <p className="text-gray-600 mb-6">
                Upload multiple photos to create a group memory. You can arrange them later.
              </p>
              
              <GroupImageUploader 
                onImageSelect={handleImageSelect}
                onComplete={handleCardUploadComplete} 
                className="mb-6" 
              />
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => setSelectedTab('title')} 
                  disabled={uploadedCardIds.length === 0}
                >
                  Next: Add Details
                </Button>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="title">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add Group Details</h2>
              <p className="text-gray-600 mb-6">
                Add a title and description to your group memory.
              </p>
              
              {/* Form fields would go here */}
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setSelectedTab('upload')}>
                  Back
                </Button>
                <Button onClick={() => setSelectedTab('layout')}>
                  Next: Choose Layout
                </Button>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="layout">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Choose Layout</h2>
              <p className="text-gray-600 mb-6">
                Select a layout for your group memory.
              </p>
              
              {/* Layout options would go here */}
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setSelectedTab('title')}>
                  Back
                </Button>
                <Button onClick={handleSubmitGroup}>
                  Create Group Memory
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default GroupMemoryCreator;
