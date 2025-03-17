
import { PbrSettings, PbrSceneOptions } from './types';
import { pbrFragmentShader, pbrVertexShader } from './shaders';

export function createPbrScene(
  canvas: HTMLCanvasElement,
  container: HTMLDivElement,
  settings: PbrSettings
): PbrSceneOptions {
  // Initialize WebGL context
  const gl = canvas.getContext('webgl2');
  
  if (!gl) {
    console.error('WebGL2 not supported');
    return { cleanup: () => {} };
  }
  
  // Set canvas size to container size
  const resizeCanvas = () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  
  resizeCanvas();
  
  // Add resize listener
  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(container);
  
  // Compile shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, pbrVertexShader);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, pbrFragmentShader);
  
  if (!vertexShader || !fragmentShader) {
    return { cleanup: () => resizeObserver.disconnect() };
  }
  
  // Create shader program
  const program = createProgram(gl, vertexShader, fragmentShader);
  
  if (!program) {
    return { cleanup: () => resizeObserver.disconnect() };
  }
  
  gl.useProgram(program);
  
  // Create card geometry (simple plane for now)
  const cardGeometry = createCardGeometry(gl);
  
  // Set up attribute buffers
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const normalAttributeLocation = gl.getAttribLocation(program, 'a_normal');
  const texcoordAttributeLocation = gl.getAttribLocation(program, 'a_texcoord');
  
  gl.bindBuffer(gl.ARRAY_BUFFER, cardGeometry.position);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, cardGeometry.normal);
  gl.enableVertexAttribArray(normalAttributeLocation);
  gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, cardGeometry.texcoord);
  gl.enableVertexAttribArray(texcoordAttributeLocation);
  gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  
  // Set up uniforms
  const roughnessLocation = gl.getUniformLocation(program, 'u_roughness');
  const metalnessLocation = gl.getUniformLocation(program, 'u_metalness');
  const exposureLocation = gl.getUniformLocation(program, 'u_exposure');
  const envMapIntensityLocation = gl.getUniformLocation(program, 'u_envMapIntensity');
  const reflectionStrengthLocation = gl.getUniformLocation(program, 'u_reflectionStrength');
  const timeLocation = gl.getUniformLocation(program, 'u_time');
  
  // Create and load textures
  const albedoTexture = gl.createTexture();
  const normalTexture = gl.createTexture();
  const roughnessTexture = gl.createTexture();
  const metalnessTexture = gl.createTexture();
  const envMapTexture = gl.createTexture();
  
  // Load default blank textures for now
  createDefaultTexture(gl, albedoTexture);
  createDefaultTexture(gl, normalTexture);
  createDefaultTexture(gl, roughnessTexture);
  createDefaultTexture(gl, metalnessTexture);
  createDefaultTexture(gl, envMapTexture);
  
  // Set up texture uniform locations
  const albedoLocation = gl.getUniformLocation(program, 'u_albedoMap');
  const normalMapLocation = gl.getUniformLocation(program, 'u_normalMap');
  const roughnessMapLocation = gl.getUniformLocation(program, 'u_roughnessMap');
  const metalnessMapLocation = gl.getUniformLocation(program, 'u_metalnessMap');
  const envMapLocation = gl.getUniformLocation(program, 'u_envMap');
  
  // Set texture units
  gl.uniform1i(albedoLocation, 0);
  gl.uniform1i(normalMapLocation, 1);
  gl.uniform1i(roughnessMapLocation, 2);
  gl.uniform1i(metalnessMapLocation, 3);
  gl.uniform1i(envMapLocation, 4);
  
  // Set clearColor
  gl.clearColor(0.05, 0.05, 0.05, 1.0);
  gl.enable(gl.DEPTH_TEST);
  
  // Setup mouse interaction for the card
  let isRotating = false;
  let rotationX = 0;
  let rotationY = 0;
  let startX = 0;
  let startY = 0;
  
  canvas.addEventListener('mousedown', (e) => {
    isRotating = true;
    startX = e.clientX;
    startY = e.clientY;
  });
  
  canvas.addEventListener('mousemove', (e) => {
    if (!isRotating) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    rotationY += deltaX * 0.01;
    rotationX += deltaY * 0.01;
    
    startX = e.clientX;
    startY = e.clientY;
  });
  
  canvas.addEventListener('mouseup', () => {
    isRotating = false;
  });
  
  canvas.addEventListener('mouseleave', () => {
    isRotating = false;
  });
  
  // Animation loop
  let animationFrameId: number;
  const startTime = performance.now();
  
  const render = () => {
    const currentTime = (performance.now() - startTime) / 1000;
    
    // Update canvas size if needed
    if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
      resizeCanvas();
    }
    
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Update material uniforms from settings
    gl.uniform1f(roughnessLocation, settings.roughness);
    gl.uniform1f(metalnessLocation, settings.metalness);
    gl.uniform1f(exposureLocation, settings.exposure);
    gl.uniform1f(envMapIntensityLocation, settings.envMapIntensity);
    gl.uniform1f(reflectionStrengthLocation, settings.reflectionStrength);
    gl.uniform1f(timeLocation, currentTime);
    
    // Set up camera matrix and rotation
    const aspect = canvas.width / canvas.height;
    const projectionMatrix = createPerspectiveMatrix(60 * Math.PI / 180, aspect, 0.1, 100);
    const viewMatrix = createViewMatrix();
    
    // Add rotation to model matrix
    const modelMatrix = createModelMatrix(rotationX, rotationY);
    
    // Set matrix uniforms
    const projectionLocation = gl.getUniformLocation(program, 'u_projection');
    const viewLocation = gl.getUniformLocation(program, 'u_view');
    const modelLocation = gl.getUniformLocation(program, 'u_model');
    
    gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(viewLocation, false, viewMatrix);
    gl.uniformMatrix4fv(modelLocation, false, modelMatrix);
    
    // Draw the card
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cardGeometry.indices);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    
    // Continue animation loop
    animationFrameId = requestAnimationFrame(render);
  };
  
  // Start rendering
  render();
  
  // Return cleanup function
  return {
    cleanup: () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      
      // Delete WebGL resources
      gl.deleteBuffer(cardGeometry.position);
      gl.deleteBuffer(cardGeometry.normal);
      gl.deleteBuffer(cardGeometry.texcoord);
      gl.deleteBuffer(cardGeometry.indices);
      gl.deleteTexture(albedoTexture);
      gl.deleteTexture(normalTexture);
      gl.deleteTexture(roughnessTexture);
      gl.deleteTexture(metalnessTexture);
      gl.deleteTexture(envMapTexture);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    }
  };
}

