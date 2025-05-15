
// Holographic effect shader
export const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform float speed;
  uniform vec3 colorTint;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  // Pseudo-random function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  void main() {
    // Create holographic rainbow effect
    float hueOffset = time * speed * 0.3;
    float hue = vUv.x + vUv.y + hueOffset;
    
    // Create rainbow color
    vec3 rainbow;
    float h = mod(hue, 1.0);
    float s = 0.8;
    float v = 0.9;
    
    // HSV to RGB conversion
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + K.xyz) * 6.0 - K.www);
    rainbow = v * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), s);
    
    // Create iridescent effect
    float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 3.0);
    
    // Add shimmer/sparkle effect
    float sparkle = 0.0;
    for (int i = 0; i < 3; i++) {
      float scale = float(i + 1) * 10.0;
      vec2 offset = vec2(time * speed * (0.2 * float(i) + 0.1));
      sparkle += random(vUv * scale + offset) * 0.3;
    }
    sparkle = pow(sparkle, 4.0) * 2.0;
    
    // Mix all effects together
    vec3 baseColor = mix(rainbow, vec3(1.0), fresnel * 0.6);
    vec3 finalColor = mix(baseColor * colorTint, vec3(1.0), sparkle);
    
    // Apply intensity and build final color
    finalColor = mix(vec3(0.5), finalColor, intensity);
    
    // Add transparency based on intensity and sparkle
    float alpha = min(intensity * 0.7 + sparkle * 0.3, 0.95);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
