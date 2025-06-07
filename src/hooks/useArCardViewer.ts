import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/lib/types/cardTypes';
import { toast } from 'sonner';

export const useArCardViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [arSupported, setArSupported] = useState(false);
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
    setError(null);

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
      setIsLoading(false);
    }, 500);
  }, [id]);

  const startAR = async () => {
    if (!arSupported) {
      toast({
        title: "AR Not Supported",
        description: "Augmented reality is not supported on this device.",
        variant: "destructive",
      });
      return;
    }

    if (!arCanvasRef.current) {
      toast({
        title: "AR Canvas Not Found",
        description: "Could not find the AR canvas element.",
        variant: "destructive",
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

      // Now you can use the 'session' and 'gl' objects to set up your AR scene
      console.log("AR Session started:", session);
      toast({
        title: "AR Session Started",
        description: "Point your camera at a surface to place the card.",
      });

      // End the AR session after a while (for testing purposes)
      setTimeout(() => {
        session.end();
        toast({
          title: "AR Session Ended",
          description: "AR session has ended.",
        });
      }, 20000);

    } catch (err) {
      console.error("Error starting AR:", err);
      toast({
        title: "AR Failed to Start",
        description: "Failed to start augmented reality.",
        variant: "destructive",
      });
    }
  };

  return {
    card,
    isLoading,
    error,
    arSupported,
    arCanvasRef,
    startAR,
  };
};
