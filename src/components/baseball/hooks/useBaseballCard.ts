
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CardData } from '../types/BaseballCard';

export const BASEBALL_CARDS: CardData[] = [
  {
    id: "t206-wagner",
    title: "1909-11 T206 Honus Wagner",
    year: "1909-11",
    player: "Honus Wagner",
    team: "Pittsburgh Pirates",
    position: "Shortstop",
    manufacturer: "American Tobacco Company",
    cardNumber: "T206",
    value: "$6,600,000+",
    rarityScore: 9.8,
    condition: "PSA 3 VG",
    imageUrl: "/lovable-uploads/dc219616-1df7-461d-8f6d-7af3ef1b68ae.png", // Eddie Collins Allstar image
    stats: {
      battingAverage: ".327",
      homeRuns: "101",
      rbis: "1,732"
    }
  },
  {
    id: "1952-topps-mantle",
    title: "1952 Topps #311 Mickey Mantle",
    year: "1952",
    player: "Mickey Mantle",
    team: "New York Yankees",
    position: "Center Field",
    manufacturer: "Topps",
    cardNumber: "#311",
    value: "$5,200,000+",
    rarityScore: 9.2,
    condition: "PSA 9 MINT",
    imageUrl: "/lovable-uploads/480dff88-07d3-461d-ad88-d5b0447dc9a4.png", // Mickey Mantle Yankees card
    backImageUrl: "/lovable-uploads/f3854785-d55b-4f84-b273-272c5966c283.png", // Roger Staubach card as a placeholder
    stats: {
      battingAverage: ".298",
      homeRuns: "536",
      rbis: "1,509"
    }
  },
  {
    id: "1933-goudey-ruth",
    title: "1933 Goudey #53 Babe Ruth",
    year: "1933",
    player: "Babe Ruth",
    team: "New York Yankees",
    position: "Outfield",
    manufacturer: "Goudey",
    cardNumber: "#53",
    value: "$500,000+",
    rarityScore: 8.7,
    condition: "PSA 8 NM-MT",
    imageUrl: "/lovable-uploads/88d804c5-6d0c-402e-b2d6-f0d10b5f6699.png", // Babe Ruth Big League card
    stats: {
      battingAverage: ".342",
      homeRuns: "714",
      rbis: "2,213"
    }
  }
];

export const useBaseballCard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    console.log("useBaseballCard: Loading card with ID:", id);
    
    try {
      // If no ID is provided, use the first card
      if (!id) {
        console.log("No ID provided, using first card");
        setCardData(BASEBALL_CARDS[0]);
        setIsLoading(false);
        return;
      }
      
      // Find the card with the matching ID
      const card = BASEBALL_CARDS.find(card => card.id === id);
      
      if (card) {
        console.log("Found card:", card);
        setCardData(card);
      } else {
        // If no card is found with the given ID, set an error
        console.error(`Card with ID "${id}" not found`);
        setError(`Card with ID "${id}" not found`);
        
        // Optionally redirect to the first card after a delay
        setTimeout(() => {
          navigate('/baseball-card-viewer/' + BASEBALL_CARDS[0].id);
        }, 2000);
      }
    } catch (err) {
      console.error('Error loading card data:', err);
      setError('Failed to load card data');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  return { cardData, isLoading, error, allCards: BASEBALL_CARDS };
};
