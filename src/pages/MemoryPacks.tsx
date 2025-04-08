
import React from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';

const MemoryPacks = () => {
  const { collections, isLoading } = useCards();
  
  if (isLoading) {
    return <div>Loading memory packs...</div>;
  }
  
  return (
    <div>
      <h1>Memory Packs</h1>
      <Link to="/create-memory-pack">Create new memory pack</Link>
      
      <ul>
        {collections.map(collection => (
          <li key={collection.id}>
            <Link to={`/memory-packs/${collection.id}`}>
              {collection.name} - {collection.cardIds.length} cards
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoryPacks;
