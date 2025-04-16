import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ActionFigurePart {
  id: string;
  name: string;
  image: string;
  category: 'head' | 'body' | 'accessory';
}

interface ActionFigureProps {
  initialRotation?: number;
  initialParts?: {
    head?: string;
    body?: string;
    accessory?: string;
  };
}

const ActionFigure: React.FC<ActionFigureProps> = ({ 
  initialRotation = 0,
  initialParts
}) => {
  const availableParts: ActionFigurePart[] = [
    { 
      id: 'classic-cap', 
      name: 'Classic Baseball Cap', 
      image: '/lovable-uploads/38b125d7-2257-4d56-98fa-c1ff2a7be7ea.png',
      category: 'head' 
    },
    { 
      id: 'batting-helmet', 
      name: 'Batting Helmet', 
      image: '/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png',
      category: 'head' 
    },
    { 
      id: 'catcher-mask', 
      name: 'Catcher\'s Mask', 
      image: '/lovable-uploads/93353027-d213-4314-8ab9-0d38bb552e8a.png',
      category: 'head' 
    },
    
    { 
      id: 'home-uniform', 
      name: 'Home Uniform', 
      image: '/lovable-uploads/371b81a2-cafa-4637-9358-218d4120c658.png',
      category: 'body' 
    },
    { 
      id: 'away-uniform', 
      name: 'Away Uniform', 
      image: '/lovable-uploads/236e3ad9-f7c2-4e5b-b29a-ca52a49ff3ed.png',
      category: 'body' 
    },
    { 
      id: 'alternate-uniform', 
      name: 'Alternate Uniform', 
      image: '/lovable-uploads/f07b9e90-98ec-4e0c-bca4-71acd9ae9924.png',
      category: 'body' 
    },
    
    { 
      id: 'baseball-bat', 
      name: 'Baseball Bat', 
      image: '/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png',
      category: 'accessory' 
    },
    { 
      id: 'fielding-glove', 
      name: 'Fielding Glove', 
      image: '/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png',
      category: 'accessory' 
    },
    { 
      id: 'catchers-mitt', 
      name: 'Catcher\'s Mitt', 
      image: '/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png',
      category: 'accessory' 
    }
  ];
  
  const [rotationY, setRotationY] = useState(initialRotation);
  const [selectedView, setSelectedView] = useState('front');
  const [selectedParts, setSelectedParts] = useState({
    head: initialParts?.head || 'classic-cap',
    body: initialParts?.body || 'home-uniform',
    accessory: initialParts?.accessory || 'baseball-bat'
  });
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  
  const getPartByIdAndView = (id: string, view: string): string => {
    const part = availableParts.find(part => part.id === id);
    return part?.image || '';
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStartX(e.clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const deltaX = e.clientX - dragStartX;
      setRotationY(prev => (prev + deltaX * 0.5) % 360);
      setDragStartX(e.clientX);
      
      if (rotationY >= -45 && rotationY <= 45) {
        setSelectedView('front');
      } else if (rotationY > 45 && rotationY <= 135) {
        setSelectedView('side');
      } else {
        setSelectedView('back');
      }
    }
  };
  
  const handleMouseUp = () => {
    setDragging(false);
  };
  
  const changePart = (category: 'head' | 'body' | 'accessory', partId: string) => {
    setSelectedParts(prev => ({
      ...prev,
      [category]: partId
    }));
  };
  
  const getCurrentViewParts = () => {
    return {
      head: getPartByIdAndView(selectedParts.head, selectedView),
      body: getPartByIdAndView(selectedParts.body, selectedView),
      accessory: getPartByIdAndView(selectedParts.accessory, selectedView)
    };
  };
  
  const renderFigure = () => {
    const parts = getCurrentViewParts();
    
    const getLayerStyle = (category: 'head' | 'body' | 'accessory') => {
      switch (category) {
        case 'head':
          return { transform: 'translateY(-20%)' };
        case 'body':
          return { transform: 'translateY(0)' };
        case 'accessory':
          return { transform: 'translateY(10%)' };
        default:
          return {};
      }
    };
    
    let rowIndex = 0;
    if (selectedParts.body === 'home-uniform') rowIndex = 0;
    else if (selectedParts.body === 'away-uniform') rowIndex = 1;
    else if (selectedParts.body === 'alternate-uniform') rowIndex = 2;
    
    let colIndex = 0;
    if (selectedView === 'front') colIndex = 0;
    else if (selectedView === 'side') colIndex = 1;
    else if (selectedView === 'back') colIndex = 2;
    
    const backgroundPosition = `${colIndex * 33.33}% ${rowIndex * 33.33}%`;
    
    return (
      <div 
        className="relative w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <motion.div 
          className="w-full h-full bg-contain bg-no-repeat bg-center"
          animate={{ rotateY: rotationY }}
          transition={{ type: "spring", stiffness: 100 }}
          style={{ 
            backgroundImage: `url(/lovable-uploads/40a84221-8caa-4436-989d-46f1a1c99895.png)`,
            backgroundPosition,
            backgroundSize: '300% 300%',
            cursor: dragging ? 'grabbing' : 'grab',
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.25))'
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-8 rounded-full bg-black opacity-50 blur-md"
              style={{
                transform: 'translateX(-50%) scale(1, 0.3)'
              }}
            ></div>
          </div>
        </motion.div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-80 h-80 relative">
            {renderFigure()}
          </div>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
            {selectedView === 'front' ? 'Front View' : selectedView === 'side' ? 'Side View' : 'Back View'}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-4">
        <h3 className="text-white text-lg font-bold mb-4">Customize Dusty Diamond</h3>
        
        <div className="mb-4">
          <h4 className="text-gray-300 font-medium mb-2">Headwear</h4>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {availableParts.filter(part => part.category === 'head').map(part => (
              <button 
                key={part.id}
                className={`w-14 h-14 rounded-lg ${selectedParts.head === part.id ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-600'}`}
                onClick={() => changePart('head', part.id)}
                title={part.name}
              >
                <div 
                  className="w-full h-full bg-cover bg-center rounded-lg" 
                  style={{ 
                    backgroundImage: `url(${part.image})`,
                    backgroundPosition: 'center 20%'
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-gray-300 font-medium mb-2">Uniform</h4>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {availableParts.filter(part => part.category === 'body').map(part => (
              <button 
                key={part.id}
                className={`w-14 h-14 rounded-lg ${selectedParts.body === part.id ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-600'}`}
                onClick={() => changePart('body', part.id)}
                title={part.name}
              >
                <div 
                  className="w-full h-full bg-cover bg-center rounded-lg" 
                  style={{ 
                    backgroundImage: `url(${part.image})`,
                    backgroundPosition: 'center 50%'
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-gray-300 font-medium mb-2">Equipment</h4>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {availableParts.filter(part => part.category === 'accessory').map(part => (
              <button 
                key={part.id}
                className={`w-14 h-14 rounded-lg ${selectedParts.accessory === part.id ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-600'}`}
                onClick={() => changePart('accessory', part.id)}
                title={part.name}
              >
                <div 
                  className="w-full h-full bg-cover bg-center rounded-lg" 
                  style={{ 
                    backgroundImage: `url(${part.image})`,
                    backgroundPosition: 'center 70%'
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionFigure;
