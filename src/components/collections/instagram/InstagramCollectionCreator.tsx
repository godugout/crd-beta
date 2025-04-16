
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCollection } from '@/context/card/hooks';
import { Collection } from '@/lib/types';

const InstagramCollectionCreator: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [username, setUsername] = useState('');
  const { addCollection } = useCollection();
  
  const handleConnectInstagram = async () => {
    setIsConnecting(true);
    try {
      // Simulate Instagram API connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new collection with Instagram content
      const newCollection: Collection = {
        id: `instagram-${Date.now()}`,
        title: `${username}'s Instagram`,
        description: `Photos imported from Instagram account @${username}`,
        cards: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        coverImageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
        tags: ['instagram', 'social', 'imported']
      };
      
      // Add the collection
      const result = await addCollection(newCollection);
      
      toast.success(`Successfully imported Instagram photos from @${username}`);
      setUsername('');
      
      // Navigate to the collection page - for now, just log
      console.log(`Created collection: ${result.id}`);
      
    } catch (error) {
      console.error('Error connecting to Instagram:', error);
      toast.error('Failed to connect to Instagram');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleAuthorize = async () => {
    try {
      // Simulate authorization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCollection: Collection = {
        id: `instagram-auth-${Date.now()}`,
        title: `${username}'s Instagram (Authorized)`,
        description: `Authorized connection to @${username}`,
        cards: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        coverImageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
        tags: ['instagram', 'social', 'imported', 'authorized']
      };
      
      // Add the collection
      const result = await addCollection(newCollection);
      
      toast.success(`Authorized connection to @${username}`);
      
      // Navigate to the new collection
      console.log(`Authorized collection: ${result.id}`);
      
    } catch (error) {
      console.error('Authorization error:', error);
      toast.error('Failed to authorize Instagram connection');
    }
  };
  
  const handleDisconnect = async () => {
    try {
      // Simulate disconnection
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const disconnectionRecord: Collection = {
        id: `instagram-disconnect-${Date.now()}`,
        title: 'Instagram Disconnection Record',
        description: `Disconnected from @${username}`,
        cards: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        coverImageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432',
        tags: ['instagram', 'disconnect']
      };
      
      // Record the disconnection
      const result = await addCollection(disconnectionRecord);
      
      toast.info(`Disconnected from Instagram account @${username}`);
      
      // Log disconnection record
      console.log(`Disconnection recorded: ${result.id}`);
      
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Failed to disconnect from Instagram');
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Import from Instagram</h2>
      <p className="text-gray-600 mb-6">
        Connect your Instagram account to import your photos as collectible cards.
      </p>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Instagram Username</label>
        <input 
          type="text" 
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="@username"
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      
      <div className="flex space-x-3">
        <Button 
          onClick={handleConnectInstagram}
          disabled={!username.trim() || isConnecting}
          className="bg-gradient-to-r from-purple-500 to-pink-500"
        >
          {isConnecting ? 'Connecting...' : 'Connect Instagram'}
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleAuthorize}
          disabled={!username.trim()}
        >
          Authorize
        </Button>
        
        <Button 
          variant="destructive"
          onClick={handleDisconnect}
          disabled={!username.trim()}
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
};

export default InstagramCollectionCreator;
