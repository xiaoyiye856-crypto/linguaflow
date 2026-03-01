import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Play } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AussieDialogues() {
  const { data: dialogues, isLoading } = useQuery({
    queryKey: ['aussie_dialogues'],
    queryFn: () => base44.entities.AussieDialogue.list(),
    initialData: []
  });

  const playAudio = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const isMale = (name) => name.includes('Male') || name.includes('Gordon') || name.includes('Russell') || name.includes('William') || name.includes('James') || name.includes('Neil') || name.includes('Mac');
    const auVoice = voices.find(v => (v.lang === 'en-AU' || v.lang === 'en_AU') && isMale(v.name) && (v.name.includes('Neural') || v.name.includes('Natural') || v.name.includes('Online')))
                 || voices.find(v => (v.lang === 'en-AU' || v.lang === 'en_AU') && isMale(v.name))
                 || voices.find(v => (v.lang === 'en-AU' || v.lang === 'en_AU') && (v.name.includes('Neural') || v.name.includes('Natural')))
                 || voices.find(v => v.lang === 'en-AU' || v.lang === 'en_AU')
                 || voices.find(v => v.lang.startsWith('en'));
    if (auVoice) utterance.voice = auVoice;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Aussie Small Talk 🗣️</h1>
        <p className="text-lg text-slate-500">100个澳洲生活常见情景对话练习</p>
      </div>

      <div className="space-y-8">
        {isLoading && <div className="text-center text-slate-500">加载中...</div>}
        {dialogues.map((dialogue) => (
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
                      onClick={() => playAudio(line.en)}
                      className="text-left w-full hover:bg-white p-3 -m-3 rounded-xl transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm"
                    >
                      <div className="text-lg font-bold text-slate-900 mb-1 flex items-start justify-between gap-4">
                        <span>{line.en}</span>
                        <Play className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                      </div>
                      <div className="text-slate-600 text-sm">{line.zh}</div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
        {dialogues.length === 0 && !isLoading && (
          <div className="text-center p-10 bg-white rounded-xl text-slate-500 border border-slate-200">正在生成对话...</div>
        )}
      </div>
    </div>
  );
}