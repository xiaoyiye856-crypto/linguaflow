import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MessageCircle, BookOpen, Quote, Sparkles, Newspaper } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 bg-[#FFCD00]/20 text-[#b38f00] px-4 py-1.5 rounded-full font-bold text-sm mb-6">
          <Sparkles className="w-4 h-4" /> 专为澳洲华人打造
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Master Authentic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00843D] to-[#FFCD00]">Aussie English</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          全面覆盖日常场景，摆脱“中式英语”，教你最地道的澳洲本土表达。配套真人发音，沉浸式跟读。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to={createPageUrl('AussieSentences')} className="group">
          <div className="bg-white rounded-3xl p-6 h-full border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#00843D]/30 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-50 text-[#00843D] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Quote className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">100句地道澳洲口语</h2>
            <p className="text-slate-600 text-sm">对比“你以为的”和“地道表达”，解决生活中的高频尴尬场景。</p>
          </div>
        </Link>

        <Link to={createPageUrl('AussieDialogues')} className="group">
          <div className="bg-white rounded-3xl p-6 h-full border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">100个 Small Talk</h2>
            <p className="text-slate-600 text-sm">咖啡店、超市、职场闲聊...各种生活情景对话一网打尽。</p>
          </div>
        </Link>

        <Link to={createPageUrl('AussieVocabulary')} className="group">
          <div className="bg-white rounded-3xl p-6 h-full border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-purple-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">100个日常核心短语</h2>
            <p className="text-slate-600 text-sm">不背无用词汇，精选澳洲日常高频短语，辅以地道例句练习。</p>
          </div>
        </Link>

        <Link to={createPageUrl('Articles')} className="group">
          <div className="bg-white rounded-3xl p-6 h-full border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-amber-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Newspaper className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">澳洲杂志期刊</h2>
            <p className="text-slate-600 text-sm">双语阅读，自动提取核心词汇与文化拓展，培养语感。</p>
          </div>
        </Link>
      </div>
    </div>
  );
}