// Helper functions for WebGL setup
function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    console.error('Could not compile shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram();
  if (!program) return null;
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    console.error('Could not link program:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  
  return program;
}

function createCardGeometry(gl: WebGL2RenderingContext) {
  // Create a plane geometry (card shape)
  const aspect = 2.5 / 3.5; // Standard trading card aspect ratio
  const width = 1.0;
  const height = width / aspect;
  
  // Vertex positions (x, y, z)
  const positions = new Float32Array([
    -width/2, -height/2, 0,  // bottom left
    width/2, -height/2, 0,   // bottom right
    width/2, height/2, 0,    // top right
    -width/2, height/2, 0,   // top left
  ]);
  
  // Vertex normals
  const normals = new Float32Array([
    0, 0, 1,  // all normals point in z direction (front face)
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
  ]);
  
  // Texture coordinates
  const texcoords = new Float32Array([
    0, 1,  // bottom left
    1, 1,  // bottom right
    1, 0,  // top right
    0, 0,  // top left
  ]);
  
  // Indices for triangles
  const indices = new Uint16Array([
    0, 1, 2,  // first triangle
    0, 2, 3,  // second triangle
  ]);
  
  // Create buffers
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
  
  const texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);
  
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
  return {
    position: positionBuffer,
    normal: normalBuffer,
    texcoord: texcoordBuffer,
    indices: indexBuffer,
  };
}

