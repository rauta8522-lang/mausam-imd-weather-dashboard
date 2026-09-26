import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Globe, X, Check, Sparkles } from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/translations';

interface LanguageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

type TabCategory = 'all' | 'indian' | 'international';

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearch('');
      setActiveTab('all');
    }
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter languages
  const filteredLanguages = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SUPPORTED_LANGUAGES.filter((item) => {
      // Category filter
      if (activeTab === 'indian' && item.category !== 'indian') {
        return false;
      }
      if (activeTab === 'international' && item.category !== 'international') {
        return false;
      }

      // Search filter
      if (!q) return true;
      return (
        item.label.toLowerCase().includes(q) ||
        item.nativeLabel.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.script && item.script.toLowerCase().includes(q)) ||
        item.bcp47.toLowerCase().includes(q)
      );
    });
  }, [search, activeTab]);

  // Group languages by category
  const indianLanguages = useMemo(
    () => filteredLanguages.filter((l) => l.category === 'indian'),
    [filteredLanguages]
  );

  const internationalLanguages = useMemo(
    () => filteredLanguages.filter((l) => l.category === 'international'),
    [filteredLanguages]
  );

  const totalIndianCount = SUPPORTED_LANGUAGES.filter(
    (l) => l.category === 'indian'
  ).length;
  const totalInternationalCount = SUPPORTED_LANGUAGES.filter((l) => l.category === 'international').length;

  if (!isOpen) return null;

  const handleSelect = (code: LanguageCode) => {
    onSelectLanguage(code);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="language-selector-modal"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Indian Tricolor Accent */}
        <div className="h-1 w-full flex shrink-0">
          <div className="flex-1 bg-amber-500" />
          <div className="flex-1 bg-slate-200" />
          <div className="flex-1 bg-emerald-600" />
        </div>

        {/* Modal Title & Close Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Choose Language / भाषा चुनें
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full border border-sky-200">
                  <Sparkles className="w-3 h-3 text-sky-600" /> 31 Languages
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                All 22 Indian Scheduled Languages + English & Major International Languages
              </p>
            </div>
          </div>
          <button
            id="btn-close-lang-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 bg-white shrink-0 space-y-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              id="language-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language by name, script, or code (e.g. Hindi, தமிழ், বাংলা, es)..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              All Languages ({SUPPORTED_LANGUAGES.length})
            </button>
            <button
              onClick={() => setActiveTab('indian')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'indian'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              Indian Regional ({totalIndianCount})
            </button>
            <button
              onClick={() => setActiveTab('international')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'international'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
              Major Global ({totalInternationalCount})
            </button>
          </div>
        </div>

        {/* Scrollable Languages List */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1 min-h-[260px]">
          {filteredLanguages.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Globe className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">No matching languages found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for "{search}" in English name or native script
              </p>
            </div>
          ) : (
            <>
              {/* Indian Regional Languages Section */}
              {indianLanguages.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Official & Regional Indian Languages ({indianLanguages.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      22 Scheduled Languages of India
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {indianLanguages.map((lang) => {
                      const isSelected = selectedLanguage === lang.code;
                      return (
                        <button
                          key={lang.code}
                          id={`lang-opt-${lang.code}`}
                          onClick={() => handleSelect(lang.code)}
                          className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                            isSelected
                              ? 'bg-sky-50/80 border-sky-500 text-sky-950 shadow-xs ring-1 ring-sky-500/30'
                              : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                                isSelected
                                  ? 'bg-sky-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                              }`}
                            >
                              {lang.code.toUpperCase()}
                            </div>
                            <div className="truncate">
                              <div className="font-semibold text-sm leading-snug flex items-center gap-1.5">
                                <span className={isSelected ? 'text-sky-900 font-bold' : 'text-slate-900'}>
                                  {lang.nativeLabel}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                <span>{lang.label}</span>
                                {lang.script && (
                                  <span className="text-[10px] text-slate-400">• {lang.script}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Major International Languages Section */}
              {internationalLanguages.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Major International Languages ({internationalLanguages.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Global Weather Bulletins</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {internationalLanguages.map((lang) => {
                      const isSelected = selectedLanguage === lang.code;
                      return (
                        <button
                          key={lang.code}
                          id={`lang-opt-${lang.code}`}
                          onClick={() => handleSelect(lang.code)}
                          className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                            isSelected
                              ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 shadow-xs ring-1 ring-indigo-500/30'
                              : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                                isSelected
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                              }`}
                            >
                              {lang.code.toUpperCase()}
                            </div>
                            <div className="truncate">
                              <div className="font-semibold text-sm leading-snug flex items-center gap-1.5">
                                <span className={isSelected ? 'text-indigo-900 font-bold' : 'text-slate-900'}>
                                  {lang.nativeLabel}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                <span>{lang.label}</span>
                                {lang.region && (
                                  <span className="text-[10px] text-slate-400">• {lang.region}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>AI Bulletins & Natural Speech in Authentic Native Scripts</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
