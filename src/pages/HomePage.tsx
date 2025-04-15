
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';

const HomePage = () => {
  useEffect(() => {
    console.log('HomePage component mounted');
    document.title = 'CardShow - Home';
  }, []);

  return (
    <PageLayout title="Home" description="Welcome to CardShow">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to CardShow</h1>
        <p className="text-lg mb-8">
          Explore our collection of digital trading cards or create your own custom cards.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">View Cards</h2>
            <p className="mb-4">Browse through our collection of digital trading cards.</p>
            <Link 
              to="/cards" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Browse Collection
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Create Cards</h2>
            <p className="mb-4">Design and create your own custom digital trading cards.</p>
            <Link 
              to="/cards/create" 
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Card
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Fabric.js Editor Demo</h2>
            <p className="mb-4">Try our new card editor with powerful canvas manipulation.</p>
            <Link 
              to="/cards/editor-demo" 
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Try Canvas Editor
            </Link>
          </div>
        </div>
        
        <div className="mt-12 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Debug Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <Link to="/emergency" className="px-3 py-1 bg-red-600 text-white text-sm rounded">
              Emergency Page
            </Link>
            <Link to="/index" className="px-3 py-1 bg-gray-600 text-white text-sm rounded">
              Index Page
            </Link>
            <Link to="/about" className="px-3 py-1 bg-gray-600 text-white text-sm rounded">
              About Page
            </Link>
            <Link to="/profile" className="px-3 py-1 bg-gray-600 text-white text-sm rounded">
              Profile Page
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
