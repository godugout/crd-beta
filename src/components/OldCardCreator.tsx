
import React, { useState } from 'react';
import CardUpload from './home/CardUpload';

const OldCardCreator: React.FC = () => {
  const [view, setView] = useState<'showcase' | 'collection' | 'upload'>('upload');
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <CardUpload setView={setView} />
    </div>
  );
};

export default OldCardCreator;
