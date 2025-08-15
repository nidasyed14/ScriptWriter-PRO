import React from 'react';
import { GeneratedScript } from '../types';
import { Clock, FileText, Download } from 'lucide-react';

interface ScriptDisplayProps {
  script: GeneratedScript;
  topic: string;
}

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script, topic }) => {
  const downloadScript = () => {
    const scriptContent = `${script.title}
    
INTRO:
${script.intro}

MAIN POINTS:
${script.mainPoints.map((point, index) => `${index + 1}. ${point}`).join('\n\n')}

OUTRO:
${script.outro}

---
Estimated Duration: ${script.estimatedDuration}
Word Count: ${script.wordCount} words
Generated for: ${topic}`;

    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_script.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold flex-1">{script.title}</h2>
          <button
            onClick={downloadScript}
            className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
        <div className="flex space-x-6 text-purple-100">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{script.estimatedDuration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>{script.wordCount} words</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Intro Section */}
        <div className="border-l-4 border-green-500 pl-4">
          <h3 className="font-semibold text-green-700 mb-2">INTRODUCTION</h3>
          <p className="text-gray-700 leading-relaxed">{script.intro}</p>
        </div>

        {/* Main Points */}
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="font-semibold text-blue-700 mb-3">MAIN POINTS</h3>
          <div className="space-y-4">
            {script.mainPoints.map((point, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{point}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outro Section */}
        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="font-semibold text-purple-700 mb-2">CONCLUSION & CTA</h3>
          <p className="text-gray-700 leading-relaxed">{script.outro}</p>
        </div>
      </div>
    </div>
  );
};