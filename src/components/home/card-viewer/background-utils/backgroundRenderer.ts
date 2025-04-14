
/**
 * Main function to draw the card shop background
 */
export function drawCardShopBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw background layers
  drawGradientBackground(ctx, width, height);
  drawSoftParticles(ctx, width, height);
  drawSoftLighting(ctx, width, height);
  drawPatternGrid(ctx, width, height);
}

/**
 * Draw a soft gradient background
 */
export function drawGradientBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, '#1a1a2e');    // Dark blue
  bgGradient.addColorStop(1, '#16213e');    // Slightly lighter blue
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draw subtle ambient particles
 */
export function drawSoftParticles(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.globalAlpha = 0.2;
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 1.5 + 0.5;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/**
 * Draw soft lighting effects
 */
export function drawSoftLighting(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  // Main spotlight
  const lightGradient = ctx.createRadialGradient(
    width * 0.5, height * 0.3, 0,
    width * 0.5, height * 0.3, width * 0.7
  );
  lightGradient.addColorStop(0, 'rgba(65, 105, 225, 0.08)');
  lightGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = lightGradient;
  ctx.fillRect(0, 0, width, height);
  
  // Secondary spotlight
  const spotlightGradient = ctx.createRadialGradient(
    width * 0.7, height * 0.7, 0,
    width * 0.7, height * 0.7, width * 0.5
  );
  spotlightGradient.addColorStop(0, 'rgba(70, 130, 180, 0.05)');
  spotlightGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = spotlightGradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draw subtle grid pattern
 */
export function drawPatternGrid(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  
  // Draw horizontal lines
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  // Draw vertical lines
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}
