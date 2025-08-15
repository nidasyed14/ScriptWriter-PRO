import React, { useState } from 'react';
import { GeneratedThumbnail, ThumbnailRequest } from '../types';
import { Download, Image, Palette } from 'lucide-react';
import { AIService } from '../services/ai';

interface ThumbnailGeneratorProps {
  topic: string;
}

export const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({ topic }) => {
  const [thumbnail, setThumbnail] = useState<GeneratedThumbnail | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<ThumbnailRequest['style']>('bold');

  const styleOptions = [
    { value: 'bold', label: 'Bold & Vibrant', description: 'High contrast with bright colors' },
    { value: 'minimal', label: 'Clean & Minimal', description: 'Simple design with lots of white space' },
    { value: 'dramatic', label: 'Dramatic', description: 'Dark background with striking elements' },
    { value: 'colorful', label: 'Colorful', description: 'Multiple bright colors and gradients' }
  ] as const;

  const generateThumbnail = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    try {
      const request: ThumbnailRequest = {
        topic,
        style: selectedStyle,
        textOverlay: topic
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
    if (!thumbnail) return;
    
    // In a real app, you'd download the actual image
    // For this demo, we'll create a canvas and download a placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#8B5CF6');
      gradient.addColorStop(1, '#3B82F6');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 72px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const lines = topic.split(' ');
      const maxWidth = canvas.width - 100;
      let y = canvas.height / 2;
      
      if (lines.length > 5) {
        // Split into multiple lines
        const line1 = lines.slice(0, Math.ceil(lines.length / 2)).join(' ');
        const line2 = lines.slice(Math.ceil(lines.length / 2)).join(' ');
        
        ctx.fillText(line1, canvas.width / 2, y - 40);
        ctx.fillText(line2, canvas.width / 2, y + 40);
      } else {
        ctx.fillText(topic, canvas.width / 2, y);
      }
      
      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_thumbnail.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <Image className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Thumbnail Generator</h2>
        </div>
        <p className="text-orange-100">Create eye-catching thumbnails for your content</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Style Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Choose Thumbnail Style
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {styleOptions.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="thumbnailStyle"
                  value={option.value}
                  checked={selectedStyle === option.value}
                  onChange={(e) => setSelectedStyle(e.target.value as ThumbnailRequest['style'])}
                  className="sr-only"
                  disabled={isGenerating}
                />
                <div className={`p-4 border-2 rounded-lg transition-all ${
                  selectedStyle === option.value 
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
            'Generate Thumbnail'
          )}
        </button>

        {/* Thumbnail Preview */}
        {thumbnail && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src={thumbnail.url} 
                  alt={thumbnail.alt}
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {thumbnail.style} style
                </span>
              </div>
              <button
                onClick={downloadThumbnail}
                className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-pink-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Download className="w-4 h-4" />
                <span>Download Thumbnail</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};