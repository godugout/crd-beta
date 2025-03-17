
import React, { useEffect, useRef } from 'react';
import { useCardEffects } from '../card-viewer/useCardEffects';

interface RefractorEffectProps {
  active: boolean;
  intensity?: number;
  color?: string;
  animated?: boolean;
}

const RefractorEffect: React.FC<RefractorEffectProps> = ({
  active,
  intensity = 1.0,
  color = 'rainbow',
  animated = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize WebGL effect
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    
    if (!gl) {
      console.warn('WebGL not supported for refractor effect');
      return;
    }
    
    // Set canvas size
    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    // Create WebGL program
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) return;
    
    // Simple vertex shader
    gl.shaderSource(vertexShader, `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `);
    
    // Fragment shader with prismatic effect
    gl.shaderSource(fragmentShader, `
      precision mediump float;
      varying vec2 vUv;
      uniform float time;
      uniform float intensity;
      
      void main() {
        // Calculate distance from center
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(vUv, center) * 2.0;
        
        // Create prismatic refraction
        float angle = atan(vUv.y - center.y, vUv.x - center.x);
        float offset = sin(angle * 6.0 + time) * 0.03 * intensity;
        
        // RGB color separation
        float r = smoothstep(0.0, 1.0, dist + offset);
        float g = smoothstep(0.0, 1.0, dist);
        float b = smoothstep(0.0, 1.0, dist - offset);
        
        // Edge highlight
        float edge = smoothstep(0.9, 1.0, dist) * intensity;
        
        // Final color with edge highlight
        gl_FragColor = vec4(
          mix(r * 0.2, 1.0, edge),
          mix(g * 0.2, 1.0, edge),
          mix(b * 0.4, 1.0, edge),
          0.3 * intensity
        );
      }
    `);
    
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    
    // Create program
    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    
    // Create a full-screen quad
    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1
    ]);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    // Setup position attribute
    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'time');
    const intensityLocation = gl.getUniformLocation(program, 'intensity');
    
    // Animation loop
    let animationFrame: number;
    let startTime = performance.now();
    
    const render = () => {
      if (!animated && animationFrame) {
        cancelAnimationFrame(animationFrame);
        return;
      }
      
      const time = (performance.now() - startTime) / 1000;
      
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      // Update uniforms
      gl.uniform1f(timeLocation, animated ? time : 0);
      gl.uniform1f(intensityLocation, intensity);
      
      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationFrame = requestAnimationFrame(render);
    };
    
    render();
    
    // Cleanup
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      resizeObserver.disconnect();
      
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [active, intensity, animated]);
  
  if (!active) return null;
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        mixBlendMode: 'screen',
        opacity: 0.7
      }}
    />
  );
};

export default RefractorEffect;
