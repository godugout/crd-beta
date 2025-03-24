
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
    imageUrl: "/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png",
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
    imageUrl: "/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png",
    backImageUrl: "/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png",
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
    imageUrl: "/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png",
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
    
    try {
      // If no ID is provided, use the first card
      if (!id) {
        setCardData(BASEBALL_CARDS[0]);
        setIsLoading(false);
        return;
      }
      
      // Find the card with the matching ID
      const card = BASEBALL_CARDS.find(card => card.id === id);
      
      if (card) {
        setCardData(card);
      } else {
        // If no card is found with the given ID, set an error
        setError(`Card with ID "${id}" not found`);
        console.error(`Card with ID "${id}" not found`);
        
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
