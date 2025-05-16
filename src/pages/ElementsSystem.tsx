
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PersonalizationProvider } from '@/context/PersonalizationContext';
import UserPreferencePanel from '@/components/personalization/UserPreferencePanel';
import BrandProfileManager from '@/components/personalization/BrandProfileManager';

// Example elements system demonstration component
const ElementsSystemDemo = () => {
  const [activeTab, setActiveTab] = useState('personalization');

  return (
    <PersonalizationProvider>
      <div className="container mx-auto p-4">
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="personalization">User Preferences</TabsTrigger>
            <TabsTrigger value="brands">Brand Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personalization" className="space-y-6">
            <UserPreferencePanel />
          </TabsContent>
          
          <TabsContent value="brands" className="space-y-6">
            <BrandProfileManager />
          </TabsContent>
        </Tabs>
      </div>
    </PersonalizationProvider>
  );
};

const ElementsSystem = () => {
  return (
    <PageLayout
      title="Elements System"
      description="Create and manage custom elements for your cards"
    >
      <ElementsSystemDemo />
    </PageLayout>
  );
};

export default ElementsSystem;
