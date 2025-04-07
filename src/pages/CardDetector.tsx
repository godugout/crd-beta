import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';
import { useNavigate } from 'react-router-dom';
import ImageEditor from '@/components/card-upload/ImageEditor';

interface EnabledMemorabiliaTypes {
  card: boolean;
  ticket: boolean;
  program: boolean;
  autograph: boolean;
  face: boolean;
  unknown: boolean;
}

const CardDetector = () => {
  const navigate = useNavigate();
  const [enabledTypes, setEnabledTypes] = useState<EnabledMemorabiliaTypes>({
    card: true,
    ticket: true,
    program: true,
    autograph: true,
    face: true, // Changed from 'photo' to 'face' to match MemorabiliaType
    unknown: true
  });
  const [showEditor, setShowEditor] = useState(false);
  const [editorImage, setEditorImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [enabledMemorabiliaTypes, setEnabledMemorabiliaTypes] = useState<MemorabiliaType[]>(['card', 'ticket', 'program', 'autograph', 'face', 'unknown']);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditorImage(reader.result as string);
        setCurrentFile(file);
        setShowEditor(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (file: File, url: string, memorabiliaType?: MemorabiliaType) => {
    console.log('Crop complete:', file, url, memorabiliaType);
    // Handle the cropped image file and URL here
    // You can upload the file to a server or display the URL in an <img> tag
    navigate('/editor');
  };

  const toggleType = (type: keyof EnabledMemorabiliaTypes) => {
    setEnabledTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));

    // Update the enabledMemorabiliaTypes state based on the toggle
    setEnabledMemorabiliaTypes(prevTypes => {
      if (prevTypes.includes(type as MemorabiliaType)) {
        return prevTypes.filter(t => t !== type);
      } else {
        return [...prevTypes, type as MemorabiliaType];
      }
    });
  };
  
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Card Detection & Enhancement</h1>
        
        <p className="mb-4">
          Upload an image to detect and enhance cards, tickets, autographs, and other memorabilia.
        </p>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-6"
        />
        
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-3 py-1 rounded ${enabledTypes.card ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => toggleType('card')}
          >
            Trading Cards
          </button>
          <button
            className={`px-3 py-1 rounded ${enabledTypes.ticket ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => toggleType('ticket')}
          >
            Ticket Stubs
          </button>
          <button
            className={`px-3 py-1 rounded ${enabledTypes.program ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => toggleType('program')}
          >
            Programs
          </button>
          <button
            className={`px-3 py-1 rounded ${enabledTypes.autograph ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => toggleType('autograph')}
          >
            Autographs
          </button>
          <button
            className={`px-3 py-1 rounded ${enabledTypes.face ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => toggleType('face')}
          >
            Faces
          </button>
          <button
            className={`px-3 py-1 rounded ${enabledTypes.unknown ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => toggleType('unknown')}
          >
            Unknown
          </button>
        </div>
        
        {editorImage && (
          <ImageEditor
            showEditor={showEditor}
            setShowEditor={setShowEditor}
            editorImage={editorImage}
            currentFile={currentFile}
            onCropComplete={handleCropComplete}
            enabledMemorabiliaTypes={enabledMemorabiliaTypes}
          />
        )}
      </main>
    </div>
  );
};

export default CardDetector;
