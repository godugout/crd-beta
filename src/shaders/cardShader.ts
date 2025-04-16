
export const cardVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    
    vec4 mvPosition = viewMatrix * worldPosition;
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
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;

  void main() {
    vec2 uv = vUv;
    vec4 texColor;
    
    // Determine whether to show front or back texture based on normal direction
    if (isFlipped) {
      texColor = texture2D(backTexture, vec2(1.0 - uv.x, uv.y));
    } else {
      texColor = texture2D(frontTexture, uv);
    }
    
    // Basic lighting with environment reflection
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vWorldNormal);
    
    float fresnel = pow(1.0 - dot(viewDir, normal), 3.0) * 0.5;
    
    // Apply fresnel effect for a subtle edge highlight
    vec3 color = mix(texColor.rgb, vec3(1.0), fresnel * 0.3);
    
    gl_FragColor = vec4(color, texColor.a);
  }
`;
