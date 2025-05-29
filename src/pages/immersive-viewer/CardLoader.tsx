
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/lib/types';

interface CardLoaderProps {
  loading: boolean;
  card: Card | undefined;
}

const CardLoader: React.FC<CardLoaderProps> = ({ loading, card }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-t-transparent border-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading card...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Card Not Found</h1>
          <p className="text-gray-400 mb-6">The card you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/gallery')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CardLoader;
