
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, Grid, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface CardData {
  id: number;
  name: string;
  team: string;
  jersey: string;
  year: string;
  backgroundColor: string;
  textColor: string;
  cardType: string;
  artist: string;
  set: string;
  cardNumber: string;
  description: string;
  specialEffect: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [view, setView] = useState<'showcase' | 'collection' | 'upload'>('showcase');
  
  // Card data with information
  const cardData: CardData[] = [
    {
      id: 1,
      name: "Prince",
      team: "Minnesota Wolves",
      jersey: "72",
      year: "2023",
      backgroundColor: "#5B23A9", // Purple
      textColor: "white",
      cardType: "Artist Series",
      artist: "Jason T.",
      set: "Music Legends Series",
      cardNumber: "ML-001",
      description: "Special tribute artwork celebrating the Minneapolis legend in Wolves colors. Fan-created artwork reimagining Prince as a basketball player for his hometown team.",
      specialEffect: "Purple Rain Holographic"
    },
    {
      id: 2,
      name: "Michael Jordan",
      team: "Chicago Bulls",
      jersey: "23",
      year: "2023",
      backgroundColor: "#CE1141", // Red
      textColor: "white",
      cardType: "Artist Series",
      artist: "Jules A.",
      set: "Basketball Legends",
      cardNumber: "BL-023",
      description: "Classic illustration of the GOAT in his legendary Bulls uniform. This fan art captures the iconic silhouette and spirit of Jordan's tremendous impact on the game.",
      specialEffect: "Ruby Shimmer"
    },
    {
      id: 3,
      name: "Elvis Presley",
      team: "Memphis Grizzlies",
      jersey: "15",
      year: "2023",
      backgroundColor: "#5D9AD3", // Light Blue
      textColor: "navy",
      cardType: "Artist Series",
      artist: "Marcel G.",
      set: "Music Legends Series",
      cardNumber: "ML-002",
      description: "Memphis legend reimagined as a Grizzlies player. This creative interpretation connects Elvis to his hometown through the lens of basketball culture.",
      specialEffect: "Blue Suede Shimmer"
    },
    {
      id: 4,
      name: "Bob Marley",
      team: "Los Angeles Lakers",
      jersey: "23",
      year: "2023",
      backgroundColor: "#FDB927", // Gold
      textColor: "purple",
      cardType: "Artist Series",
      artist: "Jessica P.",
      set: "Music Legends Series",
      cardNumber: "ML-003",
      description: "Reggae icon in Lakers gold. This fan creation reimagines what Bob Marley might look like as an LA Laker, combining music and basketball culture.",
      specialEffect: "Rasta Gold Effect"
    },
    {
      id: 5,
      name: "Tupac Shakur",
      team: "Duke",
      jersey: "2",
      year: "2023",
      backgroundColor: "#001A57", // Duke Blue
      textColor: "white",
      cardType: "Artist Series",
      artist: "Tyrone J.",
      set: "Music Legends Series",
      cardNumber: "ML-004",
      description: "Hip-hop legend reimagined as a Blue Devil. This creative fan art brings Tupac's intensity to the basketball court as a Duke University player.",
      specialEffect: "Bandana Pattern"
    },
    {
      id: 6,
      name: "Notorious B.I.G.",
      team: "Brooklyn Nets",
      jersey: "72",
      year: "2023",
      backgroundColor: "#FF0063", // Hot Pink
      textColor: "white",
      cardType: "Artist Series",
      artist: "Marcus L.",
      set: "Music Legends Series",
      cardNumber: "ML-005",
      description: "Brooklyn's finest in his hometown jersey. This fan creation honors Biggie by visualizing him as a player for his hometown Brooklyn Nets.",
      specialEffect: "Brooklyn Metal"
    }
  ];

  // Function to handle card selection
  const selectCard = (index: number) => {
    setActiveCard(index);
    setIsFlipped(false);
  };
  
  // Function to flip card
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };
  
  // Render collection view
  const renderCollection = () => (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Collection</h2>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => setView('upload')}
        >
          Upload New Card
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div 
            key={card.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer" 
            onClick={() => {selectCard(index); setView('showcase');}}
          >
            <div 
              className="h-48 bg-cover bg-center" 
              style={{ 
                backgroundColor: card.backgroundColor,
                backgroundImage: `linear-gradient(45deg, ${card.backgroundColor}88, ${card.backgroundColor}ff)`
              }}
            ></div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{card.name}</h3>
              <p className="text-gray-600 text-sm">{card.team} #{card.jersey}</p>
              <p className="text-gray-500 text-xs mt-1">{card.set} • {card.year}</p>
              
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {card.specialEffect}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Card
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // Render showcase view
  const renderShowcase = () => (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row p-4">
      {/* Card display area */}
      <div className="w-full lg:w-2/3 flex flex-col">
        {/* Card viewer */}
        <div 
          className="relative w-full h-96 md:h-[500px] flex items-center justify-center p-4 bg-gray-100 rounded-lg"
        >
          {/* Sample card representation */}
          <div 
            className={`w-64 h-96 relative transition-transform duration-500 rounded-lg shadow-xl ${isFlipped ? 'scale-x-[-1]' : ''}`} 
            style={{ backgroundColor: cardData[activeCard].backgroundColor }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
              {!isFlipped ? cardData[activeCard].name : 'CardShow'}
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              {!isFlipped ? `#${cardData[activeCard].jersey}` : cardData[activeCard].set}
            </div>
          </div>
          
          {/* Flip button */}
          <button 
            className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm"
            onClick={flipCard}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          {/* Return to collection button */}
          <button 
            className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm"
            onClick={() => setView('collection')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
        
        {/* Card description */}
        <div className="bg-white p-6 shadow-md mt-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">{cardData[activeCard].name}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{cardData[activeCard].team}</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">#{cardData[activeCard].jersey}</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{cardData[activeCard].year}</span>
          </div>
          <p className="text-gray-700 mb-6">{cardData[activeCard].description}</p>
          
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Share Card
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
              Download
            </button>
          </div>
        </div>
      </div>
      
      {/* Right sidebar with more cards */}
      <div className="w-full lg:w-1/3 bg-gray-50 p-4 mt-6 lg:mt-0 lg:ml-6 rounded-lg">
        <h3 className="font-bold text-lg mb-4">More Cards</h3>
        
        <div className="space-y-3">
          {cardData.map((card, index) => (
            <div 
              key={card.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                activeCard === index 
                  ? 'bg-blue-100 border-l-4 border-blue-500' 
                  : 'bg-white hover:bg-gray-100 border-l-4 border-transparent'
              }`}
              onClick={() => selectCard(index)}
            >
              <div 
                className="flex-shrink-0 w-12 h-16 rounded-md overflow-hidden" 
                style={{ 
                  backgroundColor: card.backgroundColor
                }}
              ></div>
              <div className="ml-4">
                <h4 className="font-medium">{card.name}</h4>
                <p className="text-sm text-gray-600">{card.team} #{card.jersey}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4">Effect Options</h3>
          
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              Classic Holographic
            </button>
            <button className="w-full text-left px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              Refractor
            </button>
            <button className="w-full text-left px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              Prismatic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render upload form
  const renderUploadForm = () => (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Upload Your Card</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Card Image</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Drag and drop your card image here, or click to browse</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
              Select Image
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Card Name</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. Michael Jordan Rookie" />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Year</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. 1986" />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Set/Brand</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. Fleer" />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Card Number</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. 57" />
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-gray-700 font-medium mb-2">Description</label>
        <textarea 
          className="w-full px-3 py-2 border border-gray-300 rounded-md h-24" 
          placeholder="Add any details about your card's condition, history, or why it's special to you"
        ></textarea>
      </div>
      
      <div className="mt-6">
        <label className="block text-gray-700 font-medium mb-2">Special Effect</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option>Classic Holographic</option>
          <option>Refractor</option>
          <option>Prism</option>
          <option>Chrome</option>
          <option>Gold Foil</option>
          <option>Vintage</option>
        </select>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button 
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg mr-4 hover:bg-gray-300 transition"
          onClick={() => setView('collection')}
        >
          Cancel
        </button>
        <button 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => setView('collection')}
        >
          Upload Card
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Navbar */}
      <Navbar />
      
      {/* Main content - Added top padding to account for fixed navbar */}
      <main className="py-20 px-4">
        {view === 'showcase' && renderShowcase()}
        {view === 'collection' && renderCollection()}
        {view === 'upload' && renderUploadForm()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="text-xl font-bold text-cardshow-dark">CardShow</span>
              </div>
              <p className="text-sm mt-2 text-gray-600">The fun way to share your trading card collection</p>
            </div>
            <div className="flex space-x-6">
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-3">Explore</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-600 hover:text-blue-600">Featured Cards</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-blue-600">Collections</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-blue-600">Community</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-3">Help</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-600 hover:text-blue-600">FAQ</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} CardShow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
