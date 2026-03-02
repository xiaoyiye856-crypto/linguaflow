import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Play, Loader2, Sparkles } from 'lucide-react';

export default function AussieSentences() {
  const [loadingText, setLoadingText] = React.useState(null);

  const { data: sentences, isLoading } = useQuery({
    queryKey: ['aussie_sentences'],
    queryFn: () => base44.entities.AussieSentence.list(),
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

  const sortedSentences = [...sentences].sort((a, b) => (b.usefulness_score || 0) - (a.usefulness_score || 0));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-[#00843D] to-[#FFCD00] rounded-t-3xl p-8 text-center text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
          🇦🇺 澳洲日常生活 易错口语
        </h1>
        <p className="text-lg opacity-95 font-medium">越日常的口语越不会说 😂 (按照常用程度排序)</p>
      </div>
      
      <div className="bg-white shadow-xl rounded-b-3xl overflow-hidden">
        <div className="grid grid-cols-12 bg-[#00843D] text-white font-bold p-4 text-center">
          <div className="col-span-3 text-left pl-4">中文</div>
          <div className="col-span-3 text-left">你以为的</div>
          <div className="col-span-6 text-left pl-2">澳洲地道表达 👍</div>
        </div>
        
        {isLoading ? (
          <div className="p-10 text-center text-slate-500">加载中...</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedSentences.map((item) => (
              <div key={item.id} className="grid grid-cols-12 p-4 md:p-6 items-start hover:bg-slate-50 transition-colors">
                <div className="col-span-3 font-bold text-slate-800 text-sm md:text-base pr-2 mt-1">{item.chinese}</div>
                <div className="col-span-3 text-slate-400 text-sm md:text-base pr-2 mt-1">
                  <span className="line-through">{item.wrong_en}</span> ❌
                </div>
                <div className="col-span-6 text-sm md:text-base">
                  <button 
                    onClick={() => playAudio(item.correct_en)}
                    className="text-left group w-full mb-3"
                  >
                    <div className="font-bold text-slate-900 group-hover:text-[#00843D] transition-colors flex items-start gap-2">
                      <span className="bg-[#FFCD00]/40 px-1.5 py-0.5 rounded inline-block">{item.correct_en}</span>
                      {loadingText === item.correct_en ? (
                        <Loader2 className="w-4 h-4 text-[#00843D] shrink-0 mt-1 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 text-[#00843D] shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    {item.explanation && (
                      <div className="text-emerald-700 text-xs mt-2 font-medium opacity-80">
                        {item.explanation}
                      </div>
                    )}
                  </button>
                  
                  {item.cultural_extension && (
                    <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-600 flex gap-2 items-start mt-2 border border-slate-200">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>{item.cultural_extension}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sentences.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                暂无数据，正在生成中...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}