
import { useState, useEffect, useCallback } from 'react';
import type { Language } from '../types';

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const updateVoices = useCallback(() => {
    setVoices(window.speechSynthesis.getVoices());
  }, []);

  useEffect(() => {
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [updateVoices]);

  const speak = useCallback((text: string, lang: Language) => {
    if (!text || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const selectedVoice = voices.find(voice => voice.lang === lang && voice.name.includes('Google'));
    utterance.voice = selectedVoice || voices.find(voice => voice.lang === lang) || null;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voices]);

  return { speak, isSpeaking };
};
