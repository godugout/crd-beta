
export const glowVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glowFragmentShader = `
  uniform float time;
  uniform vec3 glowColor;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  // Constants for glow customization
  const float PULSE_SPEED = 2.0;
  const float EDGE_WIDTH = 0.1;
  const float GLOW_INTENSITY = 0.8;
  const float PLASMA_DETAIL = 8.0;
  
  // Simple noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  // Plasma-like effect
  float plasma(vec2 p, float time) {
    float x = p.x * PLASMA_DETAIL + sin(time * 0.1) * 5.0;
    float y = p.y * PLASMA_DETAIL + cos(time * 0.2) * 5.0;
    
    float v1 = sin(x + time);
    float v2 = sin(y + time * 0.5);
    float v3 = sin(x + y + time * 0.3);
    float v4 = sin(sqrt(x*x + y*y) + time * 0.2);
    
    return (v1 + v2 + v3 + v4) * 0.25 + 0.5;
  }
  
  void main() {
    // Create pulsating neon effect
    float intensity = GLOW_INTENSITY + sin(time * PULSE_SPEED) * 0.2;
    
    // Edge detection - only glow near the edges of the card
    float edgeFactorX = smoothstep(0.0, EDGE_WIDTH, vUv.x) * smoothstep(0.0, EDGE_WIDTH, 1.0 - vUv.x);
    float edgeFactorY = smoothstep(0.0, EDGE_WIDTH, vUv.y) * smoothstep(0.0, EDGE_WIDTH, 1.0 - vUv.y);
    float edgeFactorZ = smoothstep(0.0, EDGE_WIDTH, (vPosition.z + 0.075) / 0.15) * 
                       smoothstep(0.0, EDGE_WIDTH, 1.0 - (vPosition.z + 0.075) / 0.15);
    
    float edgeFactor = 1.0 - (edgeFactorX * edgeFactorY * edgeFactorZ);
    
    // Add plasma effect to the edges
    float plasmaEffect = plasma(vUv, time);
    
    // Make the edge glow brighter
    float glowFactor = pow(edgeFactor, 1.5) * intensity;
    
    // Mix plasma with base glow
    vec3 plasmaColor = mix(glowColor, vec3(plasmaEffect, plasmaEffect * 0.5, plasmaEffect * 0.8), 0.5);
    
    // Final color with pulsating neon
    vec3 finalColor = plasmaColor * glowFactor;
    
    // Higher opacity for better visibility
    gl_FragColor = vec4(finalColor, glowFactor * 0.9);
  }
`;
