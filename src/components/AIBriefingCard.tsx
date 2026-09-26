import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  RefreshCw,
  Clock,
  ShieldCheck,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Square,
  Share2,
  Download,
  X,
  Info,
  Loader2,
} from 'lucide-react';
import { AIBriefing, Persona, City, WeatherData, AlertColor, LanguageCode } from '../types';
import { ExportAdvisoryModal } from './ExportAdvisoryModal';
import {
  TTS_LANGUAGE_CONFIG,
  t,
  findBestVoiceForLanguage,
  getLocalizedBriefing,
  getSpokenBriefingText,
  getCloudTtsLangCode,
} from '../data/translations';

interface AIBriefingCardProps {
  briefing: AIBriefing | null;
  loading: boolean;
  onRegenerate: () => void;
  persona: Persona;
  secondaryPersona?: Persona | null;
  city: City;
  weather: WeatherData;
  language?: LanguageCode;
}

export const AIBriefingCard: React.FC<AIBriefingCardProps> = ({
  briefing,
  loading,
  onRegenerate,
  persona,
  secondaryPersona = null,
  city,
  weather,
  language = 'en',
}) => {
  const [ttsState, setTtsState] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef<number>(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeTextRef = useRef<string>('');

  // Load browser voices for Web Speech API fallback
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const v = synth.getVoices();
      if (v && v.length > 0) {
        setVoices(v);
      }
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;
    const timer = setTimeout(loadVoices, 250);

    return () => {
      clearTimeout(timer);
      if (synth.onvoiceschanged === loadVoices) {
        synth.onvoiceschanged = null;
      }
    };
  }, []);

  // Stop and clean up all audio and speech synthesis
  const stopAllTts = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.onplaying = null;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }
    chunksRef.current = [];
    currentChunkIndexRef.current = 0;
    setTtsState('idle');
  }, []);

  // Stop speech when briefing, city, persona, or language changes
  useEffect(() => {
    stopAllTts();
    return () => {
      stopAllTts();
    };
  }, [briefing, city.id, persona.id, secondaryPersona?.id, language, stopAllTts]);

  const activeBriefing = getLocalizedBriefing(
    briefing,
    language,
    persona,
    secondaryPersona,
    city,
    weather
  );

  /**
   * Secondary Fallback: Browser Web Speech API
   * Used if audio stream fails (offline mode, CORS, or audio playback block).
   * For regional Indian languages (Marathi, Nepali, Gujarati, etc.),
   * maps them to the 'hi-IN' (Hindi) voice engine so Devanagari phonetics sound natural.
   */
  const fallbackToWebSpeech = useCallback(
    (textToSpeak: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        stopAllTts();
        return;
      }

      const synth = window.speechSynthesis;
      synth.cancel();

      const availableVoices = synth.getVoices().length > 0 ? synth.getVoices() : voices;
      const voiceMatch = findBestVoiceForLanguage(availableVoices, language);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;

      if (voiceMatch.voice) {
        utterance.voice = voiceMatch.voice;
      }
      utterance.lang = voiceMatch.langCode;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setTtsState('playing');
      };
      utterance.onend = () => {
        setTtsState('idle');
        utteranceRef.current = null;
      };
      utterance.onerror = (e) => {
        console.warn('Speech synthesis fallback error:', e);
        setTtsState('idle');
        utteranceRef.current = null;
      };

      synth.speak(utterance);
    },
    [language, voices, stopAllTts]
  );

  /**
   * Helper to split text into <= 190 character natural segments
   */
  const createTtsChunks = (text: string, maxLen = 190): string[] => {
    if (!text) return [];
    if (text.length <= maxLen) return [text];

    const pieces = text.match(/[^।\.!\?]+[।\.!\?]+|\S+/g) || [text];
    const chunks: string[] = [];
    let current = '';

    for (const piece of pieces) {
      if ((current + ' ' + piece).trim().length <= maxLen) {
        current = (current + ' ' + piece).trim();
      } else {
        if (current.trim()) chunks.push(current.trim());
        if (piece.length <= maxLen) {
          current = piece.trim();
        } else {
          for (let i = 0; i < piece.length; i += maxLen) {
            chunks.push(piece.slice(i, i + maxLen).trim());
          }
          current = '';
        }
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks.length > 0 ? chunks : [text.slice(0, 200)];
  };

  /**
   * Primary: Cloud TTS Audio Stream via Google Translate Audio
   */
  const playCloudTtsChunk = useCallback(
    (chunks: string[], index: number, fullText: string) => {
      if (index >= chunks.length) {
        stopAllTts();
        return;
      }

      currentChunkIndexRef.current = index;
      const chunk = chunks[index];
      const selectedLangCode = getCloudTtsLangCode(language);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${selectedLangCode}&client=tw-ob&q=${encodeURIComponent(
        chunk.slice(0, 200)
      )}`;

      const audio = new Audio(ttsUrl);
      audioRef.current = audio;

      audio.onplaying = () => {
        setTtsState('playing');
      };

      audio.onended = () => {
        if (currentChunkIndexRef.current + 1 < chunksRef.current.length) {
          playCloudTtsChunk(chunksRef.current, currentChunkIndexRef.current + 1, fullText);
        } else {
          stopAllTts();
        }
      };

      audio.onerror = (e) => {
        console.warn('Cloud audio stream unavailable, falling back to Web Speech API:', e);
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
        fallbackToWebSpeech(fullText);
      };

      audio.play().catch((err) => {
        console.warn('Cloud audio stream playback blocked, falling back to Web Speech API:', err);
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
        fallbackToWebSpeech(fullText);
      });
    },
    [language, stopAllTts, fallbackToWebSpeech]
  );

  const handleToggleTts = () => {
    // 1. If currently playing -> Pause
    if (ttsState === 'playing') {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setTtsState('paused');
        return;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        setTtsState('paused');
        return;
      }
    }

    // 2. If currently paused -> Resume
    if (ttsState === 'paused') {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => setTtsState('playing'))
          .catch(() => {
            fallbackToWebSpeech(activeTextRef.current);
          });
        return;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setTtsState('playing');
        return;
      }
    }

    // 3. If idle -> Start Primary Cloud TTS Audio Stream
    stopAllTts();
    setTtsState('loading');

    const spokenText = getSpokenBriefingText(
      briefing,
      language,
      city,
      weather,
      persona,
      secondaryPersona
    );
    activeTextRef.current = spokenText;

    const chunks = createTtsChunks(spokenText);
    chunksRef.current = chunks;
    currentChunkIndexRef.current = 0;

    playCloudTtsChunk(chunks, 0, spokenText);
  };

  const handleStopTts = () => {
    stopAllTts();
  };

  const getAlertBorder = (level: AlertColor) => {
    switch (level) {
      case 'red':
        return 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/70 via-white to-white';
      case 'orange':
        return 'border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50/70 via-white to-white';
      case 'yellow':
        return 'border-l-4 border-l-yellow-400 bg-gradient-to-r from-yellow-50/70 via-white to-white';
      case 'green':
      default:
        return 'border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50/70 via-white to-white';
    }
  };

  return (
    <>
      <div
        className={`rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 relative overflow-hidden transition-all ${getAlertBorder(
          weather.alertLevel
        )}`}
      >
        {/* Decorative Meteorological Lines */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-sky-100/40 via-transparent to-transparent pointer-events-none rounded-bl-full" />

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900 font-display break-words">
                  {t('imdSynopticBriefing', language)}
                </h3>
                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-200 shrink-0">
                  {persona.title}
                </span>
                {secondaryPersona && (
                  <span className="bg-violet-100 text-violet-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-200 shrink-0">
                    + {secondaryPersona.title} ({t('hybridMode', language)})
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 break-words mt-0.5">
                {t('personalizedSynthesis', language)} • {city.name}, {city.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center flex-wrap shrink-0">
            {/* Hybrid TTS Voice Player */}
            {activeBriefing && (
              <div className="flex items-center bg-sky-50 border border-sky-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  onClick={handleToggleTts}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-sky-800 hover:text-sky-900 hover:bg-sky-100/80 rounded transition-colors cursor-pointer"
                  title={
                    ttsState === 'playing'
                      ? 'Pause Voice Briefing'
                      : ttsState === 'paused'
                      ? 'Resume Voice Briefing'
                      : ttsState === 'loading'
                      ? 'Connecting Audio Stream...'
                      : `Listen to Voice Briefing (${language.toUpperCase()} TTS)`
                  }
                >
                  {ttsState === 'loading' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 text-sky-700 animate-spin" />
                      <span className="text-[11px] font-medium">{t('loadingVoice', language)}</span>
                    </>
                  ) : ttsState === 'playing' ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-sky-700 fill-sky-700" />
                      {/* Active Audio Wave Animation */}
                      <div className="flex items-center gap-0.5 h-3.5 px-0.5" aria-hidden="true">
                        <span className="w-0.5 h-2.5 bg-sky-600 rounded-full animate-audio-wave-1" />
                        <span className="w-0.5 h-3.5 bg-sky-600 rounded-full animate-audio-wave-2" />
                        <span className="w-0.5 h-2 bg-sky-600 rounded-full animate-audio-wave-3" />
                        <span className="w-0.5 h-3 bg-sky-600 rounded-full animate-audio-wave-4" />
                      </div>
                      <span className="text-[11px] font-medium">{t('pauseVoice', language)}</span>
                    </>
                  ) : ttsState === 'paused' ? (
                    <>
                      <Play className="w-3.5 h-3.5 text-sky-700 fill-sky-700" />
                      <span className="text-[11px] font-medium">{t('resumeVoice', language)}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                      <span className="text-[11px] font-medium">{t('listenVoice', language)}</span>
                      <span className="text-[9px] bg-sky-200/70 text-sky-800 px-1 rounded font-bold uppercase">
                        {language}
                      </span>
                    </>
                  )}
                </button>

                {ttsState !== 'idle' && (
                  <button
                    onClick={handleStopTts}
                    className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title={t('stopVoice', language)}
                  >
                    <Square className="w-3 h-3 fill-current" />
                  </button>
                )}
              </div>
            )}

            {/* Export Advisory Button */}
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Export or print official IMD citizen advisory"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span>{t('exportPdf', language)}</span>
            </button>

            {/* Regenerate AI */}
            <button
              onClick={onRegenerate}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 transition-colors cursor-pointer"
              title="Generate fresh AI briefing"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-600' : ''}`} />
              <span className="hidden sm:inline">{loading ? t('analyzing', language) : t('refreshAi', language)}</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        {loading ? (
          <div className="space-y-3 py-2 animate-pulse">
            <div className="h-5 bg-slate-200 rounded-md w-3/4" />
            <div className="h-4 bg-slate-200 rounded-md w-full" />
            <div className="h-4 bg-slate-200 rounded-md w-5/6" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-slate-200 rounded-full w-24" />
              <div className="h-6 bg-slate-200 rounded-full w-32" />
              <div className="h-6 bg-slate-200 rounded-full w-28" />
            </div>
          </div>
        ) : activeBriefing ? (
          <div className="space-y-3.5">
            {/* Punchy Headline */}
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="shrink-0 mt-1">
                {weather.alertLevel === 'red' || weather.alertLevel === 'orange' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug break-words flex-1 min-w-0">
                {activeBriefing.headline}
              </h4>
            </div>

            {/* Tailored Impact & Recommendation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs sm:text-sm">
              <div className="bg-white/90 rounded-xl p-3 sm:p-3.5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 flex-wrap">
                    <Compass className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="break-words">
                      {secondaryPersona
                        ? `${t('hybridMode', language)} (${persona.title} + ${secondaryPersona.title})`
                        : t('todaysPersonaImpact', language)}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-xs sm:text-sm break-words">
                    {activeBriefing.tailoredImpact}
                  </p>
                </div>
              </div>

              <div className="bg-white/90 rounded-xl p-3 sm:p-3.5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 flex-wrap">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="break-words">{t('officialActionAdvisory', language)}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-xs sm:text-sm font-medium break-words">
                    {activeBriefing.actionRecommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* Golden Window and Key Highlight Metrics */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
              {activeBriefing.goldenWindow && (
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold border border-amber-200 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{t('goldenWindow', language)}: </span>
                  <span className="text-amber-800 font-bold">{activeBriefing.goldenWindow}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 flex-wrap">
                {activeBriefing.keyMetrics?.map((metric, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-medium border border-slate-200 shadow-2xs break-words"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Export Advisory Modal */}
      <ExportAdvisoryModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        city={city}
        weather={weather}
        primaryPersona={persona}
        secondaryPersona={secondaryPersona}
        briefing={activeBriefing}
      />
    </>
  );
};

