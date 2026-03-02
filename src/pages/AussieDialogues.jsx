import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Play, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

let currentAudio = null;

export default function AussieDialogues() {
  const [loadingText, setLoadingText] = React.useState(null);

  const { data: dialogues, isLoading } = useQuery({
    queryKey: ['aussie_dialogues'],
    queryFn: () => base44.entities.AussieDialogue.list(),
    initialData: []
  });

  const playAudio = async (text, gender) => {
    setLoadingText(text);
    try {
      const voice = gender === 'male' ? 'onyx' : 'nova';
      const res = await base44.functions.invoke('generateAudio', { text, voice });
      if (res.data && res.data.audio) {
        const audio = new Audio(res.data.audio);
        audio.play();
      }
    } catch (e) {
      console.error(e);
      // Fallback
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-AU';
      window.speechSynthesis.speak(utterance);
    } finally {
      setLoadingText(null);
    }
  };

  const groupedDialogues = React.useMemo(() => {
    const groups = {};
    const sorted = [...dialogues].sort((a, b) => (b.usefulness_score || 0) - (a.usefulness_score || 0));
    sorted.forEach(d => {
      const cat = d.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(d);
    });
    return groups;
  }, [dialogues]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Aussie Small Talk 🗣️</h1>
        <p className="text-lg text-slate-500">澳洲生活常见情景对话练习（按常用度排序）</p>
      </div>

      <div className="space-y-12">
        {isLoading && <div className="text-center text-slate-500">加载中...</div>}
        {Object.entries(groupedDialogues).map(([category, items]) => (
          <div key={category} className="space-y-6">
            <h2 className="text-2xl font-bold text-[#FFCD00] drop-shadow-sm flex items-center gap-2 border-b border-slate-200 pb-2">
              📌 {category}
            </h2>
        {items.map((dialogue) => (
          <Card key={dialogue.id} className="overflow-hidden border border-slate-200 shadow-md">
            <div className="bg-[#1e293b] text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{dialogue.title}</h2>
                <p className="text-sm text-slate-300 mt-1">{dialogue.context}</p>
              </div>
            </div>
            <div className="p-6 space-y-6 bg-slate-50">
              {dialogue.lines?.map((line, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-16 shrink-0 text-right mt-1">
                    <span className="font-bold text-sm text-[#00843D] uppercase tracking-wider">{line.speaker}</span>
                  </div>
                  <div className="flex-1 group">
                    <button 
                      onClick={() => playAudio(line.en, line.gender || (idx % 2 === 0 ? 'female' : 'male'))}
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
            {dialogue.cultural_extension && (
              <div className="bg-amber-50 p-4 text-sm text-amber-900 border-t border-amber-100 flex gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <div className="font-bold mb-1">文化拓展 Cultural Note</div>
                  {dialogue.cultural_extension}
                </div>
              </div>
            )}
          </Card>
        ))}
          </div>
        ))}
        {dialogues.length === 0 && !isLoading && (
          <div className="text-center p-10 bg-white rounded-xl text-slate-500 border border-slate-200">无数据或正在生成中...</div>
        )}
      </div>
    </div>
  );
}