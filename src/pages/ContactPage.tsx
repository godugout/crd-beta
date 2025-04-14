
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';

const ContactPage = () => {
  return (
    <PageLayout title="Contact" description="Contact us">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg mb-4">
          Have questions or feedback? Reach out to our team.
        </p>
      </div>
    </PageLayout>
  );
};

export default ContactPage;
