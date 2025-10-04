
export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'long';

export type HairLength = 'short' | 'medium' | 'long';

export type AppState = 'initial' | 'image-selected' | 'generating' | 'results' | 'error';

export interface HairstyleLook {
  id: string;
  imageUrl: string;
  label: string;
  note: string;
  alt: string;
}
