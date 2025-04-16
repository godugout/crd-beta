
export const edgeVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const edgeFragmentShader = `
  uniform float time;
  uniform vec3 baseColor;
  
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    // Create subtle patterns on the edges
    float pattern = sin(vPosition.x * 20.0 + time) * sin(vPosition.y * 20.0 + time) * 0.1 + 0.9;
    
    // Darker on the sides
    float edgeFactor = min(abs(vPosition.x), abs(vPosition.y)) * 2.0;
    
    // Final color with pattern
    vec3 finalColor = baseColor * pattern * (0.8 + edgeFactor * 0.2);
    
    gl_FragColor = vec4(finalColor, 0.95);
  }
`;
