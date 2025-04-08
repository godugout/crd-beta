import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { MobileBottomBar, MobileActionFab } from '@/components/ui/mobile-controls';
import { useAuth } from '@/context/auth';
import { Collection } from '@/lib/types';
import { supabase } from '@/lib/supabase';

const Collections: React.FC = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('mine');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchCollections();
  }, [user, activeTab]);
  
  const fetchCollections = async () => {
    setIsLoading(true);
    
    try {
      if (!user) {
        setCollections([]);
        return;
      }
      
      let query = supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (activeTab === 'mine') {
        query = query.eq('owner_id', user.id);
      } else if (activeTab === 'public') {
        query = query.eq('visibility', 'public');
      }
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching collections:', error);
      } else if (data) {
        const formattedCollections = data.map(collection => ({
          id: collection.id,
          name: collection.title || '',
          description: collection.description || '',
          coverImageUrl: collection.cover_image_url || '',
          userId: collection.owner_id,
          visibility: collection.visibility || 'public',
          allowComments: collection.allow_comments !== undefined ? collection.allow_comments : true,
          createdAt: collection.created_at,
          updatedAt: collection.updated_at
        }));
        
        setCollections(formattedCollections);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Container className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Collections</h1>
        <Input
          type="search"
          placeholder="Search collections..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>
      
      <Tabs defaultValue="mine" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="mine">My Collections</TabsTrigger>
          <TabsTrigger value="public">Public Collections</TabsTrigger>
        </TabsList>
        <TabsContent value="mine">
          {isLoading ? (
            <p>Loading collections...</p>
          ) : filteredCollections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredCollections.map(collection => (
                <Card key={collection.id} className="overflow-hidden">
                  <div className="h-40 bg-gray-100">
                    {collection.coverImageUrl ? (
                      <img
                        src={collection.coverImageUrl}
                        alt={collection.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        No Cover Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{collection.name}</h2>
                    <p className="text-sm text-gray-500">{collection.description}</p>
                    <Link to={`/collections/${collection.id}`} className="text-blue-500 hover:underline block mt-2">
                      View Collection
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p>No collections found.</p>
          )}
        </TabsContent>
        <TabsContent value="public">
          {isLoading ? (
            <p>Loading collections...</p>
          ) : filteredCollections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredCollections.map(collection => (
                <Card key={collection.id} className="overflow-hidden">
                  <div className="h-40 bg-gray-100">
                    {collection.coverImageUrl ? (
                      <img
                        src={collection.coverImageUrl}
                        alt={collection.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        No Cover Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{collection.name}</h2>
                    <p className="text-sm text-gray-500">{collection.description}</p>
                    <Link to={`/collections/${collection.id}`} className="text-blue-500 hover:underline block mt-2">
                      View Collection
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p>No public collections found.</p>
          )}
        </TabsContent>
      </Tabs>
      
      {user && (
        <MobileBottomBar>
          <Link to="/collections/new">
            <MobileActionFab icon={<Plus />} onClick={() => {}} />
          </Link>
        </MobileBottomBar>
      )}
    </Container>
  );
};

export default Collections;
