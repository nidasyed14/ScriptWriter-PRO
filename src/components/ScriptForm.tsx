import React, { useState } from 'react';
import { ScriptRequest } from '../types';
import { Play, Zap, BookOpen, Smile } from 'lucide-react';

interface ScriptFormProps {
  onGenerate: (request: ScriptRequest) => void;
  isLoading: boolean;
}

export const ScriptForm: React.FC<ScriptFormProps> = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = useState<ScriptRequest>({
    topic: '',
    length: 'medium',
    tone: 'professional'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.topic.trim()) {
      onGenerate(formData);
    }
  };

  const lengthOptions = [
    { value: 'short', label: 'Short (2-3 min)', description: '~300 words' },
    { value: 'medium', label: 'Medium (5-7 min)', description: '~800 words' },
    { value: 'long', label: 'Long (10-12 min)', description: '~1500 words' }
  ] as const;

  const toneOptions = [
    { value: 'professional', label: 'Professional', icon: BookOpen, description: 'Formal and authoritative' },
    { value: 'casual', label: 'Casual', icon: Smile, description: 'Friendly and conversational' },
    { value: 'educational', label: 'Educational', icon: Zap, description: 'Informative and structured' },
    { value: 'entertaining', label: 'Entertaining', icon: Play, description: 'Fun and engaging' }
  ] as const;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Script</h2>
        <p className="text-gray-600">Tell us about your content and we'll generate a professional script for you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input */}
        <div>
          <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-2">
            What's your topic?
          </label>
          <input
            id="topic"
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
            placeholder="e.g., How AI is changing education, Best productivity tips for 2024..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            disabled={isLoading}
          />
        </div>

        {/* Length Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Script Length
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lengthOptions.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="length"
                  value={option.value}
                  checked={formData.length === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value as ScriptRequest['length'] }))}
                  className="sr-only"
                  disabled={isLoading}
                />
                <div className={`p-4 border-2 rounded-lg transition-all ${
                  formData.length === option.value 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Tone & Style
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {toneOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="tone"
                    value={option.value}
                    checked={formData.tone === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value as ScriptRequest['tone'] }))}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    formData.tone === option.value 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <Icon className="w-5 h-5 text-purple-600 mb-2" />
                    <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!formData.topic.trim() || isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating Script...
            </div>
          ) : (
            'Generate Script & Thumbnail'
          )}
        </button>
      </form>
    </div>
  );
};