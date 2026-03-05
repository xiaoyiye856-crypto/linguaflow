import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SentencePractice from '@/components/practice/SentencePractice';

export default function AussieSentences() {
  const [mode, setMode] = useState(null); // null = choose, 'learn' or 'practice'

  const { data: sentences, isLoading, refetch } = useQuery({
    queryKey: ['aussie_sentences'],
    queryFn: () => base44.entities.AussieSentence.list(),
    initialData: []
  });

  const sortedSentences = [...sentences].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));


  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-[#00843D] to-[#FFCD00] rounded-t-3xl p-8 text-center text-white shadow-lg relative">
        <h1 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
          🇦🇺 100句地道澳洲口语
        </h1>
        <p className="text-lg opacity-95 font-medium">对比"你以为的"和"地道表达"，解决生活中的高频尴尬场景</p>
        

      </div>

      {/* Mode selector */}
      {!mode && !isLoading && (
        <div className="bg-white rounded-b-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <button
              onClick={() => setMode('learn')}
              className="p-10 flex flex-col items-center gap-4 hover:bg-blue-50 transition-colors group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-slate-900 mb-1">100句地道澳洲口语</div>
                <div className="text-sm text-slate-500">学习对比：你以为的 vs 地道表达</div>
              </div>
            </button>
            <button
              onClick={() => setMode('practice')}
              className="p-10 flex flex-col items-center gap-4 hover:bg-purple-50 transition-colors group"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenLine className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-slate-900 mb-1">100句澳洲口语练习</div>
                <div className="text-sm text-slate-500">看中文，写出地道英文表达</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Back button */}
      {mode && (
        <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-3">
          <button onClick={() => setMode(null)} className="text-sm text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1">
            ← 返回选择
          </button>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-bold text-slate-700">
            {mode === 'learn' ? '📖 学习模式' : '✏️ 练习模式'}
          </span>
        </div>
      )}

      {/* Learn mode */}
      {mode === 'learn' && (
        <div className="bg-white shadow-xl rounded-b-3xl overflow-hidden">
          <div className="grid grid-cols-12 bg-[#00843D] text-white font-bold p-4 text-center">
            <div className="col-span-4 text-left pl-4">中文</div>
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
                <div className="p-10 text-center text-slate-500">暂无数据，请导入内容。</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Practice mode */}
      {mode === 'practice' && !isLoading && (
        <div className="pt-4 pb-10">
          <SentencePractice sentences={sortedSentences} />
        </div>
      )}
    </div>
  );
}