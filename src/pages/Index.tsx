
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { cardData } from '@/data/cardData';
import CardShowcase from '@/components/home/CardShowcase';
import CardCollection from '@/components/home/CardCollection';
import CardUpload from '@/components/home/CardUpload';
import Footer from '@/components/home/Footer';

const Index = () => {
  const { user } = useAuth();
  const [activeCard, setActiveCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [view, setView] = useState<'showcase' | 'collection' | 'upload'>('showcase');

  // Function to handle card selection
  const selectCard = (index: number) => {
    setActiveCard(index);
    setIsFlipped(false);
  };
  
  // Function to flip card
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Navbar */}
      <Navbar />
      
      {/* Main content - Added top padding to account for fixed navbar */}
      <main className="pt-16 pb-6 px-4">
        {view === 'showcase' && (
          <CardShowcase 
            cardData={cardData}
            activeCard={activeCard}
            isFlipped={isFlipped}
            selectCard={selectCard}
            flipCard={flipCard}
            setView={setView}
          />
        )}
        {view === 'collection' && (
          <CardCollection 
            cardData={cardData}
            selectCard={selectCard}
            setView={setView}
          />
        )}
        {view === 'upload' && (
          <CardUpload 
            setView={setView}
          />
        )}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
