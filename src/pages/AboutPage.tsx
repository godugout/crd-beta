
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';

const AboutPage = () => {
  return (
    <PageLayout title="About" description="About our card application">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <p className="text-lg mb-4">
          We are dedicated to providing a platform for card collectors and enthusiasts.
        </p>
      </div>
    </PageLayout>
  );
};

export default AboutPage;
