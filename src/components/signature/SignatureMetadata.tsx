
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface SignatureMetadataProps {
  timestamp: number;
  signatureHash: string;
  points: number;
  strokes: number;
  duration: number;
}

const SignatureMetadata: React.FC<SignatureMetadataProps> = ({
  timestamp,
  signatureHash,
  points,
  strokes,
  duration
}) => {
  if (!signatureHash) {
    return null;
  }
  
  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
      <h3 className="font-medium text-gray-700 mb-2">Signature Metadata</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-gray-500 text-xs">Timestamp</p>
          <p className="font-mono text-xs">{new Date(timestamp).toISOString()}</p>
          <p className="text-xs text-gray-400">({formatDistanceToNow(timestamp, { addSuffix: true })})</p>
        </div>
        
        <div>
          <p className="text-gray-500 text-xs">Signature Hash</p>
          <p className="font-mono text-xs truncate">{signatureHash}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-3">
        <div>
          <p className="text-gray-500 text-xs">Points</p>
          <p className="font-mono">{points}</p>
        </div>
        
        <div>
          <p className="text-gray-500 text-xs">Strokes</p>
          <p className="font-mono">{strokes}</p>
        </div>
        
        <div>
          <p className="text-gray-500 text-xs">Duration</p>
          <p className="font-mono">{(duration / 1000).toFixed(2)}s</p>
        </div>
      </div>
    </div>
  );
};

export default SignatureMetadata;
