import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Play, Sparkles, Folder, ArrowLeft } from 'lucide-react';
import DialoguePractice from '@/components/practice/DialoguePractice';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAussieVoice } from '@/components/useAussieVoice';

const HighlightedText = ({ text, notes }) => {
  if (!notes || notes.length === 0 || !text) return <span>{text}</span>;
  const sortedNotes = [...notes].filter(n => n.word).sort((a, b) => b.word.length - a.word.length);
  let parts = [{ text, isHighlight: false }];
  sortedNotes.forEach(note => {
    const newParts = [];
    parts.forEach(part => {
      if (part.isHighlight) {
        newParts.push(part);
        return;
      }
      try {
        const regex = new RegExp(`(${note.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const splitText = part.text.split(regex);
        splitText.forEach(s => {
          if (s.toLowerCase() === note.word.toLowerCase()) {
            newParts.push({ text: s, isHighlight: true, note });
          } else if (s) {
            newParts.push({ text: s, isHighlight: false });
          }
        });
      } catch (e) {
        newParts.push(part);
      }
    });
    parts = newParts;
  });

  return (
    <span className="leading-loose">
      {parts.map((part, i) => 
        part.isHighlight ? (
          <span key={i} className="relative group inline-block">
            <span className="px-1.5 py-0.5 mx-0.5 rounded-md cursor-help border-b-2 bg-amber-100 border-amber-300 text-amber-900">
              {part.text}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-50">
              <div className="font-bold mb-1">🌟 重点词汇</div>
              {part.note.note}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
            </div>
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </span>
  );
};

export default function AussieDialogues() {
  const [playingText, setPlayingText] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const { speak, cancel } = useAussieVoice();
  
  const { data: dialogues, isLoading } = useQuery({
    queryKey: ['aussie_dialogues'],
    queryFn: () => base44.entities.AussieDialogue.list(),
    initialData: []
  });

  const playAudio = (text, gender) => {
    if (playingText === text) {
      cancel();
      setPlayingText(null);
      return;
    }
    setPlayingText(text);
    speak(text, gender || 'female', () => setPlayingText(null));
  };



  const sortedDialogues = [...dialogues].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  
  const categoryMap = useMemo(() => {
    const map = {};
    sortedDialogues.forEach(d => {
      const cat = d.category || 'Other';
      if (!map[cat]) map[cat] = [];
      map[cat].push(d);
    });
    return map;
  }, [sortedDialogues]);

  const filteredDialogues = activeCategory ? categoryMap[activeCategory] : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Aussie Small Talk 🗣️</h1>
        <p className="text-lg text-slate-500">直击澳洲生活的 Small Talk 对话，覆盖各类日常场景，助你轻松破冰，拓展人脉，拒绝社交尴尬！</p>
      </div>

      {isLoading && <div className="text-center text-slate-500">加载中...</div>}
      
      {!isLoading && !activeCategory && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(categoryMap).map(([cat, items]) => (
            <div 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-500/50 cursor-pointer transition-all duration-300 group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Folder className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{cat}</h3>
                  <p className="text-slate-500 text-sm">{items.length} 个对话</p>
                </div>
              </div>
            </div>
          ))}
          {Object.keys(categoryMap).length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-500">暂无对话数据，请先导入。</div>
          )}
        </div>
      )}

      {activeCategory && (
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b pb-4">
            <Button variant="ghost" onClick={() => setActiveCategory(null)} className="px-2">
              <ArrowLeft className="w-5 h-5 mr-1" /> 返回分类
            </Button>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeCategory} ({filteredDialogues.length})
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {filteredDialogues.map((dialogue, index) => (
              <AccordionItem key={dialogue.id} value={dialogue.id} className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden data-[state=open]:ring-2 data-[state=open]:ring-blue-500/20 transition-all">
                <div className="flex items-center w-full px-6 hover:bg-slate-50 transition-colors group/trigger">
                  <AccordionTrigger className="hover:no-underline py-4 flex-1 justify-between w-full">
                    <div className="flex items-center gap-4 text-left w-full">
                      <span className="text-blue-600 font-black text-lg bg-blue-50 w-8 h-8 flex items-center justify-center rounded-lg shrink-0 group-hover/trigger:scale-110 transition-transform">{index + 1}</span>
                      <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-slate-900 group-hover/trigger:text-blue-600 transition-colors">{dialogue.title}</h2>
                        {dialogue.context && <p className="text-sm text-slate-500 font-normal mt-0.5">{dialogue.context}</p>}
                      </div>
                    </div>
                  </AccordionTrigger>
                </div>
                
                <AccordionContent className="border-t border-slate-100 bg-slate-50/50">

                  {dialogue.cultural_extension && (
                    <div className="bg-[#f0fdf4] border-b border-[#bbf7d0] px-6 py-4 flex gap-3 items-start">
                      <Sparkles className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-[#166534] text-sm mb-1">文化拓展 Cultural Tip</h4>
                        <p className="text-sm text-[#15803d] leading-relaxed">{dialogue.cultural_extension}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-6">
                    {dialogue.lines?.map((line, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-16 shrink-0 text-right mt-1">
                          <span className={`font-bold text-sm uppercase tracking-wider ${line.gender === 'female' ? 'text-pink-600' : line.gender === 'male' ? 'text-blue-600' : 'text-[#00843D]'}`}>
                            {line.speaker}
                          </span>
                        </div>
                        <div className="flex-1 group">
                          <div className={`text-left w-full bg-white p-4 rounded-xl transition-all border shadow-sm relative ${playingText === line.en ? 'border-blue-400 ring-2 ring-blue-100 scale-[1.02]' : 'border-slate-200'}`}>
                            <div className="text-lg font-bold text-slate-900 mb-2 flex items-start justify-between gap-4">
                              <HighlightedText text={line.en} notes={dialogue.admin_notes || []} />
                              <button onClick={() => playAudio(line.en, line.gender ? line.gender : (idx % 2 === 0 ? 'male' : 'female'))} className="shrink-0 mt-1 hover:scale-110 transition-transform">
                                <Play className={`w-5 h-5 transition-opacity ${playingText === line.en ? 'text-blue-600 opacity-100' : 'text-blue-500 opacity-60 group-hover:opacity-100'}`} fill={playingText === line.en ? 'currentColor' : 'none'} />
                              </button>
                            </div>
                            <div className="text-slate-600 text-sm">{line.zh}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <DialoguePractice dialogue={dialogue} />

                  {dialogue.admin_notes && dialogue.admin_notes.length > 0 && (
                    <div className="bg-white border-t border-slate-100 p-6">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                        🌟 重点词汇解析
                      </h4>
                      <div className="grid gap-3">
                        {dialogue.admin_notes.map((n, i) => (
                          <div key={i} className="bg-amber-50 text-amber-900 px-4 py-3 rounded-xl border border-amber-100 flex flex-col sm:flex-row sm:items-baseline gap-2">
                            <span className="font-black text-amber-700 min-w-[120px]">{n.word}</span>
                            <span className="text-sm opacity-90">{n.note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}