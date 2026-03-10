import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MessageCircle, BookOpen, Quote, Newspaper } from 'lucide-react';

const cards = [
  {
    to: 'AussieSentences',
    icon: <Quote className="w-8 h-8" />,
    title: '100句地道澳洲口语',
    desc: '对比"你以为的"和"地道表达"，解决生活中的高频尴尬场景。',
    badge: '口语纠错',
    color: 'from-[#4ade80] to-[#16a34a]',
  },
  {
    to: 'AussieDialogues',
    icon: <MessageCircle className="w-8 h-8" />,
    title: '50个实用 Small Talk 对话',
    desc: '咖啡店、超市、职场闲聊...各种生活情景对话一网打尽。',
    badge: '情景对话',
    color: 'from-[#38bdf8] to-[#0284c7]',
  },
  {
    to: 'AussieVocabulary',
    icon: <BookOpen className="w-8 h-8" />,
    title: '100个日常核心短语',
    desc: '不背无用词汇，精选澳洲日常高频短语，辅以地道例句练习。',
    badge: '核心短语',
    color: 'from-[#a78bfa] to-[#7c3aed]',
  },
  {
    to: 'Articles',
    icon: <Newspaper className="w-8 h-8" />,
    title: '英语文章—澳洲文化',
    desc: '精选文化必读文章，双语阅读，深入了解澳洲生活方式与文化背景。',
    badge: '文化阅读',
    color: 'from-[#fb923c] to-[#ea580c]',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-10 text-center">

        <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 px-5 py-2 rounded-full text-sm mb-8">
          🦘 专为澳洲华人打造
        </div>

        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
          Master Authentic{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00843D] to-[#FFCD00]">
            Aussie English
          </span>
        </h1>

        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-3 leading-relaxed">
          全面覆盖日常场景，摆脱"中式英语"，教你最地道的澳洲本土表达。配套音频朗读，沉浸式跟读练习。
        </p>
        <p className="text-sm text-slate-400 mb-12">© 南半球小课堂</p>

        {/* Stats row */}
        <div className="flex justify-center gap-8 md:gap-16 mb-16">
          {[
            { num: '100+', label: '地道口语句型' },
            { num: '50+', label: '情景对话' },
            { num: '100+', label: '核心短语' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-[#00843D]">{s.num}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <Link key={card.to} to={createPageUrl(card.to)} className="group">
              <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 h-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}>

                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/20 text-white/90">
                    {card.badge}
                  </span>
                </div>

                <h2 className="text-lg font-black text-white mb-2 leading-snug">
                  {card.title}
                </h2>
                <p className="text-sm text-white/70 leading-relaxed flex-1">{card.desc}</p>

                <div className="mt-5 flex items-center gap-2 text-white font-bold text-sm">
                  <span>立即学习</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}