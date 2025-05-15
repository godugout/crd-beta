
import { Card } from "@/lib/types/cardTypes";

export interface CardViewerProps {
  card: Card;
  fullscreen?: boolean;
  onFullscreenToggle?: () => void;
  onShare?: () => void;
  onCapture?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
}
