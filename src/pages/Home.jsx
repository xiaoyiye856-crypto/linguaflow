import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MessageCircle, BookOpen, Quote, Sparkles, Newspaper } from 'lucide-react';

const cards = [
  {
    to: 'AussieSentences',
    icon: <Quote className="w-7 h-7 text-white" />,
    title: '100句地道澳洲口语',
    desc: '对比"你以为的"和"地道表达"，解决生活中的高频尴尬场景。',
    gradient: 'from-[#4ade80] via-[#34d399] to-[#6ee7b7]',
    iconBg: 'bg-white/20',
    badge: '口语纠错',
    badgeColor: 'bg-white/20 text-white',
  },
  {
    to: 'AussieDialogues',
    icon: <MessageCircle className="w-7 h-7 text-white" />,
    title: '50个实用 Small Talk 对话',
    desc: '咖啡店、超市、职场闲聊...各种生活情景对话一网打尽。',
    gradient: 'from-[#60a5fa] via-[#38bdf8] to-[#67e8f9]',
    iconBg: 'bg-white/20',
    badge: '情景对话',
    badgeColor: 'bg-white/20 text-white',
  },
  {
    to: 'AussieVocabulary',
    icon: <BookOpen className="w-7 h-7 text-white" />,
    title: '100个日常核心短语',
    desc: '不背无用词汇，精选澳洲日常高频短语，辅以地道例句练习。',
    gradient: 'from-[#c084fc] via-[#a78bfa] to-[#818cf8]',
    iconBg: 'bg-white/20',
    badge: '核心短语',
    badgeColor: 'bg-white/20 text-white',
  },
  {
    to: 'Articles',
    icon: <Newspaper className="w-7 h-7 text-white" />,
    title: '英语文章—澳洲文化',
    desc: '精选文化必读文章，双语阅读，深入了解澳洲生活方式与文化背景。',
    gradient: 'from-[#fbbf24] via-[#fb923c] to-[#f87171]',
    iconBg: 'bg-white/20',
    badge: '文化阅读',
    badgeColor: 'bg-white/20 text-white',
  },
];

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
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-3">
          全面覆盖日常场景，摆脱"中式英语"，教你最地道的澳洲本土表达。配套音频朗读，沉浸式跟读练习。
        </p>
        <p className="text-sm text-slate-400 font-medium">© 澳洲阿浩学长</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link key={card.to} to={createPageUrl(card.to)} className="group">
            <div className={`bg-gradient-to-br ${card.gradient} rounded-3xl p-6 h-full shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col ring-1 ring-white/30 ring-inset outline outline-2 outline-white/10`}>
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 ${card.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2 leading-snug">
                <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-lg text-white drop-shadow">{card.title}</span>
              </h2>
              <p className="text-sm text-white/75 leading-relaxed flex-1">{card.desc}</p>
              <div className="mt-5 text-sm font-bold text-white flex items-center gap-1 group-hover:gap-2 transition-all">
                立即学习 <span className="text-base">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}