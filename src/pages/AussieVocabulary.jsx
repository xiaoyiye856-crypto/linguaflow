import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Volume2, Loader2, BookOpen, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AussieVocabulary() {
  const [loadingText, setLoadingText] = useState(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [orders, setOrders] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const { data: vocab, isLoading, refetch } = useQuery({
    queryKey: ['aussie_vocab'],
    queryFn: () => base44.entities.AussieVocabulary.list(),
    initialData: []
  });

  const sortedVocab = [...vocab].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const playAudio = async (text, voice = 'nova') => {
    setLoadingText(text);
    try {
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

  const toggleEditMode = () => {
    if (!isEditingOrder) {
      const initialOrders = {};
      sortedVocab.forEach((v, i) => { initialOrders[v.id] = v.sort_order || i; });
      setOrders(initialOrders);
    }
    setIsEditingOrder(!isEditingOrder);
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const updates = [];
      for (const item of vocab) {
        if (orders[item.id] !== undefined && orders[item.id] !== item.sort_order) {
          updates.push(base44.entities.AussieVocabulary.update(item.id, { sort_order: Number(orders[item.id]) }));
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

  const groupedVocab = React.useMemo(() => {
    const groups = {};
    sortedVocab.forEach(item => {
      const cat = item.category || 'Other Expressions';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [sortedVocab]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-10 relative">
        <h1 className="text-4xl font-black text-slate-900 mb-4">100个日常核心短语 🌟</h1>
        <p className="text-lg text-slate-500">分类整理，支持排序与发音跟读</p>
        
        <div className="absolute top-0 right-0">
          {isEditingOrder ? (
            <Button size="sm" variant="outline" onClick={handleSaveOrder} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Order
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={toggleEditMode}>
              <Edit className="w-4 h-4 mr-2" /> Edit Order
            </Button>
          )}
        </div>
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
                <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-[#00843D]/30 transition-all flex flex-col">
                  {isEditingOrder && (
                    <div className="mb-4 bg-slate-50 p-2 rounded-lg flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-500">Sort Order:</span>
                      <input 
                        type="number" 
                        value={orders[item.id] ?? ''} 
                        onChange={(e) => setOrders({...orders, [item.id]: e.target.value})}
                        className="w-20 p-1 border rounded text-center text-sm font-mono"
                      />
                    </div>
                  )}
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
                    <div className="bg-[#f0f9ff] p-4 rounded-xl border border-[#e0f2fe] mt-auto">
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
        <div className="text-center p-10 bg-white rounded-xl text-slate-500 border border-slate-200">暂无数据...</div>
      )}
    </div>
  );
}