import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";

export default function TTSPlayer({ paragraphs, onParagraphChange, onWordBoundary }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [accent, setAccent] = useState('US'); // 'US' or 'UK'
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    // Ensure voices are loaded early in some browsers
    if (synthRef.current && synthRef.current.getVoices().length === 0) {
      synthRef.current.onvoiceschanged = () => {};
    }
    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const play = () => {
    if (synthRef.current.speaking && synthRef.current.paused) {
      synthRef.current.resume();
      setIsPlaying(true);
      return;
    }

    if (!paragraphs || paragraphs.length === 0) return;

    synthRef.current.cancel();
    
    let startIndex = currentIndex === -1 ? 0 : currentIndex;
    speakParagraph(startIndex);
  };

  const speakParagraph = (index) => {
    if (index >= paragraphs.length) {
      setIsPlaying(false);
      setCurrentIndex(-1);
      onParagraphChange(-1);
      return;
    }

    setCurrentIndex(index);
    onParagraphChange(index);
    setIsPlaying(true);

    const textToSpeak = paragraphs[index].en;
    if (!textToSpeak) {
      speakParagraph(index + 1);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Prioritize high-quality natural/neural voices based on selected accent
    const voices = synthRef.current.getVoices();
    const isTargetAccent = (v) => accent === 'US' 
      ? (v.lang === 'en-US' || v.lang === 'en_US')
      : (v.lang === 'en-GB' || v.lang === 'en_GB');
    
    const isMale = (name) => name.includes('Male') || name.includes('Gordon') || name.includes('Russell') || name.includes('William') || name.includes('James') || name.includes('Neil') || name.includes('Mac');
    
    const bestVoice = voices.find(v => isTargetAccent(v) && isMale(v.name) && (v.name.includes('Online') || v.name.includes('Neural') || v.name.includes('Premium'))) 
                 || voices.find(v => isTargetAccent(v) && isMale(v.name) && (v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Natural')))
                 || voices.find(v => isTargetAccent(v) && isMale(v.name))
                 || voices.find(v => isTargetAccent(v));
                 
    if (bestVoice) utterance.voice = bestVoice;
    
    // Slightly slower reading pace for language learning
    utterance.rate = 0.9;
    
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        if (onWordBoundary) onWordBoundary(e.charIndex, e.charLength);
      }
    };
    
    utterance.onend = () => {
      if (onWordBoundary) onWordBoundary(-1, 0);
      speakParagraph(index + 1);
    };

    utterance.onerror = (e) => {
      console.error("Speech error", e);
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
  };

  const pause = () => {
    synthRef.current.pause();
    setIsPlaying(false);
  };

  const stop = () => {
    synthRef.current.cancel();
    setIsPlaying(false);
    setCurrentIndex(-1);
    onParagraphChange(-1);
    if (onWordBoundary) onWordBoundary(-1, 0);
  };

  return (
    <div className="flex items-center gap-3 p-5 bg-[#1e293b] rounded-t-xl text-white shadow-lg">
      <div className={`w-14 h-14 bg-black/40 rounded-full flex items-center justify-center border-2 ${isPlaying ? 'border-[#3b82f6] animate-pulse' : 'border-transparent'}`}>
         <div className="w-5 h-5 bg-[#3b82f6] rounded-full" />
      </div>
      <div className="flex-1 px-2">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-bold tracking-wider text-slate-200">ARTICLE AUDIO</div>
          <div className="flex bg-slate-800 rounded-md px-2 py-0.5 border border-slate-700">
            <span className="text-[10px] text-emerald-400 font-bold">OpenAI Voice</span>
          </div>
        </div>
        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#3b82f6] h-full transition-all duration-500 ease-out"
            style={{ width: `${currentIndex >= 0 && paragraphs?.length > 0 ? ((currentIndex + 1) / paragraphs.length) * 100 : 0}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-1">
        {isLoading ? (
          <Button variant="ghost" size="icon" disabled className="text-slate-400 rounded-full w-10 h-10">
            <Loader2 className="w-5 h-5 animate-spin" />
          </Button>
        ) : isPlaying ? (
          <Button variant="ghost" size="icon" onClick={pause} className="text-white hover:text-[#3b82f6] hover:bg-white/10 rounded-full w-10 h-10">
            <Pause className="w-5 h-5" fill="currentColor" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={play} className="text-white hover:text-[#3b82f6] hover:bg-white/10 rounded-full w-10 h-10">
            <Play className="w-5 h-5" fill="currentColor" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={stop} className="text-white hover:text-[#3b82f6] hover:bg-white/10 rounded-full w-10 h-10">
          <Square className="w-4 h-4" fill="currentColor" />
        </Button>
      </div>
    </div>
  );
}