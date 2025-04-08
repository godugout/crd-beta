
import React from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '@/context/CardContext';

const Index = () => {
  const { collections } = useCards();
  
  return (
    <div>
      <h1>Collections</h1>
      <ul>
        {collections.map(collection => (
          <li key={collection.id}>
            <Link to={`/collections/${collection.id}`}>
              {collection.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
