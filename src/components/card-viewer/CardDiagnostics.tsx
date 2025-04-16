
import React from 'react';
import { Html } from '@react-three/drei';

interface RenderingStats {
  imageLoaded: boolean;
  textureApplied: boolean;
  effectsApplied: string[];
  errors: string[];
  warnings: string[];
  renderTime: number;
  meshCount?: number;
  transformations?: string[];
}

interface CardDiagnosticsProps {
  stats: RenderingStats;
  position: [number, number, number]; // Properly typed as a tuple for Vector3
}

const CardDiagnostics: React.FC<CardDiagnosticsProps> = ({ 
  stats,
  position
}) => {
  return (
    <Html position={position} transform>
      <div style={{
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        width: '300px',
        maxHeight: '400px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        position: 'relative',
        bottom: '10px',
        left: '10px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #555' }}>Card Diagnostics</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <div>Image Loaded: {stats.imageLoaded ? '✓' : '✗'}</div>
          <div>Effects: {stats.effectsApplied.join(', ') || 'None'}</div>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <div>Textures Loaded: {stats.imageLoaded ? '✓' : '✗'}</div>
          <div>Textures Applied: {stats.textureApplied ? '✓' : '✗'}</div>
          <div>Render Time: {stats.renderTime.toFixed(2)} ms</div>
          {stats.meshCount !== undefined && (
            <div>Mesh Count: {stats.meshCount}</div>
          )}
        </div>

        {stats.transformations && stats.transformations.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <h4 style={{ margin: '5px 0', borderBottom: '1px solid #555' }}>Recent Transformations</h4>
            <div style={{ fontSize: '10px', maxHeight: '100px', overflowY: 'auto' }}>
              {stats.transformations.map((transform, index) => (
                <div key={index} style={{ marginBottom: '2px' }}>{transform}</div>
              ))}
            </div>
          </div>
        )}
        
        {stats.errors.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <h4 style={{ margin: '5px 0', color: '#ff6b6b' }}>Errors</h4>
            <ul style={{ margin: '0', paddingLeft: '15px' }}>
              {stats.errors.map((error, index) => (
                <li key={index} style={{ color: '#ff6b6b' }}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {stats.warnings.length > 0 && (
          <div>
            <h4 style={{ margin: '5px 0', color: '#ffd166' }}>Warnings</h4>
            <ul style={{ margin: '0', paddingLeft: '15px' }}>
              {stats.warnings.map((warning, index) => (
                <li key={index} style={{ color: '#ffd166' }}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div style={{ marginTop: '10px', fontSize: '10px', opacity: 0.7 }}>
          Press 'D' to toggle diagnostics
        </div>
      </div>
    </Html>
  );
};

export default CardDiagnostics;
