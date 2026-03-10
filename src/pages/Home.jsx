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
    color: 'from-[#00843D] to-[#005a2b]',
    accent: '#FFCD00',
  },
  {
    to: 'AussieDialogues',
    icon: <MessageCircle className="w-8 h-8" />,
    title: '50个实用 Small Talk 对话',
    desc: '咖啡店、超市、职场闲聊...各种生活情景对话一网打尽。',
    badge: '情景对话',
    color: 'from-[#c2410c] to-[#9a3412]',
    accent: '#fed7aa',
  },
  {
    to: 'AussieVocabulary',
    icon: <BookOpen className="w-8 h-8" />,
    title: '100个日常核心短语',
    desc: '不背无用词汇，精选澳洲日常高频短语，辅以地道例句练习。',
    badge: '核心短语',
    color: 'from-[#b45309] to-[#92400e]',
    accent: '#fef08a',
  },
  {
    to: 'Articles',
    icon: <Newspaper className="w-8 h-8" />,
    title: '英语文章—澳洲文化',
    desc: '精选文化必读文章，双语阅读，深入了解澳洲生活方式与文化背景。',
    badge: '文化阅读',
    color: 'from-[#1d4ed8] to-[#1e3a8a]',
    accent: '#bfdbfe',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f9f4] text-slate-900 overflow-hidden relative">

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_#d1fae5_0%,_#f7f9f4_60%)]" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#FFCD00]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#00843D]/10 rounded-full blur-3xl" />
        {/* Decorative dots pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20"
          style={{backgroundImage: 'radial-gradient(circle, #00843D 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-10 text-center">

        {/* Kangaroo + Stars decorative badge */}
        <div className="inline-flex items-center gap-2 bg-[#FFCD00]/15 border border-[#FFCD00]/30 text-[#FFCD00] px-5 py-2 rounded-full font-bold text-sm mb-8 backdrop-blur-sm">
          🦘 专为澳洲华人打造 · Made for Chinese Australians
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-7xl font-black mb-4 tracking-tight">
          <span className="text-white">G</span>
          <span className="text-[#FFCD00]">'</span>
          <span className="text-white">day</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFCD00] via-[#fde68a] to-[#00843D]">
            English
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-3 leading-relaxed">
          告别"中式英语"，学最地道的澳洲本土表达
        </p>
        <p className="text-sm text-slate-400 mb-12">配套音频朗读 · 沉浸式跟读练习 · 文化深度解析</p>

        {/* Stats row */}
        <div className="flex justify-center gap-8 md:gap-16 mb-14">
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
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <Link key={card.to} to={createPageUrl(card.to)} className="group">
              <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 h-full shadow-2xl hover:shadow-[0_0_40px_rgba(255,205,0,0.2)] hover:-translate-y-2 transition-all duration-300 flex flex-col border border-white/10 relative overflow-hidden`}>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className="w-14 h-14 bg-black/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform backdrop-blur-sm border border-white/10"
                    style={{ color: card.accent }}>
                    {card.icon}
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 text-white/80">
                    {card.badge}
                  </span>
                </div>

                <h2 className="text-lg font-black text-white mb-2 leading-snug relative z-10">
                  {card.title}
                </h2>
                <p className="text-sm text-white/65 leading-relaxed flex-1 relative z-10">{card.desc}</p>

                <div className="mt-5 flex items-center gap-2 relative z-10">
                  <span className="text-sm font-bold group-hover:gap-3 transition-all"
                    style={{ color: card.accent }}>
                    立即学习
                  </span>
                  <span className="text-base transition-transform group-hover:translate-x-1"
                    style={{ color: card.accent }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer credit */}
      <div className="relative z-10 text-center pb-10">
        <div className="inline-flex items-center gap-2 text-slate-400 text-sm">
          <span>🌏</span>
          <span>© 澳洲阿浩学长</span>
          <span>·</span>
          <span>G&apos;day English</span>
        </div>
      </div>

    </div>
  );
}