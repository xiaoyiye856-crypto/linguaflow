import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Play, Loader2, Sparkles, Folder, ArrowLeft, Edit, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function AussieDialogues() {
  const [loadingText, setLoadingText] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null); // null means showing category list
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [orders, setOrders] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const { data: dialogues, isLoading, refetch } = useQuery({
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
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-AU';
      window.speechSynthesis.speak(utterance);
    } finally {
      setLoadingText(null);
    }
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

  const toggleEditMode = () => {
    if (!isEditingOrder) {
      const initialOrders = {};
      sortedDialogues.forEach((d, i) => { initialOrders[d.id] = d.sort_order || i; });
      setOrders(initialOrders);
    }
    setIsEditingOrder(!isEditingOrder);
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const updates = [];
      for (const item of dialogues) {
        if (orders[item.id] !== undefined && orders[item.id] !== item.sort_order) {
          updates.push(base44.entities.AussieDialogue.update(item.id, { sort_order: Number(orders[item.id]) }));
        }
      }
      if (updates.length > 0) {
        await Promise.all(updates);
        await refetch();
      }
      setIsEditingOrder(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save order");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredDialogues = activeCategory ? categoryMap[activeCategory] : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-10 relative">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Aussie Small Talk 🗣️</h1>
        <p className="text-lg text-slate-500">直击澳洲生活的 Small Talk 对话，覆盖各类日常场景，助你轻松破冰，拒绝社交尴尬！</p>
        
        <div className="absolute top-0 right-0">
          {activeCategory && (
            isEditingOrder ? (
              <Button size="sm" variant="outline" onClick={handleSaveOrder} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Order
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={toggleEditMode}>
                <Edit className="w-4 h-4 mr-2" /> Edit Order
              </Button>
            )
          )}
        </div>
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
                  {isEditingOrder && (
                    <input 
                      type="number" 
                      value={orders[dialogue.id] ?? ''} 
                      onChange={(e) => setOrders({...orders, [dialogue.id]: e.target.value})}
                      className="w-16 p-1 text-slate-900 rounded text-center text-sm font-mono border mr-4 z-10 relative"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}