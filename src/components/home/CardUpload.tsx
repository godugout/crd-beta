import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import ImageUploader from '@/components/dam/ImageUploader';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface CardUploadProps {
  setView: (view: 'showcase' | 'collection' | 'upload' | 'welcome') => void;
  onCardCreated?: (cardId: string) => void;
}

const CardUpload = ({ setView, onCardCreated }: CardUploadProps) => {
  const navigate = useNavigate();
  const { addCard } = useCards();
  
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [set, setSet] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [description, setDescription] = useState('');
  const [specialEffect, setSpecialEffect] = useState('Classic Holographic');
  const [team, setTeam] = useState('');
  
  const handleImageUpload = (url: string, assetId: string) => {
    setImageUrl(url);
    toast.success('Image uploaded successfully!');
  };
  
  const handleUpload = async () => {
    if (!imageUrl) {
      toast.error('Please upload an image first');
      return;
    }
    
    if (!name) {
      toast.error('Please provide a card name');
      return;
    }
    
    try {
      // Create a unique ID
      const cardId = `card-${Date.now()}`;
      
      // Add the card to the context
      await addCard({
        id: cardId,
        name,
        imageUrl,
        backgroundColor: "#5B23A9",
        textColor: "white",
        cardType: "Custom Card",
        set,
        cardNumber,
        description,
        specialEffect,
        // We use "as any" here because the Card type might not include team 
        // but we need to add it. The proper fix would be to update the Card type.
        team: team as any,
        year,
        tags: ["custom", "digital"]
      });
      
      toast.success('Card created successfully!');
      
      // Navigate to immersive view or call callback
      if (onCardCreated) {
        onCardCreated(cardId);
      } else {
        navigate(`/immersive/${cardId}`);
      }
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create Your Card</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Card Image</label>
        {imageUrl ? (
          <div className="relative w-48 h-64 mx-auto mb-4">
            <img 
              src={imageUrl}
              alt="Card preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <Button 
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setImageUrl('')}
            >
              Change
            </Button>
          </div>
        ) : (
          <div className="max-w-sm mx-auto">
            <ImageUploader
              onUploadComplete={handleImageUpload}
              title="Upload Card Image"
              showPreview={true}
            />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Card Name</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="e.g. Michael Jordan Rookie" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Team/Club</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="e.g. Chicago Bulls" 
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Year</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="e.g. 1986" 
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Set/Brand</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="e.g. Fleer" 
            value={set}
            onChange={(e) => setSet(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Card Number</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="e.g. 57" 
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Special Effect</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={specialEffect}
            onChange={(e) => setSpecialEffect(e.target.value)}
          >
            <option>Classic Holographic</option>
            <option>Refractor</option>
            <option>Prismatic</option>
            <option>Electric</option>
            <option>Gold Foil</option>
            <option>Chrome</option>
            <option>Vintage</option>
          </select>
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-gray-700 font-medium mb-2">Description</label>
        <textarea 
          className="w-full px-3 py-2 border border-gray-300 rounded-md h-24" 
          placeholder="Add any details about your card's condition, history, or why it's special to you"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button 
          variant="outline"
          className="mr-4"
          onClick={() => setView('welcome')}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleUpload}
          disabled={!imageUrl || !name}
        >
          Create Card
        </Button>
      </div>
    </div>
  );
};

export default CardUpload;
