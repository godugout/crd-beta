
import React from 'react';
import { DetectedCard } from '../types';

interface ComparisonTabProps {
  detectedCards: DetectedCard[];
  manualTraces: DetectedCard[];
}

const ComparisonTab: React.FC<ComparisonTabProps> = ({ detectedCards, manualTraces }) => {
  if (detectedCards.length === 0 || manualTraces.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Manual Traces ({manualTraces.length}):</h3>
        <pre className="text-xs bg-neutral-100 p-4 rounded-md overflow-x-auto h-60">
          {JSON.stringify(manualTraces, null, 2)}
        </pre>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Detected Cards ({detectedCards.length}):</h3>
        <pre className="text-xs bg-neutral-100 p-4 rounded-md overflow-x-auto h-60">
          {JSON.stringify(detectedCards, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ComparisonTab;
