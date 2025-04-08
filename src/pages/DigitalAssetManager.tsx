
import React from 'react';
import Navbar from '@/components/Navbar';
import AssetManager from '@/components/asset-manager/AssetManager';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const DigitalAssetManagerPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Link to="/">
                  <Button variant="ghost" size="sm" className="flex items-center mb-2">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Dashboard
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold">Digital Asset Manager</h1>
                <p className="text-gray-500 mt-1">
                  Manage all your digital assets in one place
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 h-[calc(100vh-200px)]">
              <AssetManager showUploadTab={true} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DigitalAssetManagerPage;
