
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import ThemeCustomizer from '@/components/brand/ThemeCustomizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Paintbrush, Palette, Image, Globe } from 'lucide-react';

const BrandCustomizationPage: React.FC = () => {
  return (
    <PageLayout
      title="Brand Customization"
      description="Customize your collection's appearance with themes and branding"
      primaryAction={{
        label: "Preview",
        icon: <Globe className="h-4 w-4" />,
        href: "/"
      }}
    >
      <div className="container mx-auto max-w-6xl py-6">
        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="themes">
              <Palette className="h-4 w-4 mr-2" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="assets">
              <Image className="h-4 w-4 mr-2" />
              Brand Assets
            </TabsTrigger>
            <TabsTrigger value="styles">
              <Paintbrush className="h-4 w-4 mr-2" />
              Custom Styling
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="themes">
            <ThemeCustomizer />
          </TabsContent>
          
          <TabsContent value="assets">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Brand assets customization coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="styles">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Advanced styling options coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default BrandCustomizationPage;
