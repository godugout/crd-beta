
import React, { useRef, useEffect, useState } from 'react';
import { useSignatureCanvas } from './hooks/useSignatureCanvas';
import { useInkEffects } from './hooks/useInkEffects';
import { useSignatureVerification } from './hooks/useSignatureVerification';
import SignatureControls from './SignatureControls';
import InkPressureVisualizer from './InkPressureVisualizer';
import SignatureMetadata from './SignatureMetadata';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Download } from 'lucide-react';

interface SignatureAnalyzerProps {
  onSave?: (signatureData: SignatureData) => void;
  initialSignature?: string;
  className?: string;
}

export interface SignatureData {
  svg: string;
  timestamp: number;
  signatureHash: string;
  pressureMap: number[];
  metadata: {
    points: number;
    strokes: number;
    duration: number;
    inkVolume: number;
  };
}

const SignatureAnalyzer: React.FC<SignatureAnalyzerProps> = ({
  onSave,
  initialSignature,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wasmModule = useRef<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inkAmount, setInkAmount] = useState(0.8);
  const [paperTexture, setPaperTexture] = useState('fine');
  const [inkColor, setInkColor] = useState('#000333');
  
  // Custom hooks for signature functionality
  const {
    isDrawing,
    points,
    strokes,
    clearSignature,
    pathData,
    duration,
    startDrawing,
    draw,
    endDrawing
  } = useSignatureCanvas(canvasRef);
  
  const {
    applyInkBleed,
    applyPaperTexture,
    applyInkGloss,
    generateSignatureImage
  } = useInkEffects(canvasRef, svgRef, wasmModule, inkAmount, paperTexture, inkColor);
  
  const {
    timestamp,
    verifySignature,
    generateSignatureHash,
    signatureHash
  } = useSignatureVerification();
  
  // Initialize WebAssembly module for ink bleed
  useEffect(() => {
    // Load WebAssembly module for ink bleed simulation
    const loadWasm = async () => {
      try {
        // In a real implementation, you would load a WebAssembly module
        // For now, we'll simulate with a placeholder object
        wasmModule.current = {
          calculateInkBleed: (points: number[], amount: number) => {
            // Simulate ink bleed calculations
            return points.map(p => p * (1 + Math.random() * amount * 0.5));
          }
        };
      } catch (error) {
        console.error("Failed to load WebAssembly module:", error);
      }
    };
    
    loadWasm();
  }, []);
  
  // Analyze the signature when drawing is complete
  useEffect(() => {
    if (!isDrawing && points.length > 0 && !isAnalyzing) {
      analyzeSignature();
    }
  }, [isDrawing, points.length]);
  
  const analyzeSignature = async () => {
    if (!canvasRef.current || points.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      // 1. Apply ink bleed effect using WebAssembly
      await applyInkBleed(points);
      
      // 2. Apply paper texture effect using SVG filters
      await applyPaperTexture();
      
      // 3. Apply ink gloss effect using WebGL
      await applyInkGloss();
      
      // 4. Generate signature hash using Web Crypto API
      await generateSignatureHash(points);
      
    } catch (error) {
      console.error("Error analyzing signature:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleSave = () => {
    if (!pathData || points.length === 0) return;
    
    const signatureData: SignatureData = {
      svg: svgRef.current?.outerHTML || '',
      timestamp,
      signatureHash,
      pressureMap: points.map(p => p.pressure || 0.5),
      metadata: {
        points: points.length,
        strokes,
        duration,
        inkVolume: inkAmount * points.length / 100
      }
    };
    
    if (onSave) {
      onSave(signatureData);
    }
  };
  
  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const image = generateSignatureImage();
    if (!image) return;
    
    const link = document.createElement('a');
    link.download = `signature-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = image;
    link.click();
  };
  
  return (
    <div className={`signature-analyzer ${className}`}>
      <div className="mb-4 bg-white rounded-lg shadow-md overflow-hidden">
        {/* SVG container for filters and effects */}
        <svg 
          ref={svgRef}
          className="absolute -z-10 opacity-0 pointer-events-none" 
          width="600" 
          height="200"
        >
          <defs>
            {/* Paper texture filter */}
            <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" seed="1" />
              <feDisplacementMap in="SourceGraphic" scale="5" />
            </filter>
            
            {/* Ink bleed filter */}
            <filter id="ink-bleed" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 18 -7"
                result="inkbleed"
              />
              <feComposite in="SourceGraphic" in2="inkbleed" operator="over" />
            </filter>
            
            {/* Ink gloss filter */}
            <filter id="ink-gloss" x="0%" y="0%" width="100%" height="100%">
              <feSpecularLighting result="specOut" specularExponent="20" lightingColor="#ffffff">
                <fePointLight x="200" y="100" z="50" />
              </feSpecularLighting>
              <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          </defs>
          
          {/* SVG path for signature */}
          <path 
            d={pathData || 'M0,0'} 
            fill="none" 
            stroke={inkColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ink-bleed) url(#paper-texture)"
          />
        </svg>
        
        {/* Canvas for drawing */}
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="border border-gray-200 w-full touch-none cursor-crosshair bg-gray-50"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startDrawing({
              nativeEvent: {
                offsetX: touch.clientX - e.currentTarget.getBoundingClientRect().left,
                offsetY: touch.clientY - e.currentTarget.getBoundingClientRect().top,
              },
            } as any);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            draw({
              nativeEvent: {
                offsetX: touch.clientX - e.currentTarget.getBoundingClientRect().left,
                offsetY: touch.clientY - e.currentTarget.getBoundingClientRect().top,
              },
            } as any);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            endDrawing();
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <SignatureControls 
            inkAmount={inkAmount}
            setInkAmount={setInkAmount}
            paperTexture={paperTexture}
            setPaperTexture={setPaperTexture}
            inkColor={inkColor}
            setInkColor={setInkColor}
          />
        </div>
        
        <div>
          <InkPressureVisualizer points={points} />
        </div>
      </div>
      
      <SignatureMetadata
        timestamp={timestamp}
        signatureHash={signatureHash}
        points={points.length}
        strokes={strokes}
        duration={duration}
      />
      
      <div className="flex mt-4 space-x-2">
        <Button
          variant="outline"
          onClick={clearSignature}
          disabled={isAnalyzing || points.length === 0}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear
        </Button>
        
        <Button
          onClick={handleDownload}
          disabled={isAnalyzing || points.length === 0}
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={isAnalyzing || points.length === 0}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Signature
        </Button>
      </div>
    </div>
  );
};

export default SignatureAnalyzer;
