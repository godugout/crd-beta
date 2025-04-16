
export const glowVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glowFragmentShader = `
  uniform float time;
  uniform vec3 glowColor;
  
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    // Create a gradient for the edges
    float edge = pow(1.0 - max(abs(vUv.x - 0.5) * 2.0, abs(vUv.y - 0.5) * 2.0), 3.0);
    
    // Pulsing effect
    float pulse = 0.5 + 0.5 * sin(time * 2.0);
    
    // Combine glow color with edge effect
    vec3 finalColor = glowColor * edge * (0.7 + 0.3 * pulse);
    
    gl_FragColor = vec4(finalColor, edge * 0.7);
  }
`;
