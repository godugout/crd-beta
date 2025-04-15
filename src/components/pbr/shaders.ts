// Basic PBR shaders for our proof of concept

// Vertex shader
export const pbrVertexShader = `#version 300 es
precision highp float;

in vec3 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;

out vec3 v_normal;
out vec2 v_texcoord;
out vec3 v_position;

void main() {
  // Transform position into world space
  vec4 worldPosition = u_model * vec4(a_position, 1.0);
  
  // Transform to view space
  gl_Position = u_projection * u_view * worldPosition;
  
  // Pass normal to fragment shader
  v_normal = mat3(u_model) * a_normal;
  
  // Pass texture coordinate to fragment shader
  v_texcoord = a_texcoord;
  
  // Pass world position to fragment shader
  v_position = worldPosition.xyz;
}
`;

// Fragment shader implementing basic PBR
export const pbrFragmentShader = `#version 300 es
precision highp float;

in vec3 v_normal;
in vec2 v_texcoord;
in vec3 v_position;

uniform sampler2D u_albedoMap;
uniform sampler2D u_normalMap;
uniform sampler2D u_roughnessMap;
uniform sampler2D u_metalnessMap;
uniform sampler2D u_envMap;

uniform float u_roughness;
uniform float u_metalness;
uniform float u_exposure;
uniform float u_envMapIntensity;
uniform float u_reflectionStrength;
uniform float u_time;
uniform float u_holographicEffect;
uniform float u_chromeEffect;
uniform float u_vintageEffect;

out vec4 outColor;

// Constants
const float PI = 3.14159265359;
const vec3 lightPos = vec3(10.0, 10.0, 10.0);
const vec3 lightColor = vec3(1.0, 0.9, 0.8);

// PBR functions
float DistributionGGX(vec3 N, vec3 H, float roughness) {
  float a = roughness * roughness;
  float a2 = a * a;
  float NdotH = max(dot(N, H), 0.0);
  float NdotH2 = NdotH * NdotH;
  
  float denom = NdotH2 * (a2 - 1.0) + 1.0;
  denom = PI * denom * denom;
  
  return a2 / max(denom, 0.001);
}

float GeometrySchlickGGX(float NdotV, float roughness) {
  float r = roughness + 1.0;
  float k = (r * r) / 8.0;
  
  return NdotV / (NdotV * (1.0 - k) + k);
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
  float NdotV = max(dot(N, V), 0.0);
  float NdotL = max(dot(N, L), 0.0);
  float ggx1 = GeometrySchlickGGX(NdotV, roughness);
  float ggx2 = GeometrySchlickGGX(NdotL, roughness);
  
  return ggx1 * ggx2;
}

vec3 fresnelSchlick(float cosTheta, vec3 F0) {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

// Helper function to create a reflection vector for environment mapping
vec3 getReflectionVector(vec3 viewDir, vec3 normal) {
  return reflect(viewDir, normal);
}

// Simulate HDR environment lookup with a simple function
vec3 sampleEnvironment(vec3 direction) {
  // Simulate a skybox using the reflection direction
  float theta = atan(direction.z, direction.x);
  float phi = asin(direction.y);
  
  // Map to UV coordinates
  vec2 uv = vec2(theta / (2.0 * PI) + 0.5, phi / PI + 0.5);
  
  // Simulate HDR environment by generating a procedural gradient with some variation
  float time = u_time * 0.1;
  vec3 color1 = vec3(0.2, 0.3, 0.4);
  vec3 color2 = vec3(0.6, 0.7, 0.9);
  
  // Add some movement to the environment
  float noise = sin(uv.x * 10.0 + time) * 0.5 + 0.5;
  noise *= sin(uv.y * 8.0 - time * 0.7) * 0.5 + 0.5;
  
  // Blend colors based on direction and noise
  vec3 envColor = mix(color1, color2, uv.y * noise);
  
  // Add a "sun" to the environment
  vec3 sunDir = normalize(vec3(sin(time * 0.5), 0.5, cos(time * 0.5)));
  float sunDot = max(dot(direction, sunDir), 0.0);
  float sunIntensity = pow(sunDot, 64.0) * 5.0;
  
  envColor += vec3(1.0, 0.9, 0.7) * sunIntensity;
  
  return envColor * u_envMapIntensity;
}

// Main shader function
void main() {
  // Sample textures
  vec4 albedoTexture = texture(u_albedoMap, v_texcoord);
  
  // Use a base albedo color for the proof of concept
  vec3 albedo = vec3(0.9, 0.9, 0.9) * albedoTexture.rgb;
  
  // Get the normal, roughness, and metalness values
  // For the POC, we'll use uniform values instead of textures
  vec3 N = normalize(v_normal);
  float roughness = u_roughness;
  float metalness = u_metalness;
  
  // Calculate reflection vectors
  vec3 viewPos = vec3(0.0, 0.0, 0.0); // Camera at origin in view space
  vec3 V = normalize(viewPos - v_position);
  vec3 R = getReflectionVector(-V, N);
  
  // Fresnel reflectance at normal incidence (metalness workflow)
  vec3 F0 = vec3(0.04);
  F0 = mix(F0, albedo, metalness);
  
  // Calculate lighting for a key light source
  vec3 L = normalize(lightPos - v_position);
  vec3 H = normalize(V + L);
  float distance = length(lightPos - v_position);
  float attenuation = 1.0 / (distance * distance);
  vec3 radiance = lightColor * attenuation;
  
  // Cook-Torrance BRDF
  float NDF = DistributionGGX(N, H, roughness);
  float G = GeometrySmith(N, V, L, roughness);
  vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);
  
  vec3 kS = F;
  vec3 kD = vec3(1.0) - kS;
  kD *= 1.0 - metalness;
  
  vec3 numerator = NDF * G * F;
  float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);
  vec3 specular = numerator / max(denominator, 0.001);
  
  // Add reflections
  vec3 environmentColor = sampleEnvironment(R);
  vec3 reflection = environmentColor * F * u_reflectionStrength;
  
  // Outgoing light
  float NdotL = max(dot(N, L), 0.0);
  vec3 Lo = (kD * albedo / PI + specular) * radiance * NdotL;
  
  // Ambient light (environment contribution)
  vec3 ambient = vec3(0.03) * albedo;
  
  // Combine light contributions
  vec3 color = ambient + Lo + reflection;
  
  // HDR tone mapping and gamma correction
  color = color / (color + vec3(1.0)); // Reinhard tone mapping
  color = pow(color, vec3(1.0/2.2)); // Gamma correction
  
  // Apply exposure
  color *= u_exposure;
  
  // Apply some illumination variation over time to simulate a dynamic environment
  float pulse = sin(u_time * 0.5) * 0.05 + 0.95;
  color *= pulse;
  
  // Apply holographic effect
  if (u_holographicEffect > 0.0) {
      float holoPattern = sin(v_texcoord.x * 50.0 + u_time) * sin(v_texcoord.y * 50.0 + u_time);
      vec3 holoColor = vec3(0.5 + 0.5 * sin(u_time), 0.5 + 0.5 * sin(u_time + 2.0), 1.0);
      color = mix(color, color * (1.0 + holoPattern) * holoColor, u_holographicEffect);
  }
  
  // Apply chrome effect
  if (u_chromeEffect > 0.0) {
      float fresnel = pow(1.0 - max(dot(N, V), 0.0), 5.0);
      vec3 chromeColor = mix(vec3(0.8), vec3(1.0), fresnel);
      color = mix(color, color * chromeColor, u_chromeEffect);
  }
  
  // Apply vintage effect
  if (u_vintageEffect > 0.0) {
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      vec3 sepiaColor = vec3(luminance * 1.2, luminance, luminance * 0.8);
      color = mix(color, sepiaColor, u_vintageEffect);
  }
  
  // Mix in the rim effect based on metalness
  color = mix(color, color + rimColor, metalness * 0.5);
  
  // Output final color
  outColor = vec4(color, 1.0);
}
`;
