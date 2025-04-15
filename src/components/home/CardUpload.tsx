
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { CardData } from '@/types/card';

interface CardUploadProps {
  setView: (view: 'showcase' | 'collection' | 'upload' | 'welcome') => void;
}

const CardUpload = ({ setView }: CardUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<CardData>>({
    name: '',
    year: '',
    set: '',
    cardNumber: '',
    description: '',
    specialEffect: 'Classic Holographic',
  });
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpload = () => {
    // In a real app, we would upload the file to a server here
    // Create card data
    const newCard: CardData = {
      id: Date.now(),
      name: formData.name || 'Untitled Card',
      description: formData.description || '',
      imageUrl: file ? URL.createObjectURL(file) : undefined,
      metadata: {
        year: formData.year,
        cardNumber: formData.cardNumber,
        set: formData.set,
      },
      effects: formData.specialEffect ? [formData.specialEffect] : [],
    };
    
    // For now, just navigate to the collection view
    console.log('New card data:', newCard);
    setView('collection');
  };
  
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Upload Your Card</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Card Image</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Drag and drop your card image here, or click to browse</p>
            <input 
              type="file" 
              className="hidden" 
              id="card-upload" 
              accept="image/*" 
              onChange={handleFileSelect}
            />
            <label htmlFor="card-upload" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition cursor-pointer">
              Select Image
            </label>
            {file && (
              <p className="mt-2 text-sm text-green-600">{file.name} selected</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Card Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="e.g. Michael Jordan Rookie" 
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Year</label>
          <input 
            type="text" 
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="e.g. 1986" 
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Set/Brand</label>
          <input 
            type="text" 
            name="set"
            value={formData.set}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="e.g. Fleer" 
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Card Number</label>
          <input 
            type="text" 
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="e.g. 57" 
          />
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-gray-700 font-medium mb-2">Description</label>
        <textarea 
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md h-24" 
          placeholder="Add any details about your card's condition, history, or why it's special to you"
        ></textarea>
      </div>
      
      <div className="mt-6">
        <label className="block text-gray-700 font-medium mb-2">Special Effect</label>
        <select 
          name="specialEffect"
          value={formData.specialEffect}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option>Classic Holographic</option>
          <option>Refractor</option>
          <option>Prism</option>
          <option>Chrome</option>
          <option>Gold Foil</option>
          <option>Vintage</option>
        </select>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button 
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg mr-4 hover:bg-gray-300 transition"
          onClick={() => setView('collection')}
        >
          Cancel
        </button>
        <button 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={handleUpload}
        >
          Upload Card
        </button>
      </div>
    </div>
  );
};

export default CardUpload;
