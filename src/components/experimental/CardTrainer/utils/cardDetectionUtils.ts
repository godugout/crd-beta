
import { DetectedCard } from '../types';

export const drawDetectedCards = (
  canvas: HTMLCanvasElement, 
  cards: DetectedCard[], 
  drawEdges: boolean, 
  drawContours: boolean,
  imageElement: HTMLImageElement
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx || !imageElement) return;
  
  // Draw the image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    imageElement,
    0,
    0,
    canvas.width,
    canvas.height
  );
  
  // Draw the detected cards
  cards.forEach((card, index) => {
    ctx.save();
    
    // Set up styles for card bounding box
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 2;
    
    // Draw the bounding box with rotation
    ctx.translate(card.x + card.width/2, card.y + card.height/2);
    ctx.rotate(card.rotation * Math.PI / 180);
    ctx.strokeRect(-card.width/2, -card.height/2, card.width, card.height);
    
    // Label the card
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.font = '14px Arial';
    ctx.fillText(`Card ${index + 1}`, -card.width/2 + 5, -card.height/2 + 20);
    
    ctx.restore();
  });
  
  // Draw edges and contours if enabled
  if (drawEdges || drawContours) {
    // This would be implemented with actual edge/contour detection
    if (drawEdges) {
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    }
    
    if (drawContours) {
      ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(canvas.width - 100, 100);
      ctx.lineTo(canvas.width - 100, canvas.height - 100);
      ctx.lineTo(100, canvas.height - 100);
      ctx.closePath();
      ctx.stroke();
    }
  }
};

// Calculate a simple match score between manual traces and detected cards
export const calculateMatchScore = (manual: DetectedCard[], detected: DetectedCard[]): number => {
  if (!manual.length || !detected.length) return 0;
  
  // For simplicity, we'll use a very basic overlap score
  let totalScore = 0;
  
  manual.forEach(manualCard => {
    // Find the best matching detected card
    const scores = detected.map(detectedCard => {
      // Calculate center points
      const manualCenterX = manualCard.x + manualCard.width / 2;
      const manualCenterY = manualCard.y + manualCard.height / 2;
      const detectedCenterX = detectedCard.x + detectedCard.width / 2;
      const detectedCenterY = detectedCard.y + detectedCard.height / 2;
      
      // Calculate distance between centers
      const distance = Math.sqrt(
        Math.pow(manualCenterX - detectedCenterX, 2) + 
        Math.pow(manualCenterY - detectedCenterY, 2)
      );
      
      // Calculate size difference
      const sizeDiff = Math.abs(
        (manualCard.width * manualCard.height) - 
        (detectedCard.width * detectedCard.height)
      ) / (manualCard.width * manualCard.height);
      
      // Calculate rotation difference (simplified)
      const rotDiff = Math.abs(manualCard.rotation - detectedCard.rotation) / 180;
      
      // Combine factors (lower is better)
      return distance + sizeDiff * 100 + rotDiff * 50;
    });
    
    // Find the best match (lowest score)
    const bestScore = Math.min(...scores);
    const normalizedScore = Math.max(0, 100 - bestScore);
    
    totalScore += normalizedScore;
  });
  
  return totalScore / manual.length;
};
