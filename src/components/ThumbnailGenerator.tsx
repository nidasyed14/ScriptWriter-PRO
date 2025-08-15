import React, { useState } from 'react';
import { GeneratedThumbnail, ThumbnailRequest } from '../types';
import { Download, Image, Palette, Sparkles, Eye, Heart, Zap, BookOpen, Lock, TrendingUp } from 'lucide-react';
import { AIService } from '../services/ai';

interface ThumbnailGeneratorProps {
  topic: string;
}

export const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({ topic }) => {
  const [thumbnail, setThumbnail] = useState<GeneratedThumbnail | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMood, setSelectedMood] = useState<ThumbnailRequest['mood']>('energetic');
  const [selectedColorScheme, setSelectedColorScheme] = useState<ThumbnailRequest['colorScheme']>('vibrant');
  const [includeEmoji, setIncludeEmoji] = useState(true);

  const moodOptions = [
    { value: 'energetic', label: 'Energetic', icon: Zap, description: 'High energy, dynamic, exciting' },
    { value: 'professional', label: 'Professional', icon: BookOpen, description: 'Clean, corporate, trustworthy' },
    { value: 'mysterious', label: 'Mysterious', icon: Lock, description: 'Dark, intriguing, suspenseful' },
    { value: 'educational', label: 'Educational', icon: Eye, description: 'Clear, informative, approachable' },
    { value: 'emotional', label: 'Emotional', icon: Heart, description: 'Warm, personal, touching' },
    { value: 'trendy', label: 'Trendy', icon: TrendingUp, description: 'Modern, stylish, current' }
  ] as const;

  const colorSchemeOptions = [
    { value: 'vibrant', label: 'Vibrant', description: 'Bright, saturated colors' },
    { value: 'monochrome', label: 'Monochrome', description: 'Black, white, and grays' },
    { value: 'pastel', label: 'Pastel', description: 'Soft, muted colors' },
    { value: 'neon', label: 'Neon', description: 'Electric, glowing colors' },
    { value: 'earth', label: 'Earth Tones', description: 'Natural, organic colors' },
    { value: 'gradient', label: 'Gradient', description: 'Smooth color transitions' }
  ] as const;

  const generateThumbnail = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    try {
      const request: ThumbnailRequest = {
        topic,
        mood: selectedMood,
        colorScheme: selectedColorScheme,
        textOverlay: topic,
        includeEmoji
      };
      
      const result = await AIService.generateThumbnail(request);
      setThumbnail(result);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadThumbnail = () => {
    if (!thumbnail || !thumbnail.variations.length) return;
    
    // Download all thumbnail variations as a zip file (simulated)
    thumbnail.variations.forEach((variation, index) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create different backgrounds based on mood and color scheme
        const moodColors = {
          energetic: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
          professional: ['#2C3E50', '#3498DB', '#E74C3C'],
          mysterious: ['#2C2C54', '#40407A', '#706FD3'],
          educational: ['#3742FA', '#2ED573', '#FF6348'],
          emotional: ['#FF6B9D', '#C44569', '#F8B500'],
          trendy: ['#00D2FF', '#3A47D5', '#FF0080']
        };
        
        const colors = moodColors[selectedMood];
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.5, colors[1]);
        gradient.addColorStop(1, colors[2]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text with different styles based on variation
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.font = `bold ${60 + index * 10}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const text = includeEmoji ? `${topic} 🔥` : topic;
        const lines = text.split(' ');
        let y = canvas.height / 2;
        
        if (lines.length > 4) {
          const line1 = lines.slice(0, Math.ceil(lines.length / 2)).join(' ');
          const line2 = lines.slice(Math.ceil(lines.length / 2)).join(' ');
          
          ctx.strokeText(line1, canvas.width / 2, y - 50);
          ctx.fillText(line1, canvas.width / 2, y - 50);
          ctx.strokeText(line2, canvas.width / 2, y + 50);
          ctx.fillText(line2, canvas.width / 2, y + 50);
        } else {
          ctx.strokeText(text, canvas.width / 2, y);
          ctx.fillText(text, canvas.width / 2, y);
        }
        
        // Download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_thumbnail_${index + 1}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <Image className="w-6 h-6" />
          <h2 className="text-2xl font-bold">AI Thumbnail Generator</h2>
        </div>
        <p className="text-orange-100">Generate multiple mood-based thumbnail variations that drive clicks</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Choose Thumbnail Mood
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {moodOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="thumbnailMood"
                    value={option.value}
                    checked={selectedMood === option.value}
                    onChange={(e) => setSelectedMood(e.target.value as ThumbnailRequest['mood'])}
                    className="sr-only"
                    disabled={isGenerating}
                  />
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    selectedMood === option.value 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon className="w-4 h-4 text-orange-600" />
                      <div className="font-medium text-gray-900">{option.label}</div>
                    </div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Color Scheme Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Color Scheme
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {colorSchemeOptions.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="colorScheme"
                  value={option.value}
                  checked={selectedColorScheme === option.value}
                  onChange={(e) => setSelectedColorScheme(e.target.value as ThumbnailRequest['colorScheme'])}
                  className="sr-only"
                  disabled={isGenerating}
                />
                <div className={`p-4 border-2 rounded-lg transition-all ${
                  selectedColorScheme === option.value 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <Palette className="w-4 h-4 text-orange-600" />
                    <div className="font-medium text-gray-900">{option.label}</div>
                  </div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeEmoji}
              onChange={(e) => setIncludeEmoji(e.target.checked)}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              disabled={isGenerating}
            />
            <span className="text-sm text-gray-700">Include emojis in thumbnails</span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateThumbnail}
          disabled={!topic.trim() || isGenerating}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-pink-700 transition-all duration-200"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating Thumbnail...
            </div>
          ) : (
            'Generate 4 Thumbnail Variations'
          )}
        </button>

        {/* Thumbnail Preview */}
        {thumbnail && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="mb-6 text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Generated Thumbnail Variations</h4>
              <div className="flex justify-center space-x-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {thumbnail.mood} mood
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {thumbnail.colorScheme} colors
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {thumbnail.variations.map((variation, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={variation.url} 
                    alt={`${thumbnail.alt} - Variation ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h5 className="font-medium text-gray-900 mb-1">{variation.style}</h5>
                    <p className="text-sm text-gray-600">{variation.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={downloadThumbnail}
                className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Download className="w-4 h-4" />
                <span>Download All Variations</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};