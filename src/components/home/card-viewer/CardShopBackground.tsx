
import React, { useEffect, useRef } from 'react';

interface CardShopBackgroundProps {
  className?: string;
}

const CardShopBackground: React.FC<CardShopBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize and draw the card shop background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match display size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Draw the card shop background
    drawCardShop(ctx, rect.width, rect.height);
    
    // Handle window resize
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      drawCardShop(ctx, rect.width, rect.height);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Draw the cartoon card shop
  const drawCardShop = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Gradient background - soft purple to deep blue
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#2D1B69');
    bgGradient.addColorStop(1, '#121035');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw shop floor
    ctx.fillStyle = '#1A1142';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    ctx.lineTo(width, height * 0.7);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    
    // Floor grid lines - perspective effect
    ctx.strokeStyle = '#362A72';
    ctx.lineWidth = 2;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = height * 0.7 + (height * 0.3 / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Vertical grid lines with perspective
    const vanishingPointX = width / 2;
    const vanishingPointY = height * 0.4;
    
    for (let i = 0; i <= 10; i++) {
      const xPos = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(xPos, height * 0.7);
      ctx.lineTo(vanishingPointX + (xPos - vanishingPointX) * 0.2, vanishingPointY);
      ctx.stroke();
    }
    
    // Draw shelves on walls
    drawShelves(ctx, width, height);
    
    // Draw display cases
    drawDisplayCases(ctx, width, height);
    
    // Draw decorative elements
    drawDecorativeElements(ctx, width, height);
    
    // Add ambient particles
    drawAmbientParticles(ctx, width, height);
  };
  
  const drawShelves = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Left wall shelves
    const shelfGradient = ctx.createLinearGradient(0, height * 0.3, 0, height * 0.7);
    shelfGradient.addColorStop(0, '#4E3A8A');
    shelfGradient.addColorStop(1, '#312466');
    
    // Draw 3 shelves on the left wall
    for (let i = 0; i < 3; i++) {
      const shelfY = height * 0.35 + i * (height * 0.1);
      const shelfWidth = width * 0.3;
      const shelfHeight = height * 0.02;
      const shelfDepth = height * 0.015;
      
      // Shelf top
      ctx.fillStyle = shelfGradient;
      ctx.fillRect(width * 0.05, shelfY, shelfWidth, shelfHeight);
      
      // Shelf front edge - lighter
      ctx.fillStyle = '#5D48A3';
      ctx.fillRect(width * 0.05, shelfY + shelfHeight, shelfWidth, shelfDepth);
      
      // Draw cards on shelves
      drawCardsOnShelf(ctx, width * 0.05, shelfY, shelfWidth, i);
    }
    
    // Right wall shelves
    for (let i = 0; i < 3; i++) {
      const shelfY = height * 0.32 + i * (height * 0.1);
      const shelfWidth = width * 0.25;
      const shelfHeight = height * 0.02;
      const shelfDepth = height * 0.015;
      
      // Shelf top
      ctx.fillStyle = shelfGradient;
      ctx.fillRect(width * 0.7, shelfY, shelfWidth, shelfHeight);
      
      // Shelf front edge
      ctx.fillStyle = '#5D48A3';
      ctx.fillRect(width * 0.7, shelfY + shelfHeight, shelfWidth, shelfDepth);
      
      // Draw cards on shelves
      drawCardsOnShelf(ctx, width * 0.7, shelfY, shelfWidth, i + 3);
    }
  };
  
  const drawCardsOnShelf = (ctx: CanvasRenderingContext2D, x: number, y: number, shelfWidth: number, colorVariant: number) => {
    const cardColors = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#FFD166', // Yellow
      '#06D6A0', // Green
      '#118AB2', // Blue
      '#D9376E'  // Pink
    ];
    
    const cardWidth = shelfWidth * 0.1;
    const cardHeight = cardWidth * 1.4;
    const cardSpacing = cardWidth * 1.4;
    const cardsPerShelf = Math.floor(shelfWidth / cardSpacing) - 1;
    
    for (let i = 0; i < cardsPerShelf; i++) {
      const cardX = x + (i * cardSpacing) + cardWidth * 0.5;
      const cardY = y - cardHeight * 0.9;
      
      // Card body
      const cardColor = cardColors[(i + colorVariant) % cardColors.length];
      ctx.fillStyle = cardColor;
      ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
      
      // Card border
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);
      
      // Card details (simplified)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cardX + cardWidth * 0.1, cardY + cardHeight * 0.7, cardWidth * 0.8, cardHeight * 0.15);
    }
  };
  
  const drawDisplayCases = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Center display case
    const caseWidth = width * 0.4;
    const caseHeight = height * 0.15;
    const caseX = (width - caseWidth) / 2;
    const caseY = height * 0.55;
    
    // Display case top
    const glassGradient = ctx.createLinearGradient(caseX, caseY, caseX + caseWidth, caseY);
    glassGradient.addColorStop(0, 'rgba(126, 87, 194, 0.4)');
    glassGradient.addColorStop(0.5, 'rgba(179, 157, 219, 0.7)');
    glassGradient.addColorStop(1, 'rgba(126, 87, 194, 0.4)');
    
    ctx.fillStyle = glassGradient;
    ctx.fillRect(caseX, caseY, caseWidth, caseHeight);
    
    // Display case frame
    ctx.strokeStyle = '#9C7FF3';
    ctx.lineWidth = 3;
    ctx.strokeRect(caseX, caseY, caseWidth, caseHeight);
    
    // Display case front
    ctx.fillStyle = 'rgba(103, 58, 183, 0.6)';
    ctx.fillRect(caseX, caseY + caseHeight, caseWidth, caseHeight * 0.1);
    
    // Display featured cards in the case
    const featuredCardWidth = caseWidth * 0.15;
    const featuredCardHeight = featuredCardWidth * 1.4;
    const cardSpacing = featuredCardWidth * 1.3;
    
    // Premium featured cards
    for (let i = 0; i < 4; i++) {
      const cardX = caseX + (caseWidth - (cardSpacing * 3 + featuredCardWidth)) / 2 + (i * cardSpacing);
      const cardY = caseY + (caseHeight - featuredCardHeight) / 2;
      
      // Premium card with glow effect
      const glowSize = 6;
      const glowColors = ['#FFD700', '#FF6AC1', '#00E5FF', '#76FF03'];
      
      // Card glow
      ctx.shadowColor = glowColors[i % glowColors.length];
      ctx.shadowBlur = glowSize;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cardX, cardY, featuredCardWidth, featuredCardHeight);
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Card inner details
      ctx.fillStyle = glowColors[i % glowColors.length];
      ctx.fillRect(cardX + featuredCardWidth * 0.1, cardY + featuredCardHeight * 0.1, featuredCardWidth * 0.8, featuredCardHeight * 0.5);
      
      // Card text area
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cardX + featuredCardWidth * 0.1, cardY + featuredCardHeight * 0.7, featuredCardWidth * 0.8, featuredCardHeight * 0.2);
    }
  };
  
  const drawDecorativeElements = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Shop sign
    const signWidth = width * 0.3;
    const signHeight = height * 0.1;
    const signX = (width - signWidth) / 2;
    const signY = height * 0.15;
    
    // Sign background
    const signGradient = ctx.createLinearGradient(signX, signY, signX, signY + signHeight);
    signGradient.addColorStop(0, '#7B42F6');
    signGradient.addColorStop(1, '#5925DC');
    ctx.fillStyle = signGradient;
    
    ctx.beginPath();
    ctx.roundRect(signX, signY, signWidth, signHeight, 10);
    ctx.fill();
    
    // Sign border
    ctx.strokeStyle = '#B79CFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(signX, signY, signWidth, signHeight, 10);
    ctx.stroke();
    
    // Sign text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${height * 0.04}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PREMIUM CARDS', width / 2, signY + signHeight / 2);
    
    // Decorative lights
    for (let i = 0; i < 5; i++) {
      const lightX = width * 0.1 + (width * 0.8 / 4) * i;
      const lightY = height * 0.2;
      const lightRadius = width * 0.015;
      
      // Light glow
      const lightGlow = ctx.createRadialGradient(
        lightX, lightY, 0,
        lightX, lightY, lightRadius * 3
      );
      lightGlow.addColorStop(0, 'rgba(255, 255, 150, 0.8)');
      lightGlow.addColorStop(0.5, 'rgba(255, 255, 150, 0.3)');
      lightGlow.addColorStop(1, 'rgba(255, 255, 150, 0)');
      
      ctx.fillStyle = lightGlow;
      ctx.beginPath();
      ctx.arc(lightX, lightY, lightRadius * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Light bulb
      ctx.fillStyle = '#FFEA00';
      ctx.beginPath();
      ctx.arc(lightX, lightY, lightRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  const drawAmbientParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw floating particles/dust to add depth and movement
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height * 0.7;
      const size = Math.random() * 3 + 1;
      const opacity = Math.random() * 0.3 + 0.1;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ position: 'absolute', inset: 0 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 opacity-60"></div>
    </div>
  );
};

export default CardShopBackground;
