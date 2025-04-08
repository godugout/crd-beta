
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';

const MemoryPackCreator = () => {
  const navigate = useNavigate();
  const { collections, addCollection, updateCollection } = useCards();
  
  // Simplified dummy implementation
  return (
    <div>
      <h1>Create Memory Pack</h1>
      <div>Form would go here</div>
    </div>
  );
};

export default MemoryPackCreator;
