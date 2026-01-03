
export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export type AIAction = 'summarize' | 'refine' | 'brainstorm' | 'translate' | 'shorter' | 'longer';

export interface AIResponse {
  text: string;
  error?: string;
}
