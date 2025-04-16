
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardGalleryComponent from '@/components/CardGallery';
import { cardsNavItems } from '@/config/navigation';
import ContentTypeNavigation from '@/components/navigation/ContentTypeNavigation';

const CardGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Create navigation items for content type navigation
  const navigationItems = cardsNavItems.map(item => ({
    label: item.label,
    path: item.path,
    icon: item.icon ? <item.icon className="h-4 w-4" /> : undefined,
    description: item.description
  }));

  return (
    <PageLayout
      title="Card Gallery"
      hideBreadcrumbs={false}
      onSearch={setSearchQuery}
      searchPlaceholder="Search cards..."
    >
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="mb-8">
          <ContentTypeNavigation 
            items={navigationItems}
            variant="pills"
          />
        </div>
        
        <CardGalleryComponent 
          searchQuery={searchQuery}
        />
      </div>
    </PageLayout>
  );
};

export default CardGallery;
