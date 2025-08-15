import React, { useState } from 'react';
import { ScriptForm } from './components/ScriptForm';
import { ScriptDisplay } from './components/ScriptDisplay';
import { ThumbnailGenerator } from './components/ThumbnailGenerator';
import { ScriptRequest, GeneratedScript } from './types';
import { AIService } from './services/ai';
import { Youtube, Mic, Sparkles, Zap } from 'lucide-react';

function App() {
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateScript = async (request: ScriptRequest) => {
    setIsLoading(true);
    setCurrentTopic(request.topic);
    
    try {
      const generatedScript = await AIService.generateScript(request);
      setScript(generatedScript);
    } catch (error) {
      console.error('Error generating script:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setScript(null);
    setCurrentTopic('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl">
                <div className="flex items-center space-x-1">
                  <Youtube className="w-6 h-6 text-white" />
                  <Mic className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ScriptWriter Pro
                </h1>
                <p className="text-gray-600">AI-Powered Content Creation for YouTube & Podcasts</p>
              </div>
            </div>
            {script && (
              <button
                onClick={resetForm}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>New Script</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!script && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="mb-8">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              Create Professional Scripts in
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Seconds</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your ideas into engaging YouTube videos and podcasts with AI-generated scripts 
              and stunning thumbnails. Perfect for content creators, marketers, and storytellers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="bg-purple-100 p-4 rounded-xl w-fit mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Generate complete scripts in under 30 seconds with our advanced AI technology.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="bg-blue-100 p-4 rounded-xl w-fit mx-auto mb-4">
                <Youtube className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">YouTube Optimized</h3>
              <p className="text-gray-600">Scripts designed to maximize engagement, retention, and subscriber growth.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="bg-pink-100 p-4 rounded-xl w-fit mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto Thumbnails</h3>
              <p className="text-gray-600">Generate eye-catching thumbnails that drive clicks and views automatically.</p>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {!script ? (
          <ScriptForm onGenerate={handleGenerateScript} isLoading={isLoading} />
        ) : (
          <div className="space-y-8">
            <ScriptDisplay script={script} topic={currentTopic} />
            <ThumbnailGenerator topic={currentTopic} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Youtube className="w-6 h-6" />
              <span className="text-xl font-bold">ScriptWriter Pro</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering content creators with AI-driven script generation and thumbnail creation.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>Built with React & TypeScript</span>
              <span>•</span>
              <span>Powered by AI</span>
              <span>•</span>
              <span>Made for Creators</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;