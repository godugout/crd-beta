
import { JsonValue } from './index';

export interface InstagramMediaChild {
  id: string;
  media_type: string;
  media_url: string;
}

// Extending JsonValue to include our InstagramMediaChild[] type
export interface ExtendedJsonValue extends JsonValue {
  children?: InstagramMediaChild[];
}

export interface InstagramPost {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  username: string;
  children?: InstagramMediaChild[]; // This is now compatible with our ExtendedJsonValue
  metadata?: ExtendedJsonValue; // Use our extended type that supports children
}
