import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Volume2, Loader2, BookOpen } from 'lucide-react';

export default function AussieVocabulary() {
  const [loadingText, setLoadingText] = React.useState(null);

  const { data: vocab, isLoading } = useQuery({
    queryKey: ['aussie_vocab'],
    queryFn: () => base44.entities.AussieVocabulary.list(),
    initialData: []
  });

  const playAudio = (text) => {
    window.speechSynthesis.cancel();
    setLoadingText(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-AU';
    const voices = window.speechSynthesis.getVoices();
    const auVoice = voices.find(v => v.lang.includes('en-AU'));
    if (auVoice) utterance.voice = auVoice;
    utterance.onend = () => setLoadingText(null);
    utterance.onerror = () => setLoadingText(null);
    window.speechSynthesis.speak(utterance);
  };

  const groupedVocab = React.useMemo(() => {
    const groups = {};
    vocab.forEach(item => {
      const cat = item.category || 'Other Expressions';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [vocab]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Aussie Core Phrases 🌟</h1>
        <p className="text-lg text-slate-500">英语生活常用100个短语 (分类整理版)</p>
      </div>

      {isLoading && <div className="text-center text-slate-500">加载中...</div>}
      
      <div className="space-y-12">
        {Object.entries(groupedVocab).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-[#00843D] mb-6 flex items-center gap-2 border-b pb-2">
              <BookOpen className="w-6 h-6" /> {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-[#00843D]/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-end gap-3 mb-1">
                        <h3 className="text-2xl font-bold text-[#1e293b]">{item.word}</h3>
                        <button onClick={() => playAudio(item.word)} disabled={loadingText === item.word} className="text-slate-400 hover:text-[#00843D] mb-1 transition-colors">
                          {loadingText === item.word ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {item.phonetic && <span className="font-mono text-slate-500">[{item.phonetic}]</span>}
                        {item.part_of_speech && <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold">{item.part_of_speech}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 font-medium mb-4">{item.chinese}</p>
                  
                  {item.example_en && (
                    <div className="bg-[#f0f9ff] p-4 rounded-xl border border-[#e0f2fe]">
                      <button onClick={() => playAudio(item.example_en)} className="text-left group w-full">
                        <p className="text-slate-900 font-medium italic mb-1 group-hover:text-blue-700 transition-colors flex justify-between gap-4">
                          <span>"{item.example_en}"</span>
                          {loadingText === item.example_en ? (
                            <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0 mt-0.5" />
                          ) : (
                            <Volume2 className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 shrink-0 mt-0.5" />
                          )}
                        </p>
                        <p className="text-sm text-slate-600">{item.example_zh}</p>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {vocab.length === 0 && !isLoading && (
        <div className="text-center p-10 bg-white rounded-xl text-slate-500 border border-slate-200">正在根据大纲生成内容中...</div>
      )}
    </div>
  );
}