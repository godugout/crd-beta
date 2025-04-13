
import { Upload, Palette, Sparkles, Type, Eye } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface WizardStep {
  name: string;
  icon: LucideIcon;
  path: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  { name: 'Upload', icon: Upload, path: 'upload' },
  { name: 'Design', icon: Palette, path: 'design' },
  { name: 'Effects', icon: Sparkles, path: 'effects' },
  { name: 'Text', icon: Type, path: 'text' },
  { name: 'Preview', icon: Eye, path: 'preview' },
];

export const INITIAL_CARD_STATE = {
  title: '',
  description: '',
  tags: [],
  borderColor: '#000000',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  imageUrl: null,
};
