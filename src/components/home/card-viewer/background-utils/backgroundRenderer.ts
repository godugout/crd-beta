
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
}

/**
 * Draw a soft gradient background
 */
export function drawGradientBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, '#F1F0FB');    // Soft Gray
  bgGradient.addColorStop(1, '#D3E4FD');    // Soft Blue
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draw subtle ambient particles
 */
export function drawSoftParticles(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 2 + 1;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/**
 * Draw soft lighting effects
 */
export function drawSoftLighting(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const lightGradient = ctx.createRadialGradient(
    width * 0.7, height * 0.3, 0,
    width * 0.7, height * 0.3, width * 0.5
  );
  lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
  lightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = lightGradient;
  ctx.fillRect(0, 0, width, height);
}
