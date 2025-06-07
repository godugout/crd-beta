
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/lib/types/cardTypes';
import { toast } from 'sonner';

// Define the proper return type interface
interface UseArCardViewerReturn {
  card: Card | null;
  isLoading: boolean;
  error: string | null;
  arSupported: boolean;
  arCanvasRef: React.RefObject<HTMLCanvasElement>;
  startAR: () => Promise<void>;
  // Add missing properties expected by the pages
  cards: Card[];
  loading: boolean;
  activeCard: Card | null;
  arCards: Card[];
  availableCards: Card[];
  isArMode: boolean;
  isFlipped: boolean;
  cameraError: string | null;
  handleLaunchAr: () => void;
  handleExitAr: () => void;
  handleCameraError: (error: string) => void;
  handleTakeSnapshot: () => void;
  handleFlip: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleRotate: () => void;
  handleAddCard: (cardId: string) => void;
  handleRemoveCard: (cardId: string) => void;
}

export const useArCardViewer = (id?: string): UseArCardViewerReturn => {
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [arSupported, setArSupported] = useState(false);
  const [isArMode, setIsArMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [arCards, setArCards] = useState<Card[]>([]);
  const [cards] = useState<Card[]>([]); // Mock cards array
  const arCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const checkARSupport = async () => {
      if (navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setArSupported(supported);
        } catch (err) {
          console.error("Error checking AR support:", err);
          setArSupported(false);
        }
      } else {
        setArSupported(false);
      }
    };

    checkARSupport();
  }, []);

  useEffect(() => {
    if (!id) {
      setError("No card ID provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    // Mock card data loading (replace with actual API call)
    setTimeout(() => {
      const mockCard: Card = {
        id: id,
        title: "Sample AR Card",
        description: "View this card in augmented reality!",
        imageUrl: "/images/card-placeholder.png",
        thumbnailUrl: "/images/card-placeholder.png",
        userId: "user123",
        tags: ["ar", "sample"],
        effects: [],
        designMetadata: {
          cardStyle: {
            template: 'classic',
            effect: 'none',
            borderRadius: '8px',
            borderColor: '#000000',
            frameColor: '#000000',
            frameWidth: 2,
            shadowColor: 'rgba(0,0,0,0.2)',
          },
          textStyle: {
            titleColor: '#000000',
            titleAlignment: 'center',
            titleWeight: 'bold',
            descriptionColor: '#333333',
          },
          marketMetadata: {
            isPrintable: false,
            isForSale: false,
            includeInCatalog: false,
          },
          cardMetadata: {
            category: 'general',
            cardType: 'standard',
            series: 'base',
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCard(mockCard);
      setArCards([mockCard]);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const startAR = async () => {
    if (!arSupported) {
      toast.error("AR Not Supported", {
        description: "Augmented reality is not supported on this device."
      });
      return;
    }

    if (!arCanvasRef.current) {
      toast.error("AR Canvas Not Found", {
        description: "Could not find the AR canvas element."
      });
      return;
    }

    try {
      // Request an AR session
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.getElementById('ar-overlay')! }
      });

      // Create a THREE.js WebGL renderer backed by the AR session's WebGL context
      const gl = arCanvasRef.current.getContext('webgl', { xrCompatible: true });
      if (!gl) {
        throw new Error("Failed to get WebGL context");
      }

      console.log("AR Session started:", session);
      setIsArMode(true);
      toast.success("AR Session Started", {
        description: "Point your camera at a surface to place the card."
      });

      // End the AR session after a while (for testing purposes)
      setTimeout(() => {
        session.end();
        setIsArMode(false);
        toast.info("AR Session Ended", {
          description: "AR session has ended."
        });
      }, 20000);

    } catch (err) {
      console.error("Error starting AR:", err);
      toast.error("AR Failed to Start", {
        description: "Failed to start augmented reality."
      });
    }
  };

  const handleLaunchAr = () => {
    setIsArMode(true);
    startAR();
  };

  const handleExitAr = () => {
    setIsArMode(false);
  };

  const handleCameraError = (errorMessage: string) => {
    setCameraError(errorMessage);
  };

  const handleTakeSnapshot = () => {
    toast.success("Snapshot taken!");
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleZoomIn = () => {
    console.log("Zoom in");
  };

  const handleZoomOut = () => {
    console.log("Zoom out");
  };

  const handleRotate = () => {
    console.log("Rotate");
  };

  const handleAddCard = (cardId: string) => {
    console.log("Add card:", cardId);
  };

  const handleRemoveCard = (cardId: string) => {
    setArCards(prev => prev.filter(c => c.id !== cardId));
  };

  return {
    card,
    isLoading,
    error,
    arSupported,
    arCanvasRef,
    startAR,
    // Additional properties for compatibility
    cards,
    loading: isLoading,
    activeCard: card,
    arCards,
    availableCards: cards.filter(c => !arCards.find(ac => ac.id === c.id)),
    isArMode,
    isFlipped,
    cameraError,
    handleLaunchAr,
    handleExitAr,
    handleCameraError,
    handleTakeSnapshot,
    handleFlip,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    handleAddCard,
    handleRemoveCard,
  };
};
