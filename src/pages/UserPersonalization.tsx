
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import UserPreferencesDashboard from '@/components/personalization/UserPreferencesDashboard';
import BrandProfileManager from '@/components/personalization/BrandProfileManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalizationProvider } from '@/context/PersonalizationContext';

const UserPersonalization = () => {
  return (
    <PageLayout
      title="Personalization"
      description="Customize your CRD experience"
    >
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <Tabs defaultValue="preferences">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="brand">Brand Profiles</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="preferences">
            <UserPreferencesDashboard />
          </TabsContent>
          
          <TabsContent value="brand">
            <PersonalizationProvider>
              <BrandProfileManager />
            </PersonalizationProvider>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default UserPersonalization;