function createDefaultTexture(gl: WebGL2RenderingContext, texture: WebGLTexture | null) {
  if (!texture) return;
  
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // Fill with white pixel
  const pixel = new Uint8Array([255, 255, 255, 255]);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
  
  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

// Matrix math helpers
function createPerspectiveMatrix(fov: number, aspect: number, near: number, far: number) {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
  const rangeInv = 1.0 / (near - far);
  
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ]);
}

function createViewMatrix() {
  // Simple view matrix - move back 3 units
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, -3, 1
  ]);
}

function createModelMatrix(rotationX: number, rotationY: number) {
  const cosX = Math.cos(rotationX);
  const sinX = Math.sin(rotationX);
  const cosY = Math.cos(rotationY);
  const sinY = Math.sin(rotationY);
  
  // Rotation around X axis
  const rotX = new Float32Array([
    1, 0, 0, 0,
    0, cosX, sinX, 0,
    0, -sinX, cosX, 0,
    0, 0, 0, 1
  ]);
  
  // Rotation around Y axis
  const rotY = new Float32Array([
    cosY, 0, -sinY, 0,
    0, 1, 0, 0,
    sinY, 0, cosY, 0,
    0, 0, 0, 1
  ]);
  
  // Combine rotations (rotY * rotX)
  return new Float32Array([
    rotY[0] * rotX[0] + rotY[4] * rotX[1] + rotY[8] * rotX[2] + rotY[12] * rotX[3],
    rotY[1] * rotX[0] + rotY[5] * rotX[1] + rotY[9] * rotX[2] + rotY[13] * rotX[3],
    rotY[2] * rotX[0] + rotY[6] * rotX[1] + rotY[10] * rotX[2] + rotY[14] * rotX[3],
    rotY[3] * rotX[0] + rotY[7] * rotX[1] + rotY[11] * rotX[2] + rotY[15] * rotX[3],
    
    rotY[0] * rotX[4] + rotY[4] * rotX[5] + rotY[8] * rotX[6] + rotY[12] * rotX[7],
    rotY[1] * rotX[4] + rotY[5] * rotX[5] + rotY[9] * rotX[6] + rotY[13] * rotX[7],
    rotY[2] * rotX[4] + rotY[6] * rotX[5] + rotY[10] * rotX[6] + rotY[14] * rotX[7],
    rotY[3] * rotX[4] + rotY[7] * rotX[5] + rotY[11] * rotX[6] + rotY[15] * rotX[7],
    
    rotY[0] * rotX[8] + rotY[4] * rotX[9] + rotY[8] * rotX[10] + rotY[12] * rotX[11],
    rotY[1] * rotX[8] + rotY[5] * rotX[9] + rotY[9] * rotX[10] + rotY[13] * rotX[11],
    rotY[2] * rotX[8] + rotY[6] * rotX[9] + rotY[10] * rotX[10] + rotY[14] * rotX[11],
    rotY[3] * rotX[8] + rotY[7] * rotX[9] + rotY[11] * rotX[10] + rotY[15] * rotX[11],
    
    rotY[0] * rotX[12] + rotY[4] * rotX[13] + rotY[8] * rotX[14] + rotY[12] * rotX[15],
    rotY[1] * rotX[12] + rotY[5] * rotX[13] + rotY[9] * rotX[14] + rotY[13] * rotX[15],
    rotY[2] * rotX[12] + rotY[6] * rotX[13] + rotY[10] * rotX[14] + rotY[14] * rotX[15],
    rotY[3] * rotX[12] + rotY[7] * rotX[13] + rotY[11] * rotX[14] + rotY[15] * rotX[15]
  ]);
}
