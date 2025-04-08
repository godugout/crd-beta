
import React from 'react';
import { useParams } from 'react-router-dom';
import { useCards } from '@/context/CardContext';

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { collections, isLoading } = useCards();
  
  const collection = collections.find(c => c.id === id);
  
  if (isLoading) {
    return <div>Loading collection...</div>;
  }
  
  if (!collection) {
    return <div>Collection not found</div>;
  }
  
  return (
    <div>
      <h1>{collection.name}</h1>
      <p>{collection.description}</p>
    </div>
  );
};

export default CollectionDetail;
