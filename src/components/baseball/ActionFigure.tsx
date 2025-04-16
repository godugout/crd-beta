import React, { useState } from 'react';
import { CircleUser, Shirt, Shield, Rotate3d } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BaseballModel from './model-viewer/BaseballModel';

interface ActionFigurePart {
  id: string;
  name: string;
  icon: React.ReactNode;
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
      icon: <CircleUser className="w-5 h-5" />,
      category: 'head' 
    },
    { 
      id: 'batting-helmet', 
      name: 'Batting Helmet',
      icon: <Shield className="w-5 h-5" />,
      category: 'head' 
    },
    { 
      id: 'home-uniform', 
      name: 'Home Uniform', 
      icon: <Shirt className="w-5 h-5" />,
      category: 'body' 
    },
    { 
      id: 'away-uniform', 
      name: 'Away Uniform', 
      icon: <Shirt className="w-5 h-5 rotate-45" />,
      category: 'body' 
    }
  ];
  
  const [rotationY, setRotationY] = useState(initialRotation);
  const [selectedView, setSelectedView] = useState('front');
  const [selectedParts, setSelectedParts] = useState({
    head: initialParts?.head || 'classic-cap',
    body: initialParts?.body || 'home-uniform',
    accessory: initialParts?.accessory || ''
  });
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStartX(e.clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const deltaX = e.clientX - dragStartX;
      setRotationY(prev => (prev + deltaX * 0.5) % 360);
      setDragStartX(e.clientX);
      
      // Update view based on rotation
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <div 
          className="absolute inset-0"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <BaseballModel />
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
            {selectedView === 'front' ? 'Front View' : selectedView === 'side' ? 'Side View' : 'Back View'}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-900/50 backdrop-blur-sm rounded-lg p-4">
        <h3 className="text-white text-lg font-medium mb-4">Customize Dusty Diamond</h3>
        
        <div className="space-y-6">
          {['head', 'body'].map((category) => (
            <div key={category} className="space-y-2">
              <h4 className="text-gray-300 font-medium capitalize">{category}</h4>
              <div className="flex gap-2 flex-wrap">
                {availableParts
                  .filter(part => part.category === category)
                  .map(part => (
                    <Button
                      key={part.id}
                      variant={selectedParts[part.category] === part.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => changePart(part.category, part.id)}
                      className="flex items-center gap-2"
                    >
                      {part.icon}
                      <span>{part.name}</span>
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActionFigure;
