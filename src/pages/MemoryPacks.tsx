
import React from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';
import MemoryPacksSection from '@/components/card-showcase/MemoryPacksSection';

const MemoryPacks = () => {
  const { collections, isLoading } = useCards();
  
  const handleViewPack = (packId: string) => {
    // This is handled by the Link component in MemoryPacksSection
    // but kept here in case we need additional logic in the future
  };
  
  return (
    <PageLayout title="Memory Packs" description="Browse and collect memory packs">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Memory Packs</h1>
            <p className="text-gray-600 mt-2">Browse and collect themed memory packs</p>
          </div>
          <Button asChild>
            <Link to="/create-memory-pack">
              <Plus className="mr-2 h-4 w-4" /> Create Pack
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">Loading memory packs...</div>
        ) : collections.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-medium">No memory packs yet</h2>
            <p className="mt-2 text-gray-500">Create your first memory pack to get started</p>
            <Button asChild className="mt-4">
              <Link to="/create-memory-pack">Create Memory Pack</Link>
            </Button>
          </div>
        ) : (
          <MemoryPacksSection 
            isLoading={isLoading} 
            packs={collections} 
            handleViewPack={handleViewPack} 
          />
        )}
      </div>
    </PageLayout>
  );
};

export default MemoryPacks;
