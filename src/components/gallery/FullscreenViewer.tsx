
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card3DTransform from '../card-interaction/Card3DTransform';

interface FullscreenViewerProps {
  cardId: string;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ cardId, onClose }) => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center p-8">
        {/* Card Container - Increased size and added hover effects */}
        <div 
          className="relative w-[400px] h-[560px] cursor-pointer group"
          onClick={() => navigate(`/card/${cardId}`)}
        >
          <Card3DTransform
            className="w-full h-full"
            perspective={1500}
            maxRotation={20}
          >
            {/* Card Content */}
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <img 
                src={`/api/cards/${cardId}/image`} 
                alt="Card preview"
                className="w-full h-full object-cover"
              />
              
              {/* Hover overlay with title and creator */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold">Card Title</h3>
                  <p className="text-sm text-gray-300">Created by Creator Name</p>
                </div>
              </div>
            </div>
          </Card3DTransform>
        </div>
      </div>

      {/* Close button */}
      <button 
        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        onClick={onClose}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default FullscreenViewer;
