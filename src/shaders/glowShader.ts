
export const glowVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glowFragmentShader = `
  uniform float time;
  uniform vec3 glowColor;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    // Create pulsating neon effect
    float intensity = 0.8 + sin(time * 2.0) * 0.2;
    
    // Edge detection - only glow near the edges of the card
    float edgeFactorX = smoothstep(0.0, 0.1, vUv.x) * smoothstep(0.0, 0.1, 1.0 - vUv.x);
    float edgeFactorY = smoothstep(0.0, 0.1, vUv.y) * smoothstep(0.0, 0.1, 1.0 - vUv.y);
    float edgeFactor = 1.0 - (edgeFactorX * edgeFactorY);
    
    // Make the edge glow brighter
    float glowFactor = pow(edgeFactor, 2.0) * intensity;
    
    // Final color with pulsating neon
    vec3 finalColor = glowColor * glowFactor;
    gl_FragColor = vec4(finalColor, glowFactor * 0.8);
  }
`;
