import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/lib/types';
import { Collection } from '../lib/types';

const MemoryPackCreator = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { cards, collections, addCollection, updateCollection } = useCards();
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [wrapperColor, setWrapperColor] = useState('#006341'); // Default to Oakland A's green
  const [wrapperPattern, setWrapperPattern] = useState('solid');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'team'>('public');
  const [allowComments, setAllowComments] = useState(true);

  useEffect(() => {
    if (id && id !== 'new') {
      const pack = collections.find(c => c.id === id);
      if (pack) {
        setName(pack.name);
        setDescription(pack.description || '');
        setWrapperColor(pack.designMetadata?.wrapperColor || '#006341');
        setWrapperPattern(pack.designMetadata?.wrapperPattern || 'solid');
        setVisibility(pack.visibility || 'public');
        setAllowComments(pack.allowComments !== false);
        
        if (pack.cards && pack.cards.length > 0) {
          setSelectedCards(pack.cards);
        }
      }
    }
  }, [id, collections]);

  const handleSave = () => {
    const packData = {
      name,
      description,
      designMetadata: {
        wrapperColor,
        wrapperPattern,
        packType: 'memory-pack'
      },
      visibility,
      allowComments
    };
    
    if (id && id !== 'new') {
      updateCollection(id, packData as Partial<Omit<Collection, "id" | "cards" | "createdAt" | "updatedAt">>);
    } else {
      addCollection(packData as Collection);
    }
    
    navigate('/packs');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">
            {id && id !== 'new' ? 'Edit Memory Pack' : 'Create Memory Pack'}
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Pack Name</Label>
                    <Input 
                      id="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="My Memory Pack"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Add a description for your memory pack"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Pack Design</h2>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="wrapperColor">Wrapper Color</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Input
                        id="wrapperColor"
                        type="color"
                        value={wrapperColor}
                        onChange={e => setWrapperColor(e.target.value)}
                        className="w-16 h-10"
                      />
                      <span className="text-sm text-gray-500">{wrapperColor}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Wrapper Pattern</Label>
                    <RadioGroup 
                      value={wrapperPattern}
                      onValueChange={setWrapperPattern}
                      className="grid grid-cols-2 gap-4 mt-2 sm:grid-cols-4"
                    >
                      <div>
                        <RadioGroupItem id="pattern-solid" value="solid" className="sr-only" />
                        <Label 
                          htmlFor="pattern-solid" 
                          className={`flex flex-col items-center space-y-1 border-2 rounded-md p-4 cursor-pointer ${
                            wrapperPattern === 'solid' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="h-12 w-12 bg-gray-500 rounded" />
                          <span className="text-sm font-medium">Solid</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem id="pattern-striped" value="striped" className="sr-only" />
                        <Label 
                          htmlFor="pattern-striped" 
                          className={`flex flex-col items-center space-y-1 border-2 rounded-md p-4 cursor-pointer ${
                            wrapperPattern === 'striped' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="h-12 w-12 bg-gray-300 flex flex-col justify-around">
                            <div className="h-1 bg-gray-500" />
                            <div className="h-1 bg-gray-500" />
                            <div className="h-1 bg-gray-500" />
                          </div>
                          <span className="text-sm font-medium">Striped</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem id="pattern-dots" value="dots" className="sr-only" />
                        <Label 
                          htmlFor="pattern-dots" 
                          className={`flex flex-col items-center space-y-1 border-2 rounded-md p-4 cursor-pointer ${
                            wrapperPattern === 'dots' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="h-12 w-12 bg-gray-300 relative">
                            <div className="absolute top-2 left-2 h-2 w-2 bg-gray-500 rounded-full" />
                            <div className="absolute top-2 right-2 h-2 w-2 bg-gray-500 rounded-full" />
                            <div className="absolute bottom-2 left-2 h-2 w-2 bg-gray-500 rounded-full" />
                            <div className="absolute bottom-2 right-2 h-2 w-2 bg-gray-500 rounded-full" />
                          </div>
                          <span className="text-sm font-medium">Dots</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem id="pattern-gradient" value="gradient" className="sr-only" />
                        <Label 
                          htmlFor="pattern-gradient" 
                          className={`flex flex-col items-center space-y-1 border-2 rounded-md p-4 cursor-pointer ${
                            wrapperPattern === 'gradient' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="h-12 w-12 bg-gradient-to-br from-gray-300 to-gray-600" />
                          <span className="text-sm font-medium">Gradient</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Pack Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Visibility</Label>
                    <RadioGroup 
                      value={visibility}
                      onValueChange={(value) => setVisibility(value as 'public' | 'private' | 'team')}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="visibility-public" value="public" />
                        <Label htmlFor="visibility-public">Public</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="visibility-private" value="private" />
                        <Label htmlFor="visibility-private">Private</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="visibility-team" value="team" />
                        <Label htmlFor="visibility-team">Team</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox
                      id="allow-comments"
                      checked={allowComments}
                      onCheckedChange={() => setAllowComments(!allowComments)}
                    />
                    <div>
                      <Label htmlFor="allow-comments" className="font-medium">Allow Comments</Label>
                      <p className="text-sm text-gray-500">Let others comment on your memory pack</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Pack Preview</h2>
                
                <div 
                  className="w-full aspect-[3/4] rounded-lg relative overflow-hidden mb-4"
                  style={{
                    backgroundColor: wrapperColor,
                    backgroundImage: 
                      wrapperPattern === 'striped' ? `repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)` :
                      wrapperPattern === 'dots' ? `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)` :
                      wrapperPattern === 'gradient' ? `linear-gradient(135deg, ${wrapperColor}, rgba(0,0,0,0.3))` :
                      'none',
                    backgroundSize: wrapperPattern === 'dots' ? '10px 10px' : '100% 100%'
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{name || 'Memory Pack'}</h3>
                    <div className="text-sm text-white/80">{description || 'Pack description will appear here'}</div>
                    <div className="mt-4 text-sm text-white/90">Contains {selectedCards.length} memories</div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => navigate('/packs')}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    {id && id !== 'new' ? 'Update Pack' : 'Create Pack'}
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Selected Cards ({selectedCards.length})</h2>
                
                {selectedCards.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCards.map(card => (
                      <div key={card.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                        <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                          {card.imageUrl && <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{card.title}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCards(cards => cards.filter(c => c.id !== card.id))}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <p>No cards selected yet</p>
                  </div>
                )}
                
                <Button variant="outline" className="w-full mt-4">
                  Add Cards
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemoryPackCreator;
