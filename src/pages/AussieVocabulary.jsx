import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Volume2 } from 'lucide-react';

export default function AussieVocabulary() {
  const { data: vocab, isLoading } = useQuery({
    queryKey: ['aussie_vocab'],
    queryFn: () => base44.entities.AussieVocabulary.list(),
    initialData: []
  });

  const playAudio = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const auVoice = voices.find(v => (v.lang === 'en-AU' || v.lang === 'en_AU') && (v.name.includes('Neural') || v.name.includes('Natural') || v.name.includes('Online')))
                 || voices.find(v => v.lang === 'en-AU' || v.lang === 'en_AU')
                 || voices.find(v => v.lang.startsWith('en'));
    if (auVoice) utterance.voice = auVoice;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Aussie Core Vocab 📚</h1>
        <p className="text-lg text-slate-500">1000个日常口语最常用词汇及造句</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading && <div className="col-span-full text-center text-slate-500">加载中...</div>}
        {vocab.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-[#00843D]/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-end gap-3 mb-1">
                  <h3 className="text-2xl font-bold text-[#1e293b]">{item.word}</h3>
                  <button onClick={() => playAudio(item.word)} className="text-slate-400 hover:text-[#00843D] mb-1 transition-colors">
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-slate-500">[{item.phonetic}]</span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold">{item.part_of_speech}</span>
                </div>
              </div>
            </div>
            
            <p className="text-slate-700 font-medium mb-4">{item.chinese}</p>
            
            <div className="bg-[#f0f9ff] p-4 rounded-xl border border-[#e0f2fe]">
              <button onClick={() => playAudio(item.example_en)} className="text-left group w-full">
                <p className="text-slate-900 font-medium italic mb-1 group-hover:text-blue-700 transition-colors flex justify-between gap-4">
                  <span>"{item.example_en}"</span>
                  <Volume2 className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 shrink-0 mt-0.5" />
                </p>
                <p className="text-sm text-slate-600">{item.example_zh}</p>
              </button>
            </div>
          </div>
        ))}
        {vocab.length === 0 && !isLoading && (
          <div className="col-span-full text-center p-10 bg-white rounded-xl text-slate-500 border border-slate-200">正在生成词汇...</div>
        )}
      </div>
    </div>
  );
}