
import React, { useState } from 'react';
import { fabric } from 'fabric';
import CardEditor from '@/components/card-editor/CardEditor';
import PageLayout from '@/components/navigation/PageLayout';

const CardEditorDemo: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const handleSave = (canvas: fabric.Canvas) => {
    // Save canvas as image
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1
    });
    
    setImageUrl(dataUrl);
    
    // In a real application, you would:
    // 1. Send this data URL to your server
    // 2. Save it to the user's collection
    // 3. Redirect to the card detail page
    console.log("Card saved as data URL:", dataUrl.substring(0, 50) + "...");
  };

  return (
    <PageLayout title="Card Editor Demo" description="Create and edit cards using Fabric.js">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Card Editor Demo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <CardEditor onSave={handleSave} />
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              
              {imageUrl ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={imageUrl} 
                    alt="Card Preview" 
                    className="max-w-full h-auto rounded-lg shadow"
                  />
                  <p className="text-sm text-gray-500 mt-4">
                    Your card has been created! In a real app, you could save this to your collection.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Save your card to see a preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardEditorDemo;
