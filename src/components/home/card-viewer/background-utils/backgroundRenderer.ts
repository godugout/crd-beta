
/**
 * Draws the card shop background on a canvas
 * @param ctx - Canvas rendering context
 * @param width - Canvas width
 * @param height - Canvas height
 */
export const drawCardShopBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  // Clear the canvas
  ctx.clearRect(0, 0, width, height);
  
  // Create a gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
  gradient.addColorStop(1, 'rgba(23, 36, 64, 0.95)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Draw subtle grid pattern
  drawGrid(ctx, width, height);
  
  // Add a few particles
  drawParticles(ctx, width, height);
  
  // Add some vignette effect
  drawVignette(ctx, width, height);
};

/**
 * Draws a subtle grid pattern
 */
const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const gridSize = 40;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  
  // Draw vertical lines
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Draw horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

/**
 * Draws particles on the background
 */
const drawParticles = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const particleCount = width < 600 ? 20 : 40;
  
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 2 + 0.5;
    const opacity = Math.random() * 0.15;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fill();
  }
};

/**
 * Adds a vignette effect to the background
 */
const drawVignette = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 1.5
  );
  
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};
