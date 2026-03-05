import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Globe, Home, Quote, MessageCircle, BookOpen, Wand2 } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-[#1e293b] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to={createPageUrl('Home')} className="flex items-center gap-2 font-black text-xl tracking-wider">
                <Globe className="w-6 h-6 text-[#FFCD00]" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200">AussieLingo</span>
              </Link>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link to={createPageUrl('Home')} className="flex items-center gap-1.5 hover:text-[#FFCD00] transition-colors">
                  <Home className="w-4 h-4" /> Home
                </Link>
                <Link to={createPageUrl('AussieSentences')} className="flex items-center gap-1.5 hover:text-[#FFCD00] transition-colors">
                  <Quote className="w-4 h-4" /> 易错口语
                </Link>
                <Link to={createPageUrl('AussieDialogues')} className="flex items-center gap-1.5 hover:text-[#FFCD00] transition-colors">
                  <MessageCircle className="w-4 h-4" /> Small Talk
                </Link>
                <Link to={createPageUrl('AussieVocabulary')} className="flex items-center gap-1.5 hover:text-[#FFCD00] transition-colors">
                  <BookOpen className="w-4 h-4" /> 核心短语
                </Link>
                <Link to={createPageUrl('Articles')} className="flex items-center gap-1.5 hover:text-[#FFCD00] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-newspaper"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg> 英语文章
                </Link>
                <Link to={createPageUrl('AussieGenerator')} className="flex items-center gap-1.5 hover:text-[#FFCD00] text-emerald-300 font-bold transition-colors">
                  <Wand2 className="w-4 h-4" /> AI 生成器
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile nav */}
      <div className="md:hidden bg-slate-900 text-white border-t border-slate-800 flex justify-around p-3 text-xs">
        <Link to={createPageUrl('Home')} className="flex flex-col items-center gap-1">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link to={createPageUrl('AussieSentences')} className="flex flex-col items-center gap-1">
          <Quote className="w-5 h-5" />
          <span>口语</span>
        </Link>
        <Link to={createPageUrl('AussieDialogues')} className="flex flex-col items-center gap-1">
          <MessageCircle className="w-5 h-5" />
          <span>对话</span>
        </Link>
        <Link to={createPageUrl('AussieVocabulary')} className="flex flex-col items-center gap-1">
          <BookOpen className="w-5 h-5" />
          <span>短语</span>
        </Link>
        <Link to={createPageUrl('Articles')} className="flex flex-col items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-newspaper"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
          <span>文化</span>
        </Link>
        <Link to={createPageUrl('AussieGenerator')} className="flex flex-col items-center gap-1 text-emerald-300">
          <Wand2 className="w-5 h-5" />
          <span>生成器</span>
        </Link>
      </div>

      <main className="w-full">
        {children}
      </main>
    </div>
  );
}