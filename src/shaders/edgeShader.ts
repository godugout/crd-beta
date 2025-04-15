
// Vertex shader for card edges
export const edgeVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    
    // Add a slight outward offset to ensure the edges are visible
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment shader for card edges with interesting color patterns
export const edgeFragmentShader = `
  uniform float time;
  uniform vec3 baseColor;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  // Constants for edge customization
  const float EDGE_WIDTH = 0.02;
  const float COLOR_SHIFT_SPEED = 0.5;
  const float GRADIENT_SCALE = 5.0;
  
  // Simple noise function for texture variation
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  void main() {
    // Calculate how close we are to an edge
    float xEdge = min(vUv.x, 1.0 - vUv.x);
    float yEdge = min(vUv.y, 1.0 - vUv.y);
    float edgeFactor = min(xEdge, yEdge);
    
    // Create a gradient based on position
    float gradient = abs(sin(vUv.x * GRADIENT_SCALE + time * 0.2)) * 
                    abs(sin(vUv.y * GRADIENT_SCALE + time * 0.3));
    
    // Mix colors for an interesting effect
    // Base color is the primary purple
    vec3 edgeColor = baseColor;
    
    // Add some color variation based on position and time
    float colorShift = sin(vUv.x * 10.0 + time * COLOR_SHIFT_SPEED) * 0.5 + 0.5;
    vec3 accentColor = vec3(0.6, 0.4, 1.0); // Lighter purple
    
    // Mix the base and accent colors
    vec3 finalColor = mix(edgeColor, accentColor, colorShift * gradient);
    
    // Add a subtle noise pattern
    float noiseFactor = noise(vUv * 20.0 + time * 0.1) * 0.1;
    finalColor += vec3(noiseFactor);
    
    // Only show colors on the actual edges of the card for a cleaner look
    float edgeVisibility = smoothstep(0.0, EDGE_WIDTH, edgeFactor);
    
    // Apply opacity - make it visible but slightly transparent (95% transparent)
    gl_FragColor = vec4(finalColor, 0.05 * (1.0 - edgeVisibility));
  }
`;
