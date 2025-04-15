
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="max-w-md w-full bg-gray-100 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">CardShow - Emergency Page</h1>
        
        <p className="text-gray-700 mb-6">
          The application has been loaded in emergency mode to help diagnose issues.
          Please try navigating to different pages to see if they load correctly.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate('/')}
          >
            Home
          </button>
          
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => navigate('/gallery')}
          >
            Gallery
          </button>
          
          <button 
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={() => navigate('/cards/create')}
          >
            Create Card
          </button>
          
          <button 
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            onClick={() => navigate('/collections')}
          >
            Collections
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-200 rounded">
          <h2 className="font-semibold mb-2">Debug Info:</h2>
          <div className="text-xs font-mono">
            <p>Current Time: {new Date().toISOString()}</p>
            <p>User Agent: {navigator.userAgent}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
