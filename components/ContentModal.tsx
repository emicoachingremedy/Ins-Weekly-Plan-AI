import React, { useEffect, useState } from 'react';
import { GeneratedDay, ContentGenerationResult } from '../types';
import { generatePostContent } from '../services/geminiService';
import { X, Copy, Check, Loader2, Image as ImageIcon, Hash, FileText } from 'lucide-react';

interface ContentModalProps {
  day: GeneratedDay | null;
  onClose: () => void;
}

export const ContentModal: React.FC<ContentModalProps> = ({ day, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (day) {
      setLoading(true);
      setError(null);
      setContent(null);

      generatePostContent(day)
        .then(result => {
          setContent(result);
        })
        .catch(err => {
          setError("Failed to generate content. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [day]);

  if (!day) return null;

  const handleCopy = () => {
    if (content) {
      const fullText = `${content.caption}\n\n${content.hashtags.join(' ')}`;
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur z-10 p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {day.day} <span className="text-slate-500 font-normal">Content Plan</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">Theme: <span className="text-indigo-400">{day.theme}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-slate-400 animate-pulse">Consulting the creative spirits...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          {content && !loading && (
            <div className="space-y-8">
              
              {/* Strategy Recap */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Pillar</p>
                  <p className="text-sm font-medium text-slate-200">{day.part1}</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Ending</p>
                    <p className="text-sm font-medium text-slate-200">{day.part2}</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Format</p>
                    <p className="text-sm font-medium text-slate-200">{day.format}</p>
                </div>
              </div>

              {/* Caption Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                    <FileText className="w-5 h-5" />
                    <h3>Proposed Caption</h3>
                </div>
                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {content.caption}
                </div>
              </div>

              {/* Visuals Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-pink-400 font-semibold">
                    <ImageIcon className="w-5 h-5" />
                    <h3>Visual Direction</h3>
                </div>
                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 text-slate-300 leading-relaxed">
                  {content.visualDescription}
                </div>
              </div>

              {/* Hashtags Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-semibold">
                    <Hash className="w-5 h-5" />
                    <h3>Hashtags</h3>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-wrap gap-2">
                  {content.hashtags.map((tag, idx) => (
                    <span key={idx} className="text-blue-300 bg-blue-500/10 px-2 py-1 rounded text-sm">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Copy Button */}
              <button 
                onClick={handleCopy}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 active:scale-[0.98]"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Caption & Tags'}
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};