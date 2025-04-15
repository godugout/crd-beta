
import React from 'react';
import { Card } from '@/lib/types';
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
  card: Card;
  isVisible: boolean;
  renderingStats: RenderingStats;
}

const CardDiagnostics: React.FC<CardDiagnosticsProps> = ({ 
  card, 
  isVisible, 
  renderingStats 
}) => {
  if (!isVisible) return null;
  
  return (
    <Html position={[-2, 0, 0]} transform>
      <div style={{
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        width: '300px',
        maxHeight: '400px',
        overflowY: 'auto',
        fontFamily: 'monospace'
      }}>
        <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #555' }}>Card Diagnostics</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <div>Card ID: {card.id}</div>
          <div>Title: {card.title || 'Untitled'}</div>
          <div>Image: {card.imageUrl ? '✓' : '✗'}</div>
          <div>Effects: {renderingStats.effectsApplied.join(', ') || 'None'}</div>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <div>Textures Loaded: {renderingStats.imageLoaded ? '✓' : '✗'}</div>
          <div>Textures Applied: {renderingStats.textureApplied ? '✓' : '✗'}</div>
          <div>Render Time: {renderingStats.renderTime.toFixed(2)} ms</div>
          {renderingStats.meshCount !== undefined && (
            <div>Mesh Count: {renderingStats.meshCount}</div>
          )}
        </div>

        {renderingStats.transformations && renderingStats.transformations.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <h4 style={{ margin: '5px 0', borderBottom: '1px solid #555' }}>Recent Transformations</h4>
            <div style={{ fontSize: '10px', maxHeight: '100px', overflowY: 'auto' }}>
              {renderingStats.transformations.map((transform, index) => (
                <div key={index} style={{ marginBottom: '2px' }}>{transform}</div>
              ))}
            </div>
          </div>
        )}
        
        {renderingStats.errors.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <h4 style={{ margin: '5px 0', color: '#ff6b6b' }}>Errors</h4>
            <ul style={{ margin: '0', paddingLeft: '15px' }}>
              {renderingStats.errors.map((error, index) => (
                <li key={index} style={{ color: '#ff6b6b' }}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {renderingStats.warnings.length > 0 && (
          <div>
            <h4 style={{ margin: '5px 0', color: '#ffd166' }}>Warnings</h4>
            <ul style={{ margin: '0', paddingLeft: '15px' }}>
              {renderingStats.warnings.map((warning, index) => (
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
