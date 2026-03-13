import { useState, useRef, useCallback, useEffect } from 'react';

type VoiceState = 'idle' | 'listening' | 'speaking';

interface UseVoiceAssistantOptions {
  onTranscript: (text: string) => void;
  lang?: string;
}

export function useVoiceAssistant({ onTranscript, lang = 'en-US' }: UseVoiceAssistantOptions) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | number | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    const hasSynth = 'speechSynthesis' in window;
    setIsSupported(!!SpeechRec && hasSynth);

    if (SpeechRec) {
      const recognition = new SpeechRec();
      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setVoiceState('listening');
        setTranscript('');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }
        setTranscript(final || interim);
        if (final) {
          onTranscript(final.trim());
        }
      };

      recognition.onerror = () => {
        setVoiceState('idle');
        setTranscript('');
      };

      recognition.onend = () => {
        setVoiceState('idle');
      };

      recognitionRef.current = recognition;
    }

    if (hasSynth) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      recognitionRef.current?.abort();
      synthRef.current?.cancel();
    };
  }, [lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || voiceState === 'speaking') return;
    if (voiceState === 'listening') {
      recognitionRef.current.stop();
      return;
    }
    synthRef.current?.cancel();
    setSpeakingMessageId(null);
    try {
      recognitionRef.current.start();
    } catch {
      // already started
    }
  }, [voiceState]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setVoiceState('idle');
  }, []);

  const speakText = useCallback((text: string, messageId?: string | number) => {
    if (!synthRef.current) return;

    // If already speaking this message, stop it
    if (speakingMessageId === messageId) {
      synthRef.current.cancel();
      setSpeakingMessageId(null);
      setVoiceState('idle');
      return;
    }

    // Stop recognition and any current speech
    recognitionRef.current?.abort();
    synthRef.current.cancel();

    // Strip markdown syntax for cleaner TTS
    const clean = text
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/>\s/g, '')
      .replace(/[-*+]\s/g, '')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'en-US';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Pick a good English voice
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith('en') && (
        v.name.includes('Google') ||
        v.name.includes('Samantha') ||
        v.name.includes('Daniel') ||
        v.name.includes('Karen') ||
        v.name.includes('Moira')
      )
    ) || voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en'));

    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => {
      setVoiceState('speaking');
      setSpeakingMessageId(messageId ?? null);
    };

    utterance.onend = () => {
      setVoiceState('idle');
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setVoiceState('idle');
      setSpeakingMessageId(null);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [speakingMessageId]);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setSpeakingMessageId(null);
    setVoiceState('idle');
  }, []);

  return {
    voiceState,
    transcript,
    speakingMessageId,
    isSupported,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
  };
}
