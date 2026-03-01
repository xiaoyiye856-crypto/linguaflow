import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Loader2 } from "lucide-react";
import { base44 } from '@/api/base44Client';

export default function TTSPlayer({ paragraphs, onParagraphChange, onWordBoundary }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const play = () => {
    if (audioRef.current && audioRef.current.paused && audioRef.current.src) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    if (!paragraphs || paragraphs.length === 0) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    let startIndex = currentIndex === -1 ? 0 : currentIndex;
    speakParagraph(startIndex);
  };

  const speakParagraph = async (index) => {
    if (index >= paragraphs.length) {
      setIsPlaying(false);
      setCurrentIndex(-1);
      onParagraphChange(-1);
      return;
    }

    setCurrentIndex(index);
    onParagraphChange(index);
    
    const textToSpeak = paragraphs[index].en;
    if (!textToSpeak) {
      speakParagraph(index + 1);
      return;
    }

    setIsLoading(true);
    try {
      const res = await base44.functions.invoke('generateAudio', { text: textToSpeak });
      setIsLoading(false);
      if (res.data && res.data.audio) {
        const audio = new Audio(res.data.audio);
        audioRef.current = audio;
        setIsPlaying(true);
        
        audio.onended = () => {
          if (onWordBoundary) onWordBoundary(-1, 0);
          speakParagraph(index + 1);
        };

        audio.onerror = (e) => {
          console.error("Audio playback error", e);
          setIsPlaying(false);
        };

        audio.play();
      }
    } catch(e) {
      console.error(e);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsLoading(false);
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