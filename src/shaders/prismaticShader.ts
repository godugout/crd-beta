
// Prismatic refraction shader
export const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
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
  
  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
      
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    // Create base coordinates for refraction
    vec2 p = vUv * 2.0 - 1.0;
    float angle = atan(p.y, p.x);
    float radius = length(p);
    
    // Create prismatic refraction patterns
    float noise1 = snoise(vUv * 5.0 + time * speed * 0.2) * 0.5 + 0.5;
    float noise2 = snoise(vUv * 10.0 - time * speed * 0.3) * 0.5 + 0.5;
    
    // Create RGB separation based on refraction
    float r = snoise(vUv + vec2(noise1 * 0.1, 0.0) + time * speed * 0.1) * 0.5 + 0.5;
    float g = snoise(vUv + vec2(0.0, noise2 * 0.1) + time * speed * 0.15) * 0.5 + 0.5;
    float b = snoise(vUv - vec2(noise1 * noise2 * 0.1) + time * speed * 0.2) * 0.5 + 0.5;
    
    // Create a light refraction effect
    float refraction = 
      sin(radius * 20.0 + time * speed) * 0.5 + 
      cos(angle * 8.0 + time * speed * 0.5) * 0.5;
    
    // Apply intensity
    r = mix(0.5, r, intensity);
    g = mix(0.5, g, intensity);
    b = mix(0.5, b, intensity);
    
    // Apply refraction and color tint
    vec3 color = vec3(r, g, b) * colorTint;
    color += refraction * 0.1 * intensity;
    
    // Add glow at edges
    float edgeGlow = 1.0 - smoothstep(0.4, 0.5, radius);
    color = mix(color, vec3(1.0, 1.0, 1.0), edgeGlow * 0.2 * intensity);
    
    // Final color with opacity
    float alpha = mix(0.3, 0.8, intensity) * (1.0 - radius * 0.5);
    gl_FragColor = vec4(color, alpha);
  }
`;
