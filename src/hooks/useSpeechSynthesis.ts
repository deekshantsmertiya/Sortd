import { useState, useEffect, useRef } from "react";

export function useSpeechSynthesis(text: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationTime, setDurationTime] = useState(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const startCharIndexRef = useRef<number>(0);
  const currentCharIndexRef = useRef<number>(0);

  // Estimate duration based on word count (approx 140 words per minute / 2.33 words per second)
  useEffect(() => {
    if (!text) {
      setDurationTime(0);
      return;
    }
    const words = text.split(/\s+/).filter(Boolean).length;
    const estimatedSeconds = Math.max(1, Math.round(words / 2.33));
    setDurationTime(estimatedSeconds);
    
    // Stop any active playing synthesis if the text changes
    stop();
  }, [text]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setCurrentTime(0);
    startCharIndexRef.current = 0;
    currentCharIndexRef.current = 0;
  };

  const pause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
    setIsPlaying(true);
  };

  const speakFromIndex = (startIndex: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Slice the text from the target index
    const slicedText = text.slice(startIndex);
    if (!slicedText.trim()) {
      stop();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(slicedText);
    utteranceRef.current = utterance;
    startCharIndexRef.current = startIndex;
    currentCharIndexRef.current = startIndex;

    utterance.rate = 1.0; // standard speaking speed

    utterance.onboundary = (event) => {
      if (event.name === "word" || event.name === "sentence") {
        const absoluteIndex = startCharIndexRef.current + event.charIndex;
        currentCharIndexRef.current = absoluteIndex;

        // Calculate progress
        const newProgress = Math.min(100, Math.max(0, (absoluteIndex / text.length) * 100));
        setProgress(newProgress);

        // Calculate elapsed time based on progress
        const elapsed = Math.round((newProgress / 100) * durationTime);
        setCurrentTime(elapsed);
      }
    };

    utterance.onend = () => {
      // Only reset to stopped if we didn't cancel due to a seek operation
      if (!window.speechSynthesis.speaking) {
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
        setCurrentTime(durationTime);
      }
    };

    utterance.onerror = (event) => {
      // Don't error out on 'interrupted' because seeking cancels the current speak
      if (event.error !== "interrupted") {
        console.error("SpeechSynthesisUtterance error:", event);
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const play = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPaused) {
      resume();
    } else {
      speakFromIndex(startCharIndexRef.current);
    }
  };

  const seek = (percentage: number) => {
    if (!text) return;
    const targetIndex = Math.floor((percentage / 100) * text.length);
    setProgress(percentage);
    const elapsed = Math.round((percentage / 100) * durationTime);
    setCurrentTime(elapsed);

    if (isPlaying) {
      speakFromIndex(targetIndex);
    } else {
      // If not currently playing, just update the index reference so that when they press play, it starts from here
      startCharIndexRef.current = targetIndex;
      currentCharIndexRef.current = targetIndex;
    }
  };

  return {
    isPlaying,
    isPaused,
    progress,
    currentTime,
    durationTime,
    play,
    pause,
    stop,
    seek,
  };
}
