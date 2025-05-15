
// Metallic effect shader
export const vertexShader = `
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

export const fragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform float speed;
  uniform float roughness;
  uniform float metalness;
  uniform vec3 colorTint;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  
  // Environment map approximation
  vec3 sphericalEnvMap(vec3 normal) {
    // Very simple environment map
    float phi = acos(normal.y);
    float theta = atan(normal.x, normal.z) + 3.14159265359;
    
    vec2 uv = vec2(theta / (2.0 * 3.14159265359), phi / 3.14159265359);
    
    // Create a simple gradient environment
    vec3 color = vec3(0.2, 0.2, 0.3) + vec3(uv.x * 0.6, uv.y * 0.5, 0.7 - uv.y * 0.6);
    
    return color;
  }
  
  // Fresnel approximation
  float fresnel(vec3 viewDirection, vec3 normal, float power) {
    return pow(1.0 - clamp(dot(viewDirection, normal), 0.0, 1.0), power);
  }
  
  void main() {
    // Normalize view direction
    vec3 viewDirection = normalize(vViewPosition);
    
    // Add subtle movement to normal
    vec3 normal = vNormal;
    normal.xz += sin(vUv.y * 10.0 + time * speed) * 0.02 * intensity;
    normal = normalize(normal);
    
    // Calculate metallic reflection
    float fresnelTerm = fresnel(viewDirection, normal, 5.0 * metalness);
    vec3 reflection = sphericalEnvMap(reflect(-viewDirection, normal));
    
    // Base metal color
    vec3 baseColor = colorTint * 0.8;
    
    // Mix metal with reflection based on fresnel and metalness
    vec3 finalColor = mix(baseColor, reflection, fresnelTerm * metalness);
    
    // Add subtle texture for roughness
    float pattern = 
      (sin(vUv.x * 100.0) * sin(vUv.y * 100.0)) * 0.1 * roughness + 
      sin(vUv.x * 200.0 + time * speed) * 0.05 * roughness;
    
    finalColor += pattern;
    
    // Apply highlights based on normal and light direction
    vec3 lightDir = normalize(vec3(sin(time * speed * 0.5), 0.5, cos(time * speed * 0.5)));
    float diffuse = max(0.0, dot(normal, lightDir));
    float specular = pow(max(0.0, dot(reflect(-lightDir, normal), viewDirection)), 20.0 * (1.0 - roughness));
    
    finalColor += specular * intensity * (1.0 - roughness);
    finalColor *= (0.7 + diffuse * 0.3);
    
    // Apply intensity
    finalColor = mix(baseColor * 0.5, finalColor, intensity);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
