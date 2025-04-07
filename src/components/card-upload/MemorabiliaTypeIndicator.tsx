
import React from 'react';
import { 
  Ticket, 
  FileText, 
  User, 
  PenTool, 
  CreditCard, 
  HelpCircle 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MemorabiliaType } from './cardDetection';

interface MemorabiliaTypeIndicatorProps {
  type: MemorabiliaType;
  confidence: number;
  className?: string;
}

const MemorabiliaTypeIndicator: React.FC<MemorabiliaTypeIndicatorProps> = ({ 
  type, 
  confidence,
  className 
}) => {
  
  // Get icon based on memorabilia type
  const getIcon = () => {
    switch (type) {
      case 'ticket':
        return <Ticket className="mr-1 h-3 w-3" />;
      case 'program':
        return <FileText className="mr-1 h-3 w-3" />;
      case 'face':
        return <User className="mr-1 h-3 w-3" />;
      case 'autograph':
        return <PenTool className="mr-1 h-3 w-3" />;
      case 'card':
        return <CreditCard className="mr-1 h-3 w-3" />;
      default:
        return <HelpCircle className="mr-1 h-3 w-3" />;
    }
  };
  
  // Get display name
  const getTypeName = () => {
    switch (type) {
      case 'ticket':
        return 'Ticket stub';
      case 'program':
        return 'Program/scorecard';
      case 'face':
        return 'Person';
      case 'autograph':
        return 'Autographed item';
      case 'card':
        return 'Baseball card';
      default:
        return 'Unknown';
    }
  };

  // Get confidence level description
  const getConfidenceText = () => {
    if (confidence > 0.9) return 'High confidence';
    if (confidence > 0.7) return 'Medium confidence';
    return 'Low confidence';
  };

  // Badge variant based on confidence
  const getBadgeVariant = () => {
    if (confidence > 0.9) return "default"; 
    if (confidence > 0.7) return "secondary";
    return "outline";
  };

  return (
    <div className={`flex items-center ${className || ''}`}>
      <Badge 
        variant={getBadgeVariant()} 
        className="flex items-center text-xs px-2 mr-2"
      >
        {getIcon()}
        <span>{getTypeName()}</span>
      </Badge>
      <span className="text-xs text-gray-500">
        {getConfidenceText()} ({Math.round(confidence * 100)}%)
      </span>
    </div>
  );
};

export default MemorabiliaTypeIndicator;
