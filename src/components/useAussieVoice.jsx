/**
 * Custom hook for natural-sounding Australian English TTS using Web Speech API.
 * Selects a British/Australian female or male voice from the browser's available voices.
 */
import { useCallback, useRef } from 'react';

function getBestVoice(gender = 'female') {
  const voices = window.speechSynthesis.getVoices();
  
  // Preferred voice names for Australian/British accent
  const preferredFemale = [
    'Karen', // macOS Australian female
    'Veena',
    'Moira',
    'Samantha',
    'Victoria',
    'Fiona',
    'Google UK English Female',
    'Microsoft Hazel Online (Natural) - English (United Kingdom)',
    'Microsoft Libby Online (Natural)',
    'Microsoft Mia Online (Natural)',
  ];
  const preferredMale = [
    'Daniel', // macOS British male
    'Lee',    // macOS Australian male
    'Google UK English Male',
    'Microsoft George Online (Natural) - English (United Kingdom)',
    'Microsoft Ryan Online (Natural)',
    'Microsoft Ravi Online (Natural) - English (India)',
  ];

  const preferred = gender === 'male' ? preferredMale : preferredFemale;

  // Try to find a preferred voice
  for (const name of preferred) {
    const v = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
    if (v) return v;
  }

  // Fallback: find any en-AU or en-GB voice
  const localCode = gender === 'male' ? ['en-AU', 'en-GB'] : ['en-AU', 'en-GB', 'en-US'];
  for (const code of localCode) {
    const filtered = voices.filter(v => v.lang === code);
    if (filtered.length > 0) {
      // prefer online/natural voices
      const natural = filtered.find(v => v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online'));
      return natural || filtered[0];
    }
  }

  // Last resort: any English voice
  return voices.find(v => v.lang.startsWith('en')) || (voices.length > 0 ? voices[0] : null);
}

export function useAussieVoice() {
  const utteranceRef = useRef(null);

  const speak = useCallback((text, gender = 'female', onEnd = null) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-AU';
    utterance.rate = 0.92;
    utterance.pitch = gender === 'male' ? 0.85 : 1.05;

    // Voices may not be loaded yet - wait for them
    const setVoiceAndSpeak = () => {
      const voice = getBestVoice(gender);
      if (voice) utterance.voice = voice;
      if (onEnd) utterance.onend = onEnd;
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      setVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        setVoiceAndSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, cancel };
}