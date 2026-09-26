import React, { useState, useRef } from 'react';
import {
  HeartPulse,
  Flame,
  Waves,
  Plane,
  ShieldAlert,
  Sprout,
  Car,
  CalendarDays,
  Sparkles,
  ArrowUpDown,
  Plus,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Persona, PersonaId, LanguageCode } from '../types';
import { PERSONAS } from '../data/personas';
import { getLocalizedPersona, t } from '../data/translations';

interface PersonaSelectorProps {
  activePersonaId: PersonaId;
  secondaryPersonaId?: PersonaId | null;
  onSelectPersona: (id: PersonaId) => void;
  onSelectSecondaryPersona?: (id: PersonaId | null) => void;
  language?: LanguageCode;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  activePersonaId,
  secondaryPersonaId = null,
  onSelectPersona,
  onSelectSecondaryPersona,
  language = 'en',
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const rawActive = PERSONAS.find((p) => p.id === activePersonaId) || PERSONAS[0];
  const activePersona = getLocalizedPersona(rawActive, language);

  const rawSecondary = secondaryPersonaId
    ? PERSONAS.find((p) => p.id === secondaryPersonaId) || null
    : null;
  const secondaryPersona = rawSecondary ? getLocalizedPersona(rawSecondary, language) : null;

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'HeartPulse':
        return <HeartPulse className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Waves':
        return <Waves className={className} />;
      case 'Plane':
        return <Plane className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Sprout':
        return <Sprout className={className} />;
      case 'Car':
        return <Car className={className} />;
      case 'CalendarDays':
        return <CalendarDays className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const handleCardClick = (id: PersonaId) => {
    if (id === activePersonaId) return;

    if (id === secondaryPersonaId) {
      // If clicking current secondary, toggle it off
      onSelectSecondaryPersona?.(null);
      return;
    }

    onSelectPersona(id);
  };

  const handleSecondaryToggle = (id: PersonaId, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSelectSecondaryPersona) return;

    if (secondaryPersonaId === id) {
      onSelectSecondaryPersona(null);
    } else {
      if (activePersonaId === id) {
        // Swap or pick another
        return;
      }
      onSelectSecondaryPersona(id);
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2 w-2 rounded-full bg-sky-600"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('personalizedDashboardProfile', language)}
            </h2>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium border border-slate-200">
              8 {t('profilesAvailable', language)}
            </span>

            {secondaryPersona ? (
              <span className="flex items-center gap-1.5 text-[11px] bg-violet-50 text-violet-800 font-semibold px-2.5 py-0.5 rounded-full border border-violet-200">
                <Layers className="w-3 h-3 text-violet-600" />
                <span>{t('hybridMode', language)}: {activePersona.title} + {secondaryPersona.title}</span>
                <button
                  onClick={() => onSelectSecondaryPersona?.(null)}
                  className="p-0.5 text-violet-500 hover:text-violet-800 rounded-full hover:bg-violet-100 transition-colors cursor-pointer"
                  title="Remove secondary profile"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                (Click "+ 2nd" on any card to enable Hybrid Mode)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 mr-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-sky-600" />
              <span>Select profile to reorder cards</span>
            </div>

            {/* Carousel navigation arrow buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => scrollCarousel('left')}
                className="p-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Scroll Left"
                aria-label="Scroll Personas Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="p-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Scroll Right"
                aria-label="Scroll Personas Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 8 Persona Pills - Horizontal Swipeable Carousel */}
        <div
          ref={carouselRef}
          className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory touch-pan-x"
        >
          {PERSONAS.map((rawP) => {
            const persona = getLocalizedPersona(rawP, language);
            const isPrimary = persona.id === activePersonaId;
            const isSecondary = persona.id === secondaryPersonaId;

            return (
              <div
                key={persona.id}
                onClick={() => handleCardClick(persona.id)}
                className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-left shrink-0 transition-all duration-200 border cursor-pointer select-none snap-start ${
                  isPrimary
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-sky-500/40'
                    : isSecondary
                    ? 'bg-violet-950 text-white border-violet-800 shadow-md ring-2 ring-violet-500/40'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isPrimary
                      ? 'bg-sky-500 text-white shadow-xs'
                      : isSecondary
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 group-hover:text-slate-900 shadow-2xs border border-slate-200'
                  }`}
                >
                  {renderIcon(persona.icon, 'w-4 h-4')}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs whitespace-nowrap">
                      {persona.title}
                    </span>
                    {isPrimary && (
                      <span className="text-[9px] bg-sky-500/30 text-sky-200 font-bold px-1.5 py-0.2 rounded border border-sky-400/40">
                        {t('primaryFocus', language)}
                      </span>
                    )}
                    {isSecondary && (
                      <span className="text-[9px] bg-violet-500/30 text-violet-200 font-bold px-1.5 py-0.2 rounded border border-violet-400/40">
                        {t('secondaryFocus', language)}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[10px] whitespace-nowrap ${
                      isPrimary
                        ? 'text-slate-300'
                        : isSecondary
                        ? 'text-violet-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {persona.badge}
                  </div>
                </div>

                {/* Optional Quick Secondary Button on card */}
                {!isPrimary && onSelectSecondaryPersona && (
                  <button
                    onClick={(e) => handleSecondaryToggle(persona.id, e)}
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded transition-colors font-medium cursor-pointer ${
                      isSecondary
                        ? 'bg-violet-700 text-white hover:bg-violet-600'
                        : 'bg-slate-200/70 text-slate-600 hover:bg-violet-100 hover:text-violet-800'
                    }`}
                    title={
                      isSecondary
                        ? 'Remove secondary profile'
                        : 'Add as Secondary Profile (Hybrid Mode)'
                    }
                  >
                    {isSecondary ? '✓ 2nd' : '+ 2nd'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Active Persona Banner Details */}
        <div className="mt-2.5 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-start sm:items-center gap-2 flex-wrap">
            <span className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded text-[10px] shrink-0 border border-sky-200">
              {t('primaryFocus', language)}
            </span>
            <span className="text-slate-900 font-semibold">{activePersona.title}:</span>
            <span className="text-slate-600 text-xs">{activePersona.description}</span>

            {secondaryPersona && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-300">
                <span className="bg-violet-100 text-violet-800 font-bold px-2 py-0.5 rounded text-[10px] shrink-0 border border-violet-200">
                  {t('secondaryFocus', language)}
                </span>
                <span className="text-slate-900 font-semibold">{secondaryPersona.title}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            {activePersona.targetFocus.map((f, i) => (
              <span
                key={i}
                className="bg-white text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-medium border border-slate-200 shadow-2xs"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
