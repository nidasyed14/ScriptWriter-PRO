export interface ScriptRequest {
  topic: string;
  length: 'short' | 'medium' | 'long';
  tone: 'professional' | 'casual' | 'educational' | 'entertaining';
  contentType: 'tutorial' | 'review' | 'story' | 'analysis' | 'interview';
  targetAudience: 'beginner' | 'intermediate' | 'advanced' | 'general';
}

export interface GeneratedScript {
  title: string;
  hook: string;
  intro: string;
  mainPoints: string[];
  keyTakeaways: string[];
  outro: string;
  callToAction: string;
  estimatedDuration: string;
  wordCount: number;
  seoKeywords: string[];
  timestamps: { time: string; section: string }[];
}

export interface ThumbnailRequest {
  topic: string;
  mood: 'energetic' | 'professional' | 'mysterious' | 'educational' | 'emotional' | 'trendy';
  colorScheme: 'vibrant' | 'monochrome' | 'pastel' | 'neon' | 'earth' | 'gradient';
  textOverlay?: string;
  includeEmoji?: boolean;
}

export interface GeneratedThumbnail {
  variations: {
    url: string;
    style: string;
    description: string;
  }[];
  alt: string;
  mood: string;
  colorScheme: string;
}