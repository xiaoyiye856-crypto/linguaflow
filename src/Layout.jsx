import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Globe, Home, Quote, MessageCircle, BookOpen } from 'lucide-react';

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
                  <BookOpen className="w-4 h-4" /> 核心词汇
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
          <span>词汇</span>
        </Link>
      </div>

      <main className="w-full">
        {children}
      </main>
    </div>
  );
}