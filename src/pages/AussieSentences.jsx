import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Edit, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AussieSentences() {
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [orders, setOrders] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const { data: sentences, isLoading, refetch } = useQuery({
    queryKey: ['aussie_sentences'],
    queryFn: () => base44.entities.AussieSentence.list(),
    initialData: []
  });

  const sortedSentences = [...sentences].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const toggleEditMode = () => {
    if (!isEditingOrder) {
      const initialOrders = {};
      sentences.forEach((s, i) => { initialOrders[s.id] = s.sort_order || i; });
      setOrders(initialOrders);
    }
    setIsEditingOrder(!isEditingOrder);
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const updates = [];
      for (const item of sentences) {
        if (orders[item.id] !== undefined && orders[item.id] !== item.sort_order) {
          updates.push(base44.entities.AussieSentence.update(item.id, { sort_order: Number(orders[item.id]) }));
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-[#00843D] to-[#FFCD00] rounded-t-3xl p-8 text-center text-white shadow-lg relative">
        <h1 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
          🇦🇺 100句地道澳洲口语
        </h1>
        <p className="text-lg opacity-95 font-medium">对比“你以为的”和“地道表达”，解决生活中的高频尴尬场景</p>
        
        <div className="absolute top-4 right-4 flex gap-2">
          {isEditingOrder ? (
            <Button size="sm" variant="secondary" onClick={handleSaveOrder} disabled={isSaving} className="font-bold">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Order
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={toggleEditMode} className="font-bold opacity-80 hover:opacity-100">
              <Edit className="w-4 h-4 mr-2" />
              Edit Order
            </Button>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow-xl rounded-b-3xl overflow-hidden">
        <div className="grid grid-cols-12 bg-[#00843D] text-white font-bold p-4 text-center">
          {isEditingOrder && <div className="col-span-1">排序</div>}
          <div className={`${isEditingOrder ? 'col-span-3' : 'col-span-4'} text-left pl-4`}>中文</div>
          <div className="col-span-3 text-left">你以为的</div>
          <div className="col-span-5 text-left pl-2">澳洲地道表达 👍</div>
        </div>
        
        {isLoading ? (
          <div className="p-10 text-center text-slate-500">加载中...</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedSentences.map((item) => (
              <div key={item.id} className="p-4 md:p-6 hover:bg-slate-50 transition-colors">
                <div className="grid grid-cols-12 items-center gap-2">
                  {isEditingOrder && (
                    <div className="col-span-1 pr-2">
                      <input 
                        type="number" 
                        value={orders[item.id] ?? ''} 
                        onChange={(e) => setOrders({...orders, [item.id]: e.target.value})}
                        className="w-full p-1 border rounded text-center text-sm font-mono"
                      />
                    </div>
                  )}
                  <div className={`${isEditingOrder ? 'col-span-3' : 'col-span-4'} font-bold text-slate-800 text-sm md:text-base pr-2`}>
                    {item.chinese}
                  </div>
                  <div className="col-span-3 text-slate-400 text-sm md:text-base pr-2">
                    <span className="line-through">{item.wrong_en}</span> ❌
                  </div>
                  <div className="col-span-5 text-sm md:text-base">
                    <div className="text-left w-full mb-2">
                      <div className="font-bold text-slate-900 flex items-start gap-2">
                        <span className="bg-[#FFCD00]/40 px-1.5 py-0.5 rounded inline-block">{item.correct_en}</span>
                      </div>
                      {item.explanation && (
                        <div className="text-emerald-700 text-xs mt-2 font-medium opacity-80">
                          {item.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {item.cultural_extension && (
                  <div className="mt-3 bg-amber-50 p-3 rounded-lg text-xs text-amber-900 border border-amber-100 flex gap-2">
                    <span className="text-sm">💡</span>
                    <div>
                      <span className="font-bold mr-2">文化拓展:</span>
                      {item.cultural_extension}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {sentences.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                暂无数据，请导入内容。
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}