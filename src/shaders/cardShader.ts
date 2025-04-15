
export const cardVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const cardFragmentShader = `
  uniform sampler2D frontTexture;
  uniform sampler2D backTexture;
  uniform bool isFlipped;
  uniform float time;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec4 texColor;
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Calculate metallic reflection effect
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.0);
    vec3 metalColor = vec3(0.8, 0.8, 0.9); // Slight blue-ish silver
    
    if (isFlipped) {
      // Back of card - metallic effect with etched details
      vec4 backTex = texture2D(backTexture, vUv);
      float etching = 1.0 - (backTex.r + backTex.g + backTex.b) / 3.0;
      
      // Create dynamic light patterns
      float pattern1 = sin(vUv.x * 20.0 + time) * 0.5 + 0.5;
      float pattern2 = cos(vUv.y * 15.0 - time * 0.7) * 0.5 + 0.5;
      
      // Create metallic surface with etched details and dynamic patterns
      vec3 baseMetallic = mix(metalColor * 0.6, metalColor, fresnel);
      vec3 etchedColor = mix(baseMetallic * 0.3, baseMetallic, etching);
      vec3 finalColor = mix(etchedColor, etchedColor * 1.2, pattern1 * pattern2);
      
      texColor = vec4(finalColor, 1.0);
    } else {
      // Front of card - apply the front texture with enhanced lighting
      vec4 frontTex = texture2D(frontTexture, vUv);
      
      // Add subtle light reflections
      vec3 enhancedColor = frontTex.rgb * (1.0 + fresnel * 0.3);
      texColor = vec4(enhancedColor, frontTex.a);
    }
    
    gl_FragColor = texColor;
  }
`;
