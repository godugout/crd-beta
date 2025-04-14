
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <PageLayout title="404" description="Page not found">
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-5xl font-bold mb-6">404</h1>
        <p className="text-xl mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-block bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          Go Home
        </Link>
      </div>
    </PageLayout>
  );
};

export default NotFoundPage;
