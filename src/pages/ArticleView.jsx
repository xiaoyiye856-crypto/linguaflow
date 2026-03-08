import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TTSPlayer from '@/components/TTSPlayer';
import { useAussieVoice } from '@/components/useAussieVoice';

// Article titles with Chinese translations
const TITLE_ZH = {
  'The Art of Greeting in Australia': '澳洲问候的艺术',
  'Understanding Australian Communication Styles': '了解澳洲沟通方式',
  'Understanding Australian Culture': '了解澳洲文化',
  "Australia Culture:Helpful Do's and Don'ts": '澳洲文化：行为守则',
  'Navigating Etiquette in Australia: A Friendly Guide': '澳洲礼仪指南',
  'Multiculturalism and Identity in Australia': '澳洲的多元文化与身份认同',
  "Understanding Australia's Indigenous Heritage": '了解澳洲原住民文化遗产',
  'The Evolution of Family in Australia': '澳洲家庭结构的演变',
};

function VocabTooltip({ word, meaning, phonetic, partOfSpeech, onPlay, isPlaying }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline">
      <button
        onClick={() => setOpen(o => !o)}
        className="bg-amber-100 text-slate-900 px-1 py-0.5 mx-0.5 rounded cursor-pointer hover:bg-amber-200 transition-colors font-medium border-b-2 border-amber-400"
      >
        {word}
      </button>
      {open && (
        <>
          <span className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[#1e293b] text-white rounded-xl shadow-2xl p-3 text-left pointer-events-auto">
            <span className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold text-base">{word}</span>
              <button onClick={() => onPlay(word)} className="p-1 rounded-full hover:bg-white/20">
                <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-yellow-300' : 'text-white/70'}`} />
              </button>
            </span>
            {phonetic && <span className="text-xs text-slate-300 font-mono block mb-1">[{phonetic}]</span>}
            {partOfSpeech && <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded mr-1">{partOfSpeech}</span>}
            <span className="text-sm text-amber-200 font-medium">{meaning}</span>
            <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#1e293b]" />
          </span>
        </>
      )}
    </span>
  );
}

function HighlightedText({ text, vocabulary, isActive, activeCharIndex, activeCharLength, onPlayWord, playingWord }) {
  if (!text) return null;

  const vocabMap = {};
  (vocabulary || []).forEach(v => { if (v.word) vocabMap[v.word.toLowerCase()] = v; });

  // Build segments with vocab awareness
  const words = Object.keys(vocabMap).sort((a, b) => b.length - a.length);
  if (words.length === 0 && !isActive) return <span>{text}</span>;

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const vocabRegex = words.length > 0
    ? new RegExp(`\\b(${words.map(escapeRegExp).join('|')})\\b`, 'gi')
    : null;

  // Split text into segments: plain or vocab
  const segments = [];
  let lastIndex = 0;
  if (vocabRegex) {
    let match;
    while ((match = vocabRegex.exec(text)) !== null) {
      if (match.index > lastIndex) segments.push({ type: 'plain', text: text.slice(lastIndex, match.index), start: lastIndex });
      segments.push({ type: 'vocab', text: match[0], start: match.index, vocabKey: match[0].toLowerCase() });
      lastIndex = match.index + match[0].length;
    }
  }
  if (lastIndex < text.length) segments.push({ type: 'plain', text: text.slice(lastIndex), start: lastIndex });

  return (
    <span>
      {segments.map((seg, i) => {
        if (seg.type === 'vocab') {
          const v = vocabMap[seg.vocabKey];
          return (
            <VocabTooltip
              key={i}
              word={seg.text}
              meaning={v?.meaning}
              phonetic={v?.phonetic}
              partOfSpeech={v?.part_of_speech}
              onPlay={onPlayWord}
              isPlaying={playingWord === seg.text}
            />
          );
        }
        // Plain text — handle spoken highlight
        if (!isActive || activeCharIndex < 0) return <span key={i}>{seg.text}</span>;
        const segStart = seg.start;
        const segEnd = seg.start + seg.text.length;
        const spokenEnd = activeCharIndex + (activeCharLength || 1);
        if (activeCharIndex >= segEnd || spokenEnd <= segStart) return <span key={i}>{seg.text}</span>;
        // overlap
        const relStart = Math.max(0, activeCharIndex - segStart);
        const relEnd = Math.min(seg.text.length, spokenEnd - segStart);
        return (
          <span key={i}>
            <span>{seg.text.slice(0, relStart)}</span>
            <span className="bg-blue-600 text-white rounded-sm px-0.5 mx-[1px] shadow-sm">{seg.text.slice(relStart, relEnd)}</span>
            <span>{seg.text.slice(relEnd)}</span>
          </span>
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
  const [playingWord, setPlayingWord] = useState(null);
  const { speak } = useAussieVoice();

  const playWord = (word) => {
    setPlayingWord(word);
    speak(word, 'female', () => setPlayingWord(null));
  };

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

  const titleZh = TITLE_ZH[article.title];

  return (
    <div className="bg-white min-h-screen">
      {/* Newspaper Top Header */}
      <div className="bg-[#1e293b] text-white px-6 py-4 flex items-center justify-between border-b-4 border-[#3b82f6] shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link to={createPageUrl('Articles')}>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 text-white font-bold px-4 py-1 rounded text-sm tracking-widest shadow-inner">
              澳洲文化
            </div>
            <div className="hidden md:block h-6 w-px bg-slate-600"></div>
            <span className="font-serif italic text-sm text-slate-300 tracking-wide hidden sm:block">
              深入了解澳洲文化与生活
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row shadow-2xl bg-white min-h-screen">

        {/* Main Content Area (Left Column) */}
        <div className="lg:w-[68%] p-8 lg:p-14 lg:border-r border-slate-200">
          <h1 className="text-4xl lg:text-[44px] font-serif font-bold text-slate-900 leading-[1.15] mb-2 pb-4 border-b-2 border-slate-100">
            {article.title}
          </h1>
          {titleZh && (
            <p className="text-xl text-slate-500 font-sans mb-8">{titleZh}</p>
          )}

          {article.image_url && (
            <div className="mb-12 relative group">
              <img src={article.image_url} alt={article.title} className="w-full max-h-[500px] object-cover bg-slate-100 shadow-sm" />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
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
                    onPlayWord={playWord}
                    playingWord={playingWord}
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
          </div>
        </div>

        {/* Sidebar Area (Right Column) */}
        <div className="lg:w-[32%] bg-[#f8fafc] border-l border-white shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)] relative">
          <div className="sticky top-16 space-y-0 h-[calc(100vh-4rem)] overflow-y-auto pb-12 custom-scrollbar">

            {/* Audio Player */}
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
                        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-1 bg-[#4c5c7d] text-white">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-xl font-serif">{v.word}</span>
                            <span className="text-sm font-mono opacity-80 tracking-wide">[{v.phonetic}]</span>
                          </div>
                          <button onClick={() => playWord(v.word)} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                            <Volume2 className={`w-5 h-5 ${playingWord === v.word ? 'opacity-100 text-yellow-300' : 'opacity-80 hover:opacity-100'}`} />
                          </button>
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
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}