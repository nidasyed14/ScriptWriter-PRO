export interface ScriptRequest {
  topic: string;
  length: 'short' | 'medium' | 'long';
  tone: 'professional' | 'casual' | 'educational' | 'entertaining';
}

export interface GeneratedScript {
  title: string;
  intro: string;
  mainPoints: string[];
  outro: string;
  estimatedDuration: string;
  wordCount: number;
}

export interface ThumbnailRequest {
  topic: string;
  style: 'bold' | 'minimal' | 'dramatic' | 'colorful';
  textOverlay?: string;
}

export interface GeneratedThumbnail {
  url: string;
  alt: string;
  style: string;
}