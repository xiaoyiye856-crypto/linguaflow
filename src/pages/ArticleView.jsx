import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TTSPlayer from '@/components/TTSPlayer';

function HighlightedText({ text, vocabulary, isActive, activeCharIndex, activeCharLength }) {
  if (!text) return null;
  
  const chars = text.split('');
  const classMap = new Array(chars.length).fill('');
  
  // 1. Mark vocabulary
  const words = (vocabulary || []).map(v => v.word).filter(Boolean);
  if (words.length > 0) {
    words.sort((a, b) => b.length - a.length);
    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${words.map(escapeRegExp).join('|')})\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      for (let i = start; i < end; i++) {
        classMap[i] += ' is-vocab';
      }
    }
  }
  
  // 2. Mark currently spoken word
  if (isActive && activeCharIndex >= 0) {
    let length = activeCharLength || 0;
    if (length === 0) {
      const remaining = text.slice(activeCharIndex);
      const match = remaining.match(/^[a-zA-Z0-9_'-]+/);
      length = match ? match[0].length : 1;
    }
    const end = activeCharIndex + length;
    for (let i = activeCharIndex; i < end && i < chars.length; i++) {
      classMap[i] += ' is-spoken';
    }
  }
  
  // 3. Group characters by classMap
  const segments = [];
  if (chars.length > 0) {
    let currentClass = classMap[0];
    let currentText = chars[0];
    for (let i = 1; i < chars.length; i++) {
      if (classMap[i] === currentClass) {
        currentText += chars[i];
      } else {
        segments.push({ text: currentText, classes: currentClass });
        currentClass = classMap[i];
        currentText = chars[i];
      }
    }
    segments.push({ text: currentText, classes: currentClass });
  }
  
  return (
    <span>
      {segments.map((seg, i) => {
        let className = "";
        const isVocab = seg.classes.includes('is-vocab');
        const isSpoken = seg.classes.includes('is-spoken');
        
        if (isSpoken) {
          className = "bg-blue-600 text-white rounded-sm transition-colors duration-75 px-0.5 mx-[1px] shadow-sm";
        } else if (isVocab) {
          className = "bg-slate-200 text-[#1e293b] px-1.5 py-0.5 mx-0.5 rounded cursor-help transition-colors hover:bg-blue-200";
        }
        
        return className ? (
          <span key={i} className={className} title={isVocab && !isSpoken ? "See vocabulary list for details" : undefined}>
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        );
      })}
    </span>
  );
}

export default function ArticleView() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const [activeParagraph, setActiveParagraph] = useState(-1);
  const [activeCharIndex, setActiveCharIndex] = useState(-1);
  const [activeCharLength, setActiveCharLength] = useState(0);

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => base44.entities.Article.get(id),
    enabled: !!id
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (!article) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Article not found</h2>
      <Link to={createPageUrl('Home')}><Button>Return Home</Button></Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Newspaper Top Header */}
      <div className="bg-[#1e293b] text-white px-6 py-4 flex items-center justify-between border-b-4 border-[#3b82f6] shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-white text-[#1e293b] font-bold px-4 py-1 rounded text-sm tracking-widest shadow-inner">
              新闻
            </div>
            <div className="hidden md:block h-6 w-px bg-slate-600"></div>
            <span className="font-serif italic text-sm text-slate-300 tracking-wide hidden sm:block">
              Daily Reading & Efficient Vocabulary
            </span>
          </div>
        </div>
        <div className="text-sm font-mono tracking-widest text-slate-300 font-medium">
          DATE: {new Date(article.created_date).toLocaleDateString().replace(/\//g, '.')}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row shadow-2xl bg-white min-h-screen">
        
        {/* Main Content Area (Left Column) */}
        <div className="lg:w-[68%] p-8 lg:p-14 lg:border-r border-slate-200">
          <h1 className="text-4xl lg:text-[44px] font-serif font-bold text-slate-900 leading-[1.15] mb-8 pb-8 border-b-2 border-slate-100">
            {article.title}
          </h1>

          {article.image_url && (
            <div className="mb-12 relative group">
              <img src={article.image_url} alt={article.title} className="w-full max-h-[500px] object-cover bg-slate-100 shadow-sm" />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-xs px-3 py-1 font-mono tracking-widest uppercase">
                BREAKING NEWS
              </div>
            </div>
          )}

          <div className="space-y-12">
            {article.paragraphs?.map((p, idx) => (
              <div 
                key={idx} 
                className={`transition-all duration-500 rounded-xl ${activeParagraph === idx ? 'bg-blue-50/60 p-6 -mx-6 shadow-sm border border-blue-100' : 'p-2 -mx-2'}`}
              >
                <p className="text-xl lg:text-[22px] font-serif text-slate-900 leading-relaxed mb-5 text-justify">
                  <HighlightedText 
                    text={p.en} 
                    vocabulary={article.vocabulary} 
                    isActive={activeParagraph === idx}
                    activeCharIndex={activeCharIndex}
                    activeCharLength={activeCharLength}
                  />
                </p>
                <p className="text-base lg:text-[17px] text-slate-600 font-sans leading-relaxed tracking-wide text-justify">
                  {p.zh}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-wrap items-center gap-4 bg-slate-50 p-6 rounded-2xl">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mr-2">Links:</span>
            {article.source_url && (
              <a href={article.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 hover:bg-blue-50 bg-white border border-slate-200 px-4 py-2 rounded-full transition-colors font-medium">
                <ExternalLink className="w-4 h-4" /> Original Source
              </a>
            )}
            {article.reference_url && (
              <a href={article.reference_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-purple-600 hover:bg-purple-50 bg-white border border-slate-200 px-4 py-2 rounded-full transition-colors font-medium">
                <ExternalLink className="w-4 h-4" /> External Reference
              </a>
            )}
            <div className="flex-1"></div>
            <Link to={`${createPageUrl('Generator')}?id=${article.id}`}>
               <Button variant="outline" className="rounded-full gap-2 border-slate-300">
                 <Edit3 className="w-4 h-4" /> Edit Article
               </Button>
            </Link>
          </div>
        </div>

        {/* Sidebar Area (Right Column) */}
        <div className="lg:w-[32%] bg-[#f8fafc] border-l border-white shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)] relative">
          <div className="sticky top-16 space-y-0 h-[calc(100vh-4rem)] overflow-y-auto pb-12 custom-scrollbar">
            
            {/* Audio Player pinned at the top of the sidebar */}
            <div className="z-10 bg-[#f8fafc] pt-8 px-6 pb-6">
              <TTSPlayer 
                paragraphs={article.paragraphs} 
                onParagraphChange={(idx) => {
                  setActiveParagraph(idx);
                  setActiveCharIndex(-1);
                  setActiveCharLength(0);
                }}
                onWordBoundary={(idx, len) => {
                  setActiveCharIndex(idx);
                  setActiveCharLength(len);
                }}
              />
            </div>

            <div className="px-6 space-y-10">
              {/* Vocabulary Section */}
              {article.vocabulary && article.vocabulary.length > 0 && (
                <div>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-px bg-slate-300 flex-1" />
                    <h3 className="text-[15px] font-black text-slate-800 tracking-[0.2em]">核心词汇</h3>
                    <div className="h-px bg-slate-300 flex-1" />
                  </div>
                  
                  <div className="space-y-4">
                    {article.vocabulary.map((v, i) => (
                      <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="px-5 py-3 border-b border-slate-100 flex flex-col gap-1 bg-[#4c5c7d] text-white">
                          <span className="font-bold text-xl font-serif">{v.word}</span>
                          <span className="text-sm font-mono opacity-80 tracking-wide">[{v.phonetic}]</span>
                        </div>
                        <div className="px-5 py-3 bg-[#4c5c7d] text-white">
                          <span className="text-sm font-bold opacity-90 mr-2 bg-white/20 px-1.5 py-0.5 rounded">{v.part_of_speech}</span>
                          <span className="text-base font-medium opacity-95">{v.meaning}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expressions Section */}
              {article.expressions && article.expressions.length > 0 && (
                <div className="pt-4">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-px bg-slate-300 flex-1" />
                    <h3 className="text-[15px] font-black text-slate-800 tracking-[0.2em]">重要表达</h3>
                    <div className="h-px bg-slate-300 flex-1" />
                  </div>
                  
                  <div className="space-y-4">
                    {article.expressions.map((e, i) => (
                      <div key={i} className="bg-white border border-slate-200 border-l-4 border-l-[#d4af37] rounded-r-xl p-5 shadow-sm">
                        <div className="font-bold text-slate-900 text-lg mb-1">{e.phrase}</div>
                        <div className="text-sm font-medium text-slate-600 mb-3">{e.meaning}</div>
                        <div className="text-[15px] text-slate-500 italic font-serif leading-relaxed border-t border-dashed border-slate-200 pt-3">
                          "{e.example}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}} />
    </div>
  );
}