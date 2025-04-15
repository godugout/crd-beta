
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Define the parts available for the action figure
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
  // Available parts for customization
  const availableParts: ActionFigurePart[] = [
    // Heads/Hats
    { id: 'green-cap', name: 'Green Cap', image: '/lovable-uploads/40a84221-8caa-4436-989d-46f1a1c99895.png', category: 'head' },
    { id: 'black-cap', name: 'Black Cap', image: '/lovable-uploads/40a84221-8caa-4436-989d-46f1a1c99895.png', category: 'head' },
    { id: 'catcher-helmet', name: 'Catcher Helmet', image: '/lovable-uploads/40a84221-8caa-4436-989d-46f1a1c99895.png', category: 'head' },
    
    // Bodies
    { id: 'batter-green', name: 'Batter (Green)', image: '/lovable-uploads/40a84221-8caa-4436-989d-46f1a1c99895.png', category: 'body' },
    { id: 'pitcher-white', name: 'Pitcher (White)', image: '/lovable-uploads/40a84221-8caa-4436-989d-46f1a1c99895.png', category: 'body' },
    { id: 'catcher-stripe', name: 'Catcher (Striped)', image: '/lovable-uploads/40a84221-8caa-4436-989d-46f1a1c99895.png', category: 'body' },
    
    // Accessories
    { id: 'bat', name: 'Bat', image: '/lovable-uploads/40a84221-8caa-4436-989d-46f1a1c99895.png', category: 'accessory' },
    { id: 'glove-pitcher', name: 'Pitcher Glove', image: '/lovable-uploads/40a84221-8caa-4436-989d-46f1a1c99895.png', category: 'accessory' },
    { id: 'glove-catcher', name: 'Catcher Mitt', image: '/lovable-uploads/40a84221-8caa-4436-989d-46f1a1c99895.png', category: 'accessory' },
  ];
  
  const [rotationY, setRotationY] = useState(initialRotation);
  const [selectedView, setSelectedView] = useState('front'); // 'front', 'side', 'back'
  const [selectedParts, setSelectedParts] = useState({
    head: initialParts?.head || 'green-cap',
    body: initialParts?.body || 'batter-green',
    accessory: initialParts?.accessory || 'bat'
  });
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  
  // Get the selected parts images
  const getPartByIdAndView = (id: string, view: string): string => {
    // For simplicity in this example, we're using the same image for all views
    // In a real implementation, you would have different images for different views
    const part = availableParts.find(part => part.id === id);
    return part?.image || '';
  };
  
  // Handle drag to rotate figure
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStartX(e.clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const deltaX = e.clientX - dragStartX;
      setRotationY(prev => (prev + deltaX * 0.5) % 360);
      setDragStartX(e.clientX);
      
      // Update the current view based on rotation
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
  
  // Change a specific part
  const changePart = (category: 'head' | 'body' | 'accessory', partId: string) => {
    setSelectedParts(prev => ({
      ...prev,
      [category]: partId
    }));
  };
  
  // Get the parts for the current view
  const getCurrentViewParts = () => {
    // In a real implementation, you would return different images based on the current view
    return {
      head: getPartByIdAndView(selectedParts.head, selectedView),
      body: getPartByIdAndView(selectedParts.body, selectedView),
      accessory: getPartByIdAndView(selectedParts.accessory, selectedView)
    };
  };
  
  // Parts selector component
  const PartsSelector = () => {
    return (
      <div className="mt-6 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-4">
        <h3 className="text-white text-lg font-bold mb-4">Customize Player</h3>
        
        {/* Heads/Hats */}
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
                <div className="w-full h-full bg-cover bg-center rounded-lg" 
                  style={{ 
                    backgroundImage: `url(${part.image})`,
                    backgroundPosition: 'center 20%' // Focus on the head area
                  }}
                ></div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Bodies */}
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
                <div className="w-full h-full bg-cover bg-center rounded-lg" 
                  style={{ 
                    backgroundImage: `url(${part.image})`,
                    backgroundPosition: 'center 50%' // Focus on the body area
                  }}
                ></div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Accessories */}
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
                <div className="w-full h-full bg-cover bg-center rounded-lg" 
                  style={{ 
                    backgroundImage: `url(${part.image})`,
                    backgroundPosition: 'center 70%' // Focus on the accessory area
                  }}
                ></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Render the figure parts in proper stacking order
  const renderFigure = () => {
    const parts = getCurrentViewParts();
    
    const getLayerStyle = (category: 'head' | 'body' | 'accessory') => {
      // Apply different transforms for different parts
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
    
    // Choose which row to show based on selectedParts.body
    let rowIndex = 0;
    if (selectedParts.body === 'batter-green') rowIndex = 0;
    else if (selectedParts.body === 'pitcher-white') rowIndex = 1;
    else if (selectedParts.body === 'catcher-stripe') rowIndex = 2;
    
    // Choose which column to show based on selectedView
    let colIndex = 0;
    if (selectedView === 'front') colIndex = 0;
    else if (selectedView === 'side') colIndex = 1;
    else if (selectedView === 'back') colIndex = 2;
    
    // Calculate background position based on row and column
    const backgroundPosition = `${colIndex * 33.33}% ${rowIndex * 33.33}%`;
    
    return (
      <div 
        className="relative w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Base player image */}
        <motion.div 
          className="w-full h-full bg-contain bg-no-repeat bg-center"
          animate={{ rotateY: rotationY }}
          transition={{ type: "spring", stiffness: 100 }}
          style={{ 
            backgroundImage: `url(/lovable-uploads/40a84221-8caa-4436-989d-46f1a1c99895.png)`,
            backgroundPosition,
            backgroundSize: '300% 300%', // 3x3 sprite sheet
            cursor: dragging ? 'grabbing' : 'grab',
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.25))'
          }}
        >
          {/* Interactive parts would be layered here in a real implementation */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Shadow beneath the figure */}
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
        {/* 3D action figure with parallax effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-80 h-80 relative">
            {renderFigure()}
          </div>
        </div>
        
        {/* Rotation indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
            {selectedView === 'front' ? 'Front View' : selectedView === 'side' ? 'Side View' : 'Back View'}
          </div>
        </div>
      </div>
      
      {/* Parts selector */}
      <PartsSelector />
    </div>
  );
};

export default ActionFigure;
