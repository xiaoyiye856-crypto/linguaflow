import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Play, Loader2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AussieDialogues() {
  const [loadingText, setLoadingText] = React.useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: dialogues, isLoading } = useQuery({
    queryKey: ['aussie_dialogues'],
    queryFn: () => base44.entities.AussieDialogue.list(),
    initialData: []
  });

  const playAudio = (text, gender) => {
    window.speechSynthesis.cancel();
    setLoadingText(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-AU';
    
    const voices = window.speechSynthesis.getVoices();
    const auVoices = voices.filter(v => v.lang.includes('en-AU') || v.lang.includes('en-GB') || v.lang.includes('en-US'));
    if (auVoices.length > 0) {
      if (gender === 'female') {
        const femaleVoice = auVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('karen') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('victoria') || v.name.toLowerCase().includes('zira'));
        if (femaleVoice) utterance.voice = femaleVoice;
      } else if (gender === 'male') {
        const maleVoice = auVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('alex') || v.name.toLowerCase().includes('lee') || v.name.toLowerCase().includes('rocky'));
        if (maleVoice) utterance.voice = maleVoice;
      } else {
        utterance.voice = auVoices[0];
      }
    }

    utterance.onend = () => setLoadingText(null);
    utterance.onerror = () => setLoadingText(null);
    window.speechSynthesis.speak(utterance);
  };

  const categories = ['All', ...new Set(dialogues.map(d => d.category).filter(Boolean))];
  const sortedDialogues = [...dialogues].sort((a, b) => (b.usefulness_score || 0) - (a.usefulness_score || 0));
  const filteredDialogues = activeCategory === 'All' ? sortedDialogues : sortedDialogues.filter(d => d.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Aussie Small Talk 🗣️</h1>
        <p className="text-lg text-slate-500">澳洲生活常见情景对话练习 (按常用程度排序)</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${
              activeCategory === cat 
                ? 'bg-[#00843D] text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {isLoading && <div className="text-center text-slate-500">加载中...</div>}
        {filteredDialogues.map((dialogue) => (
          <Card key={dialogue.id} className="overflow-hidden border border-slate-200 shadow-md">
            <div className="bg-[#1e293b] text-white px-6 py-4 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{dialogue.title}</h2>
                  {dialogue.usefulness_score && (
                    <span className="bg-[#FFCD00] text-[#1e293b] text-xs font-black px-2 py-0.5 rounded-full">
                      Hot {dialogue.usefulness_score}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 mt-1">{dialogue.context}</p>
              </div>
            </div>
            
            {dialogue.cultural_extension && (
              <div className="bg-[#f0fdf4] border-b border-[#bbf7d0] px-6 py-3 flex gap-3 items-start">
                <Sparkles className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#166534] text-sm mb-0.5">文化拓展 Cultural Tip</h4>
                  <p className="text-sm text-[#15803d]">{dialogue.cultural_extension}</p>
                </div>
              </div>
            )}

            <div className="p-6 space-y-6 bg-slate-50">
              {dialogue.lines?.map((line, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-16 shrink-0 text-right mt-1">
                    <span className={`font-bold text-sm uppercase tracking-wider ${line.gender === 'female' ? 'text-pink-600' : line.gender === 'male' ? 'text-blue-600' : 'text-[#00843D]'}`}>
                      {line.speaker}
                    </span>
                  </div>
                  <div className="flex-1 group">
                    <button 
                      onClick={() => playAudio(line.en, line.gender)}
                      className="text-left w-full hover:bg-white p-3 -m-3 rounded-xl transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm"
                    >
                      <div className="text-lg font-bold text-slate-900 mb-1 flex items-start justify-between gap-4">
                        <span>{line.en}</span>
                        {loadingText === line.en ? (
                          <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0 mt-1" />
                        ) : (
                          <Play className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                        )}
                      </div>
                      <div className="text-slate-600 text-sm">{line.zh}</div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
        {filteredDialogues.length === 0 && !isLoading && (
          <div className="text-center p-10 bg-white rounded-xl text-slate-500 border border-slate-200">正在根据大纲生成内容中...</div>
        )}
      </div>
    </div>
  );
}