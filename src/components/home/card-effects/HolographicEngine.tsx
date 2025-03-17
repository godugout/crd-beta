
import React, { useEffect, useRef, useState } from 'react';
import { useCardEffects } from '../card-viewer/useCardEffects';

interface HolographicEngineProps {
  active: boolean;
  intensity?: number;
  colorMode?: 'rainbow' | 'gold' | 'blue' | 'custom';
  customColor?: string;
  animated?: boolean;
  microtext?: string;
  particleCount?: number;
}

const HolographicEngine: React.FC<HolographicEngineProps> = ({
  active,
  intensity = 1.0,
  colorMode = 'rainbow',
  customColor,
  animated = true,
  microtext = '',
  particleCount = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const particlesRef = useRef<HTMLCanvasElement>(null);
  const microtextRef = useRef<HTMLCanvasElement>(null);
  const [isSupported, setIsSupported] = useState(true);
  
  // Use device orientation if available
  useEffect(() => {
    if (!active) return;
    
    // Check if DeviceOrientationEvent is supported
    const isDeviceOrientationSupported = 'DeviceOrientationEvent' in window;
    
    if (isDeviceOrientationSupported) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
          setDeviceOrientation({
            alpha: event.alpha, // Z-axis rotation [0, 360)
            beta: event.beta,   // X-axis rotation [-180, 180)
            gamma: event.gamma  // Y-axis rotation [-90, 90)
          });
        }
      };
      
      window.addEventListener('deviceorientation', handleOrientation, true);
      
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      };
    }
  }, [active]);
  
  // Initialize WebGL holographic effect with spectral diffraction
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    
    if (!gl) {
      console.warn('WebGL not supported for holographic effect');
      setIsSupported(false);
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
    
    // Vertex shader with 3D transformation for parallax effects
    gl.shaderSource(vertexShader, `
      attribute vec2 position;
      varying vec2 vUv;
      
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `);
    
    // Fragment shader with spectral diffraction patterns using Signed Distance Fields
    const colorValues = (() => {
      switch (colorMode) {
        case 'gold':
          return `vec3 color1 = vec3(1.0, 0.85, 0.1); 
                  vec3 color2 = vec3(0.9, 0.7, 0.25);`;
        case 'blue':
          return `vec3 color1 = vec3(0.0, 0.5, 1.0); 
                  vec3 color2 = vec3(0.4, 0.7, 1.0);`;
        case 'custom':
          // Parse custom color if provided
          if (customColor) {
            const hexToRgb = (hex: string) => {
              const r = parseInt(hex.slice(1, 3), 16) / 255;
              const g = parseInt(hex.slice(3, 5), 16) / 255;
              const b = parseInt(hex.slice(5, 7), 16) / 255;
              return [r, g, b];
            };
            
            const [r, g, b] = customColor ? hexToRgb(customColor) : [1, 1, 1];
            return `vec3 color1 = vec3(${r}, ${g}, ${b}); 
                    vec3 color2 = vec3(${r * 0.8}, ${g * 0.8}, ${b * 0.8});`;
          }
          // Fall through to rainbow if no custom color
        default: // rainbow
          return `vec3 color1 = vec3(1.0, 0.0, 0.5); 
                  vec3 color2 = vec3(0.0, 0.7, 1.0);`;
      }
    })();
    
    gl.shaderSource(fragmentShader, `
      precision mediump float;
      varying vec2 vUv;
      uniform float time;
      uniform float intensity;
      uniform vec2 resolution;
      uniform vec2 mousePosition;
      
      // Colors based on mode
      ${colorValues}
      
      // Signed Distance Field functions for micropatterns and etched microtext
      float sdCircle(vec2 p, float r) {
        return length(p) - r;
      }
      
      float sdHexagon(vec2 p, float r) {
        const vec3 k = vec3(-0.866025404, 0.5, 0.577350269);
        p = abs(p);
        p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
        p -= vec2(clamp(p.x, -k.z * r, k.z * r), r);
        return length(p) * sign(p.y);
      }
      
      float sdRhombus(vec2 p, vec2 b) {
        p = abs(p);
        float h = clamp((-2.0 * b.x * b.y + 2.0 * p.x * p.y) / (b.x * b.x + b.y * b.y), 0.0, 1.0);
        float d = length(p - 0.5 * h * vec2(b.y, b.x) / dot(b, b) * vec2(b.x, -b.y));
        return d * sign(p.x * b.y - p.y * b.x);
      }
      
      void main() {
        // Normalized coordinates
        vec2 uv = vUv;
        vec2 center = vec2(0.5);
        
        // Create spectral diffraction pattern based on distance and angle
        float dist = distance(uv, center) * 2.0;
        float angle = atan(uv.y - center.y, uv.x - center.x);
        
        // Dynamic light source tracking using mouse or device orientation
        vec2 offset = mousePosition * 0.1;
        float mouseDist = length(offset);
        float moveFactor = mouseDist * 5.0 * intensity;
        
        // Create dynamic holographic pattern
        float pattern = 0.0;
        
        // Diffraction grating effect - creates rainbow patterns
        float lines = sin((uv.x + uv.y) * 50.0 + time + angle * 3.0) * 0.5 + 0.5;
        float circles = smoothstep(0.3, 0.4, sin(dist * 15.0 - time) * 0.5 + 0.5);
        
        // Add micro-patterns using Signed Distance Fields
        float scale = 80.0;
        vec2 id = floor(uv * scale);
        vec2 grid = fract(uv * scale) - 0.5;
        
        float micro = 0.0;
        
        // Create varied micropatterns using SDF
        if (mod(id.x + id.y, 3.0) < 1.0) {
          micro = smoothstep(0.1, 0.0, sdCircle(grid, 0.2));
        } else if (mod(id.x + id.y, 3.0) < 2.0) {
          micro = smoothstep(0.1, 0.0, sdHexagon(grid, 0.2));
        } else {
          micro = smoothstep(0.1, 0.0, sdRhombus(grid, vec2(0.2, 0.3)));
        }
        
        // Add spectral splitting with parallax effect
        float rainbow = sin(dist * 15.0 - angle * 2.0 + time * 0.5) * 0.5 + 0.5;
        
        // Create dynamic light refraction based on viewing angle
        float refraction = sin(angle * 5.0 + dist * 10.0 + time * 0.2) * 0.5 + 0.5;
        
        // Combine patterns with micropatterns
        pattern = mix(lines, circles, 0.5) + micro * 0.2 + refraction * 0.1;
        
        // Calculate holographic colors with spectral separation
        vec3 baseColor = mix(color1, color2, rainbow);
        float edgeGlow = smoothstep(0.8, 1.0, dist) * intensity;
        
        // Apply spectral shifts based on viewing angle (mouse position or device)
        float rShift = offset.x * 0.03 * intensity;
        float gShift = offset.y * 0.01 * intensity;
        float bShift = -offset.x * 0.03 * intensity;
        
        // Calculate RGB channels with chromatic aberration
        float r = pattern + rShift;
        float g = pattern + gShift;
        float b = pattern + bShift;
        
        // Edge highlighting with spectral split
        vec3 finalColor = vec3(
          mix(baseColor.r * r, 1.0, edgeGlow * 0.7),
          mix(baseColor.g * g, 1.0, edgeGlow * 0.5),
          mix(baseColor.b * b, 1.0, edgeGlow * 0.9)
        );
        
        // Dynamic light response - makes brighter areas respond more to movement
        float lightResponse = smoothstep(0.4, 0.6, pattern);
        finalColor += vec3(0.1, 0.1, 0.2) * lightResponse * moveFactor;
        
        // Enhance specular highlights
        float specular = pow(pattern, 3.0) * intensity;
        finalColor += specular * vec3(1.0, 1.0, 1.0);
        
        // Final output with adjusted opacity based on pattern
        gl_FragColor = vec4(finalColor, 0.2 + pattern * 0.6 * intensity);
      }
    `);
    
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    
    // Check for shader compilation errors
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
      return;
    }
    
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
      return;
    }
    
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
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const mousePositionLocation = gl.getUniformLocation(program, 'mousePosition');
    
    // Track mouse position for dynamic light source tracking
    let mousePosition = { x: 0, y: 0 };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Map to -1 to 1 range
      mousePosition = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: (1 - (e.clientY - rect.top) / rect.height) * 2 - 1
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
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
      
      if (resolutionLocation) {
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      }
      
      // Use device orientation if available, otherwise use mouse
      if (deviceOrientation.beta !== 0 || deviceOrientation.gamma !== 0) {
        // Map device orientation to screen coordinates
        const orientationX = deviceOrientation.gamma / 45; // -1 to 1 range
        const orientationY = deviceOrientation.beta / 90;  // -1 to 1 range
        gl.uniform2f(mousePositionLocation, orientationX, orientationY);
      } else {
        gl.uniform2f(mousePositionLocation, mousePosition.x, mousePosition.y);
      }
      
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
      
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [active, intensity, colorMode, customColor, animated, deviceOrientation]);
  
  // Particle system for "stardust" sparkle effects
  useEffect(() => {
    if (!active || !particlesRef.current || particleCount <= 0) return;
    
    const canvas = particlesRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size
    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    // Advanced particle class with lifecycle
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      life: number;
      maxLife: number;
      color: string;
      glow: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = 0;
        this.life = 0;
        this.maxLife = Math.random() * 150 + 50;
        
        // Dynamic colors for particles
        const hue = Math.random() * 60 + (colorMode === 'gold' ? 40 : 
                                        colorMode === 'blue' ? 220 : 
                                        Math.random() * 360);
        this.color = `hsla(${hue}, 100%, 70%, 1)`;
        this.glow = Math.random() * 5 + 2;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Particle lifecycle
        this.life++;
        if (this.life < 20) {
          this.opacity = this.life / 20;
        } else if (this.life > this.maxLife - 20) {
          this.opacity = (this.maxLife - this.life) / 20;
        } else {
          this.opacity = 1;
          
          // Add some random flicker
          if (Math.random() > 0.9) {
            this.opacity = Math.random() * 0.5 + 0.5;
          }
        }
        
        // Reset if out of bounds or end of life
        if (
          this.x < 0 || 
          this.x > canvas.width || 
          this.y < 0 || 
          this.y > canvas.height ||
          this.life >= this.maxLife
        ) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.life = 0;
        }
      }
      
      draw() {
        // Create a glowing effect
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * this.glow
        );
        
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.glow, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        // Draw the core
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8 * intensity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }
    
    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    let animationFrame: number;
    
    const animate = () => {
      if (!animated) {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw all particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      resizeObserver.disconnect();
    };
  }, [active, particleCount, intensity, animated, colorMode]);
  
  // Microtext generation using Canvas for etched text
  useEffect(() => {
    if (!active || !microtextRef.current || !microtext) return;
    
    const canvas = microtextRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size
    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        drawMicrotext();
      }
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    // Function to draw microtext
    const drawMicrotext = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set very small font for microtext
      const fontSize = 5;
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.2 * intensity})`;
      
      // Create a pattern of repeating text
      const text = microtext || 'AUTHENTIC HOLOGRAM ';
      const textWidth = ctx.measureText(text).width;
      
      // Draw text in a grid pattern
      for (let y = 0; y < canvas.height; y += fontSize * 1.5) {
        // Offset each row slightly for a more organic look
        const offset = (y / fontSize) % 2 === 0 ? 0 : textWidth / 2;
        
        for (let x = -offset; x < canvas.width; x += textWidth) {
          ctx.fillText(text, x, y);
        }
      }
      
      // Add a subtle wave effect
      ctx.fillStyle = `rgba(255, 255, 255, ${0.05 * intensity})`;
      ctx.font = `${fontSize * 0.8}px monospace`;
      
      for (let y = fontSize * 0.75; y < canvas.height; y += fontSize * 1.5) {
        const waveOffset = Math.sin(y * 0.1) * 10;
        
        for (let x = waveOffset; x < canvas.width; x += textWidth) {
          ctx.fillText(text.split('').reverse().join(''), x, y);
        }
      }
    };
    
    drawMicrotext();
    
    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [active, microtext, intensity]);
  
  // Skip rendering if not active or not supported
  if (!active || !isSupported) return null;
  
  return (
    <>
      {/* Main holographic diffraction effect */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ 
          mixBlendMode: 'screen',
          opacity: 0.8
        }}
      />
      
      {/* Microtext overlay */}
      {microtext && (
        <canvas 
          ref={microtextRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-15"
          style={{ 
            mixBlendMode: 'overlay',
            opacity: 0.5,
            transform: 'rotate(45deg)',
          }}
        />
      )}
      
      {/* Particle system overlay */}
      {particleCount > 0 && (
        <canvas 
          ref={particlesRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          style={{ 
            mixBlendMode: 'screen',
            opacity: 0.7
          }}
        />
      )}
      
      {/* CSS 3D parallax layers for additional depth */}
      <div 
        className="absolute inset-0 pointer-events-none z-5 parallax-container"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div 
          className="absolute inset-0 z-1 parallax-layer"
          style={{
            transform: 'translateZ(-10px) scale(1.5)',
            backgroundImage: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, transparent 70%)',
            opacity: 0.5 * intensity,
          }}
        />
        
        <div 
          className="absolute inset-0 z-2 parallax-layer"
          style={{
            transform: 'translateZ(-5px) scale(1.2)',
            backgroundImage: 'linear-gradient(45deg, transparent 95%, rgba(255,255,255,0.3) 100%)',
            backgroundSize: '5px 5px',
            opacity: 0.3 * intensity,
          }}
        />
      </div>
    </>
  );
};

export default HolographicEngine;
