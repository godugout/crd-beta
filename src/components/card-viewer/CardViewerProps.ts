
import { CardData } from "@/types/card";

export interface CardViewerProps {
  card: CardData;
  fullscreen?: boolean;
  onFullscreenToggle?: () => void;
  onShare?: () => void;
  onCapture?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
}
