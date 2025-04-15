
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { PbrSettings } from './types';

/**
 * Create a Three.js scene with PBR materials for card rendering
 */
export function createPbrScene(
  canvas: HTMLCanvasElement,
  container: HTMLDivElement,
  settings: PbrSettings,
  cardImageUrl?: string
) {
  // Create scene and renderer
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  
  // Set up renderer
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = settings.exposure;
  // Replace deprecated outputEncoding with outputColorSpace
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  
  // Set up camera
  const camera = new THREE.PerspectiveCamera(
    45, 
    container.clientWidth / container.clientHeight, 
    0.1, 
    100
  );
  camera.position.z = 3;
  
  // Set up controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI * 0.8;
  controls.minDistance = 2;
  controls.maxDistance = 6;
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 2, 3);
  scene.add(directionalLight);
  
  // Card dimensions (standard trading card aspect ratio ~2.5:3.5)
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardDepth = 0.05;
  
  // Load environment map for reflections
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  
  let envMap: THREE.Texture;
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load(
    '/assets/environment/studio_small_03_1k.hdr',
    (texture) => {
      envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;
      texture.dispose();
      pmremGenerator.dispose();
    }
  );
  
  // Create card material
  const cardMaterial = new THREE.MeshStandardMaterial({
    roughness: settings.roughness,
    metalness: settings.metalness,
    envMapIntensity: settings.envMapIntensity,
    side: THREE.DoubleSide
  });
  
  // Create card geometry
  const cardGeometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);
  
  // Create card mesh
  const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
  scene.add(cardMesh);
  
  // Create edge highlight material for holographic effect
  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.9,
    envMapIntensity: settings.envMapIntensity * 2,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
  });
  
  // Create edge geometry slightly larger than the card
  const edgeGeometry = new THREE.BoxGeometry(
    cardWidth * 1.01, 
    cardHeight * 1.01, 
    cardDepth * 1.02
  );
  
  // Create edge mesh for highlight effects
  const edgeMesh = new THREE.Mesh(edgeGeometry, edgeMaterial);
  edgeMesh.visible = settings.holographicEffect > 0;
  scene.add(edgeMesh);
  
  // Load card texture if URL provided
  if (cardImageUrl) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      cardImageUrl,
      (texture) => {
        // Apply the texture to the front face
        const frontFaceMaterial = cardMaterial.clone();
        frontFaceMaterial.map = texture;
        
        // Apply vintage effect if enabled
        if (settings.vintageEffect > 0) {
          frontFaceMaterial.color.setRGB(
            1 - settings.vintageEffect * 0.2,
            1 - settings.vintageEffect * 0.1, 
            1 - settings.vintageEffect * 0.3
          );
        }
        
        // Apply chrome effect if enabled
        if (settings.chromeEffect > 0) {
          frontFaceMaterial.metalness = Math.max(cardMaterial.metalness, settings.chromeEffect);
          frontFaceMaterial.roughness = Math.min(cardMaterial.roughness, 0.4 - settings.chromeEffect * 0.2);
        }
        
        // Create materials array for each face of the box
        const materials = [
          cardMaterial, // Right
          cardMaterial, // Left
          cardMaterial, // Top
          cardMaterial, // Bottom
          frontFaceMaterial, // Front
          cardMaterial  // Back
        ];
        
        // Fix for TS2352: Use proper material assignment
        cardMesh.material = materials;
        
        // Explicitly cast the mesh to have a material array
        (cardMesh as THREE.Mesh<THREE.BufferGeometry, THREE.Material[]>).material = materials;
      },
      undefined,
      (error) => {
        console.error('Error loading card texture', error);
      }
    );
  }
  
  // Animation loop
  const clock = new THREE.Clock();
  
  const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    
    // Animate holographic effect
    if (settings.holographicEffect > 0) {
      edgeMesh.visible = true;
      edgeMesh.material.opacity = 0.4 + Math.sin(elapsedTime * 2) * 0.1 * settings.holographicEffect;
      
      // Update edge material color based on camera angle
      const hue = (elapsedTime * 0.1) % 1;
      edgeMesh.material.color.setHSL(hue, 0.8, 0.5);
    } else {
      edgeMesh.visible = false;
    }
    
    // Update controls
    controls.update();
    
    // Render scene
    renderer.render(scene, camera);
    
    // Request next frame
    requestAnimationFrame(animate);
  };
  
  // Start animation loop
  animate();
  
  // Handle window resize
  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Clean up function
  const cleanup = () => {
    window.removeEventListener('resize', handleResize);
    
    // Properly dispose of scene objects
    scene.traverse((object: THREE.Object3D) => {
      // Handle mesh objects with geometry and material
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }
        
        // Handle materials (could be a single material or an array)
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => {
            if (material instanceof THREE.Material) {
              material.dispose();
            }
          });
        } else if (object.material instanceof THREE.Material) {
          object.material.dispose();
        }
      }
    });
    
    // Clear the scene
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    
    // Dispose of specific resources
    cardGeometry.dispose();
    cardMaterial.dispose();
    edgeGeometry.dispose();
    edgeMaterial.dispose();
    
    // Dispose of controls and renderer
    controls.dispose();
    renderer.dispose();
    
    // If environment map was loaded, dispose it too
    if (envMap) {
      envMap.dispose();
    }
  };
  
  return { cleanup };
}
