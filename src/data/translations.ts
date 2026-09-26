import {
  LanguageCode,
  LanguageOption,
  PersonaId,
  AIBriefing,
  City,
  WeatherData,
  Persona,
} from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  // --- Official & Regional Indian Languages (All 22 Scheduled Languages + English India) ---
  {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिंदी',
    englishSub: 'Hindi',
    bcp47: 'hi-IN',
    category: 'indian',
    region: 'Official / Union',
    script: 'Devanagari',
  },
  {
    code: 'en',
    label: 'English (India)',
    nativeLabel: 'English (India)',
    englishSub: 'English (India)',
    bcp47: 'en-IN',
    category: 'indian',
    region: 'Official Associate',
    script: 'Latin',
  },
  {
    code: 'bn',
    label: 'Bengali',
    nativeLabel: 'বাংলা',
    englishSub: 'Bengali',
    bcp47: 'bn-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Bengali',
  },
  {
    code: 'te',
    label: 'Telugu',
    nativeLabel: 'తెలుగు',
    englishSub: 'Telugu',
    bcp47: 'te-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Telugu',
  },
  {
    code: 'mr',
    label: 'Marathi',
    nativeLabel: 'मराठी',
    englishSub: 'Marathi',
    bcp47: 'mr-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Devanagari',
  },
  {
    code: 'ta',
    label: 'Tamil',
    nativeLabel: 'தமிழ்',
    englishSub: 'Tamil',
    bcp47: 'ta-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Tamil',
  },
  {
    code: 'ur',
    label: 'Urdu',
    nativeLabel: 'اردو',
    englishSub: 'Urdu',
    bcp47: 'ur-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Perso-Arabic',
  },
  {
    code: 'gu',
    label: 'Gujarati',
    nativeLabel: 'ગુજરાતી',
    englishSub: 'Gujarati',
    bcp47: 'gu-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Gujarati',
  },
  {
    code: 'kn',
    label: 'Kannada',
    nativeLabel: 'ಕನ್ನಡ',
    englishSub: 'Kannada',
    bcp47: 'kn-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Kannada',
  },
  {
    code: 'ml',
    label: 'Malayalam',
    nativeLabel: 'മലയാളം',
    englishSub: 'Malayalam',
    bcp47: 'ml-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Malayalam',
  },
  {
    code: 'or',
    label: 'Odia',
    nativeLabel: 'ଓଡ଼ିଆ',
    englishSub: 'Odia',
    bcp47: 'or-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Odia',
  },
  {
    code: 'pa',
    label: 'Punjabi',
    nativeLabel: 'ਪੰਜਾਬੀ',
    englishSub: 'Punjabi',
    bcp47: 'pa-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Gurmukhi',
  },
  {
    code: 'as',
    label: 'Assamese',
    nativeLabel: 'অসমীয়া',
    englishSub: 'Assamese',
    bcp47: 'as-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Bengali-Assamese',
  },
  {
    code: 'mai',
    label: 'Maithili',
    nativeLabel: 'मैथिली',
    englishSub: 'Maithili',
    bcp47: 'mai-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Devanagari',
  },
  {
    code: 'sat',
    label: 'Santali',
    nativeLabel: 'संथाली (ᱥᱟᱱᱛᱟᱲᱤ)',
    englishSub: 'Santali',
    bcp47: 'sat-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Ol Chiki',
  },
  {
    code: 'ks',
    label: 'Kashmiri',
    nativeLabel: 'कॉशुर (کٲشُر)',
    englishSub: 'Kashmiri',
    bcp47: 'ks-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Perso-Arabic',
  },
  {
    code: 'ne',
    label: 'Nepali',
    nativeLabel: 'नेपाली',
    englishSub: 'Nepali',
    bcp47: 'ne-NP',
    category: 'indian',
    region: '8th Schedule',
    script: 'Devanagari',
  },
  {
    code: 'sd',
    label: 'Sindhi',
    nativeLabel: 'سنڌي (सिंधी)',
    englishSub: 'Sindhi',
    bcp47: 'sd-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Perso-Arabic',
  },
  {
    code: 'kok',
    label: 'Konkani',
    nativeLabel: 'कोंकणी',
    englishSub: 'Konkani',
    bcp47: 'kok-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Devanagari',
  },
  {
    code: 'doi',
    label: 'Dogri',
    nativeLabel: 'डोगरी',
    englishSub: 'Dogri',
    bcp47: 'doi-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Devanagari',
  },
  {
    code: 'mni',
    label: 'Manipuri',
    nativeLabel: 'মৈতৈলোন্ (Meitei)',
    englishSub: 'Manipuri',
    bcp47: 'mni-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Bengali / Meitei',
  },
  {
    code: 'brx',
    label: 'Bodo',
    nativeLabel: 'बड़ो (Boro)',
    englishSub: 'Bodo',
    bcp47: 'brx-IN',
    category: 'indian',
    region: '8th Schedule',
    script: 'Devanagari',
  },
  {
    code: 'sa',
    label: 'Sanskrit',
    nativeLabel: 'संस्कृतम्',
    englishSub: 'Sanskrit',
    bcp47: 'sa-IN',
    category: 'indian',
    region: 'Classical / 8th Schedule',
    script: 'Devanagari',
  },

  // --- Major International Languages (8) ---
  {
    code: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
    englishSub: 'Spanish',
    bcp47: 'es-ES',
    category: 'international',
    region: 'Global',
    script: 'Latin',
  },
  {
    code: 'fr',
    label: 'French',
    nativeLabel: 'Français',
    englishSub: 'French',
    bcp47: 'fr-FR',
    category: 'international',
    region: 'Global',
    script: 'Latin',
  },
  {
    code: 'de',
    label: 'German',
    nativeLabel: 'Deutsch',
    englishSub: 'German',
    bcp47: 'de-DE',
    category: 'international',
    region: 'Global',
    script: 'Latin',
  },
  {
    code: 'ar',
    label: 'Arabic',
    nativeLabel: 'العربية',
    englishSub: 'Arabic',
    bcp47: 'ar-SA',
    category: 'international',
    region: 'Global',
    script: 'Arabic',
  },
  {
    code: 'ru',
    label: 'Russian',
    nativeLabel: 'Русский',
    englishSub: 'Russian',
    bcp47: 'ru-RU',
    category: 'international',
    region: 'Global',
    script: 'Cyrillic',
  },
  {
    code: 'ja',
    label: 'Japanese',
    nativeLabel: '日本語',
    englishSub: 'Japanese',
    bcp47: 'ja-JP',
    category: 'international',
    region: 'Global',
    script: 'Kanji / Kana',
  },
  {
    code: 'pt',
    label: 'Portuguese',
    nativeLabel: 'Português',
    englishSub: 'Portuguese',
    bcp47: 'pt-PT',
    category: 'international',
    region: 'Global',
    script: 'Latin',
  },
  {
    code: 'zh',
    label: 'Chinese Simplified',
    nativeLabel: '简体中文',
    englishSub: 'Chinese (Simplified)',
    bcp47: 'zh-CN',
    category: 'international',
    region: 'Global',
    script: 'Simplified Chinese',
  },
];

export const TTS_LANGUAGE_CONFIG: Record<
  string,
  {
    bcp47: string;
    fallbackBcp47: string;
    introPrefix: (cityName: string, stateName: string) => string;
    warningPrefix: (level: string) => string;
    goldenWindowLabel: string;
  }
> = {
  en: {
    bcp47: 'en-IN',
    fallbackBcp47: 'en-US',
    introPrefix: (city, state) =>
      `India Meteorological Department daily briefing for ${city}, ${state}.`,
    warningPrefix: (level) => `Current warning status is ${level} level.`,
    goldenWindowLabel: 'Best time window for outdoor activities:',
  },
  hi: {
    bcp47: 'hi-IN',
    fallbackBcp47: 'hi',
    introPrefix: (city, state) =>
      `भारत मौसम विज्ञान विभाग का दैनिक मौसम बुलेटिन, ${city}, ${state} के लिए।`,
    warningPrefix: (level) => `वर्तमान मौसम चेतावनी स्थिति ${level} स्तर की है।`,
    goldenWindowLabel: 'बाहरी गतिविधियों के लिए सबसे अनुकूल समय:',
  },
  bn: {
    bcp47: 'bn-IN',
    fallbackBcp47: 'bn',
    introPrefix: (city, state) =>
      `ভারত আবহাওয়া অধিদপ্তরের দৈনিক আবহাওয়া বুলেটিন, ${city}, ${state} এর জন্য।`,
    warningPrefix: (level) => `বর্তমান আবহাওয়া সতর্কতার মাত্রা ${level} স্তর।`,
    goldenWindowLabel: 'বাইরের কাজের জন্য সবচেয়ে অনুকূল সময়:',
  },
  te: {
    bcp47: 'te-IN',
    fallbackBcp47: 'hi-IN',
    introPrefix: (city, state) =>
      `భారత వాతావరణ విభాగం (IMD) రోజువారీ బులెటిన్, ${city}, ${state} కొరకు.`,
    warningPrefix: (level) => `ప్రస్తుత హెచ్చరిక స్థాయి: ${level}.`,
    goldenWindowLabel: 'బయట పనులకు అనువైన సమయం:',
  },
  mr: {
    bcp47: 'mr-IN',
    fallbackBcp47: 'mr',
    introPrefix: (city, state) =>
      `भारतीय हवामान विभागाचे दैनिक हवामान बुलेटिन, ${city}, ${state} साठी.`,
    warningPrefix: (level) => `सध्याची हवामान इशारा पातळी ${level} आहे.`,
    goldenWindowLabel: 'मैदानी उपक्रमांसाठी सर्वात अनुकूल वेळ:',
  },
  ta: {
    bcp47: 'ta-IN',
    fallbackBcp47: 'ta',
    introPrefix: (city, state) =>
      `இந்திய வானிலை மையத்தின் தினசரி வானிலை அறிக்கை, ${city}, ${state} க்கு.`,
    warningPrefix: (level) => `தற்போதைய எச்சரிக்கை நிலை ${level} ஆகும்.`,
    goldenWindowLabel: 'வெளிப்புற நடவடிக்கைகளுக்கு உகந்த நேரம்:',
  },
  ur: {
    bcp47: 'ur-IN',
    fallbackBcp47: 'hi-IN',
    introPrefix: (city, state) =>
      `محکمہ موسمیات ہند کا روزانہ موسمی بلیٹن برائے ${city}، ${state}۔`,
    warningPrefix: (level) => `موجودہ وارننگ کی سطح: ${level}۔`,
    goldenWindowLabel: 'بیرونی سرگرمیوں کے لیے بہترین وقت:',
  },
  gu: {
    bcp47: 'gu-IN',
    fallbackBcp47: 'hi-IN',
    introPrefix: (city, state) =>
      `ભારત હવામાન વિભાગનું દૈનિક હવામાન બુલેટિન, ${city}, ${state} માટે.`,
    warningPrefix: (level) => `હાલની ચેતવણી સ્થિતિ: ${level}.`,
    goldenWindowLabel: 'બહારની પ્રવૃત્તિઓ માટે અનુકૂળ સમય:',
  },
  kn: {
    bcp47: 'kn-IN',
    fallbackBcp47: 'hi-IN',
    introPrefix: (city, state) =>
      `ಭಾರತೀಯ ಹವಾಮಾನ ಇಲಾಖೆಯ ದೈನಂದಿನ ವರದಿ, ${city}, ${state} ಗಾಗಿ.`,
    warningPrefix: (level) => `ಪ್ರಸ್ತುತ ಎಚ್ಚರಿಕೆ ಮಟ್ಟ: ${level}.`,
    goldenWindowLabel: 'ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸೂಕ್ತ ಸಮಯ:',
  },
  ml: {
    bcp47: 'ml-IN',
    fallbackBcp47: 'hi-IN',
    introPrefix: (city, state) =>
      `ഇന്ത്യൻ കാലാവസ്ഥാ വകുപ്പിന്റെ പ്രതിദിന കാലാവസ്ഥാ ബുള്ളറ്റിൻ, ${city}, ${state}.`,
    warningPrefix: (level) => `നിലവിലെ മുന്നറിയിപ്പ് നില: ${level}.`,
    goldenWindowLabel: 'പുറത്തിറങ്ങാൻ ഏറ്റവും അനുയോജ്യമായ സമയം:',
  },
  or: {
    bcp47: 'or-IN',
    fallbackBcp47: 'hi-IN',
    introPrefix: (city, state) =>
      `ଭାରତୀୟ ପାଣିପାଗ ବିଭାଗର ଦୈନିକ ପାଣିପାଗ ବୁଲେଟିନ୍, ${city}, ${state} ପାଇଁ।`,
    warningPrefix: (level) => `ବର୍ତ୍ତମାନର ସତର୍କତା ସ୍ତର: ${level}।`,
    goldenWindowLabel: 'ବାହାର କାର୍ଯ୍ୟ ପାଇଁ ଅନୁକୂଳ ସମୟ:',
  },
  pa: {
    bcp47: 'pa-IN',
    fallbackBcp47: 'hi-IN',
    introPrefix: (city, state) =>
      `ਭਾਰਤੀ ਮੌਸਮ ਵਿਭਾਗ ਦਾ ਰੋਜ਼ਾਨਾ ਮੌਸਮ ਬੁਲੇਟਿਨ, ${city}, ${state} ਲਈ।`,
    warningPrefix: (level) => `ਮੌਜੂਦਾ ਚੇਤਾਵਨੀ ਸਥਿਤੀ: ${level}।`,
    goldenWindowLabel: 'ਬਾਹਰੀ ਗਤੀਵਿਧੀਆਂ ਲਈ ਢੁਕਵਾਂ ਸਮਾਂ:',
  },
  as: {
    bcp47: 'as-IN',
    fallbackBcp47: 'bn-IN',
    introPrefix: (city, state) =>
      `ভাৰতীয় বতৰ বিজ্ঞান বিভাগৰ দৈনিক বতৰ বুলেটিন, ${city}, ${state} ৰ বাবে।`,
    warningPrefix: (level) => `বৰ্তমানৰ সতৰ্কতাৰ মাত্ৰা: ${level}।`,
    goldenWindowLabel: 'বাহিৰৰ কামৰ বাবে উপযুক্ত সময়:',
  },
  // International Languages
  es: {
    bcp47: 'es-ES',
    fallbackBcp47: 'es',
    introPrefix: (city, state) =>
      `Boletín meteorológico oficial de la India para ${city}, ${state}.`,
    warningPrefix: (level) => `Estado de alerta meteorológica actual: nivel ${level}.`,
    goldenWindowLabel: 'Mejor intervalo para actividades al aire libre:',
  },
  fr: {
    bcp47: 'fr-FR',
    fallbackBcp47: 'fr',
    introPrefix: (city, state) =>
      `Bulletin météorologique officiel pour ${city}, ${state}.`,
    warningPrefix: (level) => `Niveau de vigilance météorologique actuel: ${level}.`,
    goldenWindowLabel: 'Créneau idéal pour les activités extérieures:',
  },
  de: {
    bcp47: 'de-DE',
    fallbackBcp47: 'de',
    introPrefix: (city, state) =>
      `Offizieller Wetterbericht des Meteorologischen Dienstes für ${city}, ${state}.`,
    warningPrefix: (level) => `Aktuelle Warnstufe: ${level}.`,
    goldenWindowLabel: 'Empfohlenes Zeitfenster für Außenaktivitäten:',
  },
  ar: {
    bcp47: 'ar-SA',
    fallbackBcp47: 'ar',
    introPrefix: (city, state) =>
      `النشرة الجوية اليومية الرسمية لمدينة ${city}، ${state}.`,
    warningPrefix: (level) => `مستوى التحذير الجوي الحالي: ${level}.`,
    goldenWindowLabel: 'أفضل نافذة زمنية للأنشطة الخارجية:',
  },
  ru: {
    bcp47: 'ru-RU',
    fallbackBcp47: 'ru',
    introPrefix: (city, state) =>
      `Ежедневный метеорологический бюллетень для ${city}, ${state}.`,
    warningPrefix: (level) => `Текущий уровень метеорологической опасности: ${level}.`,
    goldenWindowLabel: 'Лучшее время для мероприятий на открытом воздухе:',
  },
  ja: {
    bcp47: 'ja-JP',
    fallbackBcp47: 'ja',
    introPrefix: (city, state) =>
      `${city}、${state}の気象庁公式デイリー気象ブリーフィングです。`,
    warningPrefix: (level) => `現在の気象警報レベルは ${level} です。`,
    goldenWindowLabel: '屋外活動に最適な時間帯:',
  },
  pt: {
    bcp47: 'pt-PT',
    fallbackBcp47: 'pt',
    introPrefix: (city, state) =>
      `Boletim meteorológico oficial para ${city}, ${state}.`,
    warningPrefix: (level) => `Estado de aviso meteorológico atual: ${level}.`,
    goldenWindowLabel: 'Melhor horário para atividades ao ar livre:',
  },
  zh: {
    bcp47: 'zh-CN',
    fallbackBcp47: 'zh',
    introPrefix: (city, state) =>
      `印度气象局官方天气简报，针对 ${city}，${state}。`,
    warningPrefix: (level) => `当前天气预警级别为：${level}。`,
    goldenWindowLabel: '最佳户外活动时间段：',
  },
};

export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Header
    appTitle: 'MAUSAM',
    appSubtitle: 'India Meteorological Department',
    ministry: 'Ministry of Earth Sciences, Govt of India',
    gpsLocation: 'GPS Location',
    detectingGps: 'Detecting...',
    warningProtocol: 'Warning Protocol:',
    sync: 'Sync',
    updating: 'Updating...',
    alerts: 'Alerts',
    testAlert: 'Test Alert',
    popularCities: 'Popular Cities:',
    selectLanguage: 'Language',
    lightMode: 'Standard Light',
    darkMode: 'Observatory Dark',
    contrastMode: 'High Contrast (GIGW)',
    cachedForecastPill: 'Viewing cached forecast • Offline mode',
    liveForecastPill: 'Live Synoptic Feed',

    // Scenarios
    greenNormal: '🟢 Green (Normal / Routine)',
    yellowWatch: '🟡 Yellow (Watch / Rain & Gusts)',
    orangeAlert: '🟠 Orange (Alert / Severe Squall)',
    redWarning: '🔴 Red (Warning / Severe Cyclone)',
    liveData: '🛰️ Live Open-Meteo & IMD',

    // Persona Selector
    personaHeaderTitle: 'Citizen Profile Focus & Dynamic Reordering',
    personaHeaderSubtitle:
      'Choose your profile to reorder widgets, adapt weather telemetry, and synthesize specialized AI advisories.',
    hybridModeBadge: 'Hybrid Mode Active',
    primaryProfile: 'Primary Focus',
    secondaryProfile: 'Secondary Focus',
    clearSecondary: 'Clear Secondary',
    clickToSetSecondary: 'Right click or tap chip to pair secondary profile',

    // Current Weather Hero
    feelsLike: 'Feels like',
    diurnalRange: 'Diurnal Range',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    visibility: 'Visibility',
    airQuality: 'Air Quality',
    rainProb: 'Rain Probability',
    soilMoisture: 'Soil Moisture',
    seaTemp: 'Sea Surface',
    uvIndex: 'UV Index',
    liveTelemetry: 'Live Synoptic Telemetry',
    updatedJustNow: 'Updated Just Now',
    activeAdvisory: 'Official IMD Synoptic Warning',

    // Briefing Card
    aiBriefingTitle: 'IMD AI Daily Synoptic Briefing',
    aiBriefingSubtitle: 'Personalized biometeorological forecast & localized action advisory',
    regenerate: 'Regenerate',
    generating: 'Generating AI advisory...',
    listenTts: 'Listen Briefing',
    listenVoice: 'Listen Briefing',
    pauseTts: 'Pause',
    pauseVoice: 'Pause',
    resumeTts: 'Resume',
    resumeVoice: 'Resume',
    stopTts: 'Stop',
    stopVoice: 'Stop',
    playingTts: 'Playing Voice...',
    loadingVoice: 'Connecting...',
    goldenWindow: 'Best Time Window',
    directAdvice: 'Recommended Citizen Actions',
    exportAdvisory: 'Export Advisory',
    keyFactors: 'Priority Factors',

    // Notification Drawer
    earlyWarnings: 'Early Warnings & Citizen Alerts',
    activeAdvisoriesCount: 'Active Advisories',
    markAllRead: 'Mark All Read',
    clearAllAlerts: 'Clear All',
    filterAll: 'All Alerts',
    filterCritical: 'Critical (Red / Orange)',
    filterWatch: 'Watch (Yellow)',
    filterNormal: 'Routine (Green)',
    triggerTestAlert: 'Trigger Test Alert',
    noAlertsFound: 'No alerts found in this category.',
    actionRequired: 'Recommended Action',
    dismiss: 'Dismiss',

    // Weather Conditions
    clearSky: 'Clear Sky',
    partlyCloudy: 'Partly Cloudy',
    overcast: 'Overcast Skies',
    denseFog: 'Dense Fog & Poor Visibility',
    lightRain: 'Light Passing Showers',
    heavyRain: 'Heavy Downpour & Waterlogging',
    severeSquall: 'Severe Thunderstorm & Squall',
    cycloneAlert: 'Severe Cyclonic Storm Alert',
    extremeHeat: 'Severe Heatwave Warning',

    // Alert Levels
    greenLevel: 'Routine / Normal',
    yellowLevel: 'Watch (Be Updated)',
    orangeLevel: 'Alert (Be Prepared)',
    redLevel: 'Warning (Take Action)',
  },

  hi: {
    // Header
    appTitle: 'मौसम',
    appSubtitle: 'भारत मौसम विज्ञान विभाग',
    ministry: 'पृथ्वी विज्ञान मंत्रालय, भारत सरकार',
    gpsLocation: 'जीपीएस स्थान',
    detectingGps: 'स्थान खोज रहे हैं...',
    warningProtocol: 'चेतावनी प्रोटोकॉल:',
    sync: 'ताज़ा करें',
    updating: 'अद्यतन हो रहा है...',
    alerts: 'सचेतक (अलर्ट)',
    testAlert: 'टेस्ट अलर्ट',
    popularCities: 'प्रमुख शहर:',
    selectLanguage: 'भाषा',
    lightMode: 'मानक लाइट मोड',
    darkMode: 'वेधशाला डार्क मोड',
    contrastMode: 'उच्च कंट्रास्ट (GIGW सुगम्यता)',
    cachedForecastPill: 'कैश किया गया पूर्वानुमान • ऑफ़लाइन मोड',
    liveForecastPill: 'लाइव वेधशाला टेलीमेट्री',

    // Scenarios
    greenNormal: '🟢 हरा (सामान्य / नियमित)',
    yellowWatch: '🟡 पीला (निगरानी / वर्षा व हवा)',
    orangeAlert: '🟠 नारंगी (सतर्क / तीव्र आंधी-तूफान)',
    redWarning: '🔴 लाल (चेतावनी / भीषण चक्रवात)',
    liveData: '🛰️ लाइव मौसम उपग्रह डेटा',

    // Persona Selector
    personaHeaderTitle: 'नागरिक प्रोफाइल प्राथमिकता व गतिशील पुनर्गठन',
    personaHeaderSubtitle:
      'विजेट्स को पुनः क्रमित करने, मौसम टेलीमेट्री को अनुकूलित करने और एआई सलाह प्राप्त करने के लिए प्रोफाइल चुनें।',
    hybridModeBadge: 'हाइब्रिड मोड सक्रिय',
    primaryProfile: 'प्राथमिक प्रोफाइल',
    secondaryProfile: 'द्वितीयक प्रोफाइल',
    clearSecondary: 'द्वितीयक हटाएं',
    clickToSetSecondary: 'जोड़ी बनाने के लिए टैप करें',

    // Current Weather Hero
    feelsLike: 'महसूस तापमान',
    diurnalRange: 'दैनिक तापमान सीमा',
    humidity: 'आर्द्रता (नमी)',
    windSpeed: 'हवा की गति',
    visibility: 'दृश्यता (विजिबिलिटी)',
    airQuality: 'वायु गुणवत्ता (AQI)',
    rainProb: 'बारिश की संभावना',
    soilMoisture: 'मिट्टी की नमी',
    seaTemp: 'समुद्र का तापमान',
    uvIndex: 'यूवी इंडेक्स',
    liveTelemetry: 'लाइव मौसम माप',
    updatedJustNow: 'अभी अपडेट हुआ',
    activeAdvisory: 'आधिकारिक मौसम चेतावनी',

    // Briefing Card
    aiBriefingTitle: 'आईएमडी एआई दैनिक मौसम बुलेटिन',
    aiBriefingSubtitle: 'व्यक्तिगत मौसम पूर्वानुमान एवं स्थानीय नागरिक सलाह',
    regenerate: 'पुनः तैयार करें',
    generating: 'सलाह तैयार हो रही है...',
    listenTts: 'बुलेटिन सुनें',
    listenVoice: 'बुलेटिन सुनें',
    pauseTts: 'रोकें',
    pauseVoice: 'रोकें',
    resumeTts: 'पुनः शुरू करें',
    resumeVoice: 'पुनः शुरू करें',
    stopTts: 'बंद करें',
    stopVoice: 'बंद करें',
    playingTts: 'आवाज़ चल रही है...',
    loadingVoice: 'कनेक्ट हो रहा है...',
    goldenWindow: 'सबसे अनुकूल समय',
    directAdvice: 'नागरिकों हेतु अनुशंसित कार्य',
    exportAdvisory: 'डाउनलोड / शेयर',
    keyFactors: 'प्रमुख संकेतक',

    // Notification Drawer
    earlyWarnings: 'मौसम पूर्व-चेतावनी व नागरिक अलर्ट',
    activeAdvisoriesCount: 'सक्रिय चेतावनियां',
    markAllRead: 'सभी पढ़े हुए चिह्नित करें',
    clearAllAlerts: 'सभी हटाएं',
    filterAll: 'सभी अलर्ट',
    filterCritical: 'अति-गंभीर (लाल / नारंगी)',
    filterWatch: 'निगरानी (पीला)',
    filterNormal: 'सामान्य (हरा)',
    triggerTestAlert: 'टेस्ट अलर्ट चलाएं',
    noAlertsFound: 'इस श्रेणी में कोई चेतावनी नहीं मिली।',
    actionRequired: 'सुझाई गई कार्रवाई',
    dismiss: 'खारिज करें',

    // Weather Conditions
    clearSky: 'साफ आसमान',
    partlyCloudy: 'आंशिक रूप से बादल',
    overcast: 'घने बादल',
    denseFog: 'घना कोहरा व कम दृश्यता',
    lightRain: 'हल्की बारिश व बूंदाबांदी',
    heavyRain: 'भारी बारिश व जलभराव',
    severeSquall: 'भीषण आंधी-तूफान व गर्जना',
    cycloneAlert: 'चक्रवाती तूफान की चेतावनी',
    extremeHeat: 'भीषण लू (हीटवेव) का प्रकोप',

    // Alert Levels
    greenLevel: 'सामान्य (नियमित स्थिति)',
    yellowLevel: 'पीला अलर्ट (सतर्क रहें)',
    orangeLevel: 'नारंगी अलर्ट (तैयार रहें)',
    redLevel: 'लाल चेतावनी (त्वरित कार्रवाई करें)',
  },

  bn: {
    // Header
    appTitle: 'মৌসম',
    appSubtitle: 'ভারত আবহাওয়া অধিদপ্তর',
    ministry: 'ভূ-বিজ্ঞান মন্ত্রক, ভারত সরকার',
    gpsLocation: 'জিপিএস অবস্থান',
    detectingGps: 'সনাক্ত করা হচ্ছে...',
    warningProtocol: 'সতর্কতা প্রোটোকল:',
    sync: 'আপডেট করুন',
    updating: 'আপডেট হচ্ছে...',
    alerts: 'সতর্কবার্তা',
    testAlert: 'টেস্ট এলার্ট',
    popularCities: 'প্রধান শহরসমূহ:',
    selectLanguage: 'ভাষা',

    // Scenarios
    greenNormal: '🟢 সবুজ (স্বাভাবিক / নিয়মিত)',
    yellowWatch: '🟡 হলুদ (নজরদারি / বৃষ্টি ও বাতাস)',
    orangeAlert: '🟠 কমলা (সতর্কতা / তীব্র ঝড়)',
    redWarning: '🔴 লাল (জরুরি সতর্কতা / প্রবল ঘূর্ণিঝড়)',
    liveData: '🛰️ সরাসরি উপগ্রহ ও আইএমডি তথ্য',

    // Persona Selector
    personaHeaderTitle: 'নাগরিক প্রোফাইল ও আবহাওয়া অগ্রাধিকার',
    personaHeaderSubtitle:
      'উইজেট পুনর্বিন্যাস এবং এআই চালিত বিশেষায়িত আবহাওয়া পরামর্শের জন্য আপনার প্রোফাইল চয়ন করুন।',
    hybridModeBadge: 'হাইব্রিড মোড সক্রিয়',
    primaryProfile: 'প্রাথমিক প্রোফাইল',
    secondaryProfile: 'দ্বিতীয় প্রোফাইল',
    clearSecondary: 'দ্বিতীয়টি সরান',
    clickToSetSecondary: 'দ্বিতীয় প্রোফাইল যুক্ত করতে ট্যাপ করুন',

    // Current Weather Hero
    feelsLike: 'অনুভূত তাপমাত্রা',
    diurnalRange: 'দৈনিক তাপমাত্রার পরিসর',
    humidity: 'আর্দ্রতা',
    windSpeed: 'বাতাসের গতি',
    visibility: 'দৃশ্যমানতা',
    airQuality: 'বায়ুমান (AQI)',
    rainProb: 'বৃষ্টির সম্ভাবনা',
    soilMoisture: 'মাটির আর্দ্রতা',
    seaTemp: 'সমুদ্রের তাপমাত্রা',
    uvIndex: 'ইউভি সূচক',
    liveTelemetry: 'সরাসরি আবহাওয়া পরিমাপ',
    updatedJustNow: 'এইমাত্র হালনাগাদ করা হয়েছে',
    activeAdvisory: 'সরকারি আবহাওয়া সতর্কতা',

    // Briefing Card
    aiBriefingTitle: 'আইএমডি এআই দৈনিক আবহাওয়া ব্রিফিং',
    aiBriefingSubtitle: 'ব্যক্তিগত আবহাওয়া পূর্বাভাস এবং স্থানীয় নাগরিক পরামর্শ',
    regenerate: 'পুনরায় তৈরি করুন',
    generating: 'পরামর্শ তৈরি হচ্ছে...',
    listenTts: 'ব্রিফিং শুনুন',
    pauseTts: 'বিরতি',
    resumeTts: 'চালিয়ে যান',
    stopTts: 'থামান',
    playingTts: 'ভয়েস চলছে...',
    goldenWindow: 'সবচেয়ে উপযুক্ত সময়',
    directAdvice: 'নাগরিকদের জন্য প্রয়োজনীয় পদক্ষেপ',
    exportAdvisory: 'ডাউনলোড ও শেয়ার',
    keyFactors: 'গুরুত্বপূর্ণ সূচক',

    // Notification Drawer
    earlyWarnings: 'পূর্ব-সতর্কবার্তা ও নাগরিক নোটিফিকেশন',
    activeAdvisoriesCount: 'সক্রিয় সতর্কবার্তা',
    markAllRead: 'সব পঠিত হিসেবে চিহ্নিত করুন',
    clearAllAlerts: 'সব মুছুন',
    filterAll: 'সকল সতর্কতা',
    filterCritical: 'জরুরি (লাল / কমলা)',
    filterWatch: 'নজরদারি (হলুদ)',
    filterNormal: 'স্বাভাবিক (সবুজ)',
    triggerTestAlert: 'টেস্ট সতর্কতা চালান',
    noAlertsFound: 'এই বিভাগে কোনো সতর্কতা নেই।',
    actionRequired: 'প্রস্তাবিত পদক্ষেপ',
    dismiss: 'বাতিল করুন',

    // Weather Conditions
    clearSky: 'পরিষ্কার আকাশ',
    partlyCloudy: 'আংশিক মেঘলা',
    overcast: 'মেঘলা আকাশ',
    denseFog: 'ঘন কুয়াশা ও কম দৃশ্যমানতা',
    lightRain: 'হালকা বৃষ্টিপাত',
    heavyRain: 'ভারী বর্ষণ ও জলবদ্ধতা',
    severeSquall: 'তীব্র বজ্রঝড় ও দমকা হাওয়া',
    cycloneAlert: 'প্রবল ঘূর্ণিঝড় সতর্কতা',
    extremeHeat: 'তীব্র তাপদাহ সতর্কতা',

    // Alert Levels
    greenLevel: 'স্বাভাবিক পরিস্থিতি',
    yellowLevel: 'হলুদ সতর্কতা (নজর রাখুন)',
    orangeLevel: 'কমলা সতর্কতা (প্রস্তুত থাকুন)',
    redLevel: 'লাল সতর্কতা (পদক্ষেপ নিন)',
  },

  mr: {
    // Header
    appTitle: 'मौसम',
    appSubtitle: 'भारतीय हवामान विभाग',
    ministry: 'पृथ्वी विज्ञान मंत्रालय, भारत सरकार',
    gpsLocation: 'जीपीएस स्थान',
    detectingGps: 'शोधत आहे...',
    warningProtocol: 'इशारा प्रोटोकॉल:',
    sync: 'अपडेट करा',
    updating: 'अपडेट होत आहे...',
    alerts: 'इशारे (अलर्ट)',
    testAlert: 'टेस्ट अलर्ट',
    popularCities: 'प्रमुख शहरे:',
    selectLanguage: 'भाषा',

    // Scenarios
    greenNormal: '🟢 हिरवा (सामान्य / दैनंदिन)',
    yellowWatch: '🟡 पिवळा (लक्ष ठेवा / पाऊस व वारे)',
    orangeAlert: '🟠 नारंगी (सतर्क / जोरदार वादळ)',
    redWarning: '🔴 लाल (इशारा / तीव्र चक्रीवादळ)',
    liveData: '🛰️ थेट हवामान उपग्रह माहिती',

    // Persona Selector
    personaHeaderTitle: 'नागरिक प्रोफाइल व हवामान प्राधान्य',
    personaHeaderSubtitle:
      'विजेट्सचे क्रम बदलण्यासाठी आणि एआय आधारित विशेष हवामान सल्ला मिळवण्यासाठी तुमची प्रोफाइल निवडा.',
    hybridModeBadge: 'हायब्रिड मोड सक्रिय',
    primaryProfile: 'प्राथमिक प्रोफाइल',
    secondaryProfile: 'दुय्यम प्रोफाइल',
    clearSecondary: 'दुय्यम काढा',
    clickToSetSecondary: 'जोडी बनवण्यासाठी टॅप करा',

    // Current Weather Hero
    feelsLike: 'जाणवणारे तापमान',
    diurnalRange: 'दैनंदिन तापमान फरक',
    humidity: 'हवेतील आर्द्रता',
    windSpeed: 'वाऱ्याचा वेग',
    visibility: 'दृश्यमानता',
    airQuality: 'हवेची गुणवत्ता (AQI)',
    rainProb: 'पावसाची शक्यता',
    soilMoisture: 'मातीतील ओलावा',
    seaTemp: 'समुद्राचे तापमान',
    uvIndex: 'यूव्ही निर्देशांक',
    liveTelemetry: 'थेट हवामान निरीक्षणे',
    updatedJustNow: 'आत्ताच अद्ययावत',
    activeAdvisory: 'अधिकृत हवामान चेतावणी',

    // Briefing Card
    aiBriefingTitle: 'आयएमडी एआय दैनंदिन हवामान बुलेटिन',
    aiBriefingSubtitle: 'वैयक्तिक हवामान अंदाज व स्थानिक नागरिक सल्ला',
    regenerate: 'पुन्हा तयार करा',
    generating: 'सल्ला तयार होत आहे...',
    listenTts: 'बुलेटिन ऐका',
    pauseTts: 'थांबवा',
    resumeTts: 'पुन्हा सुरू करा',
    stopTts: 'बंद करा',
    playingTts: 'आवाज सुरू आहे...',
    goldenWindow: 'सर्वात अनुकूल वेळ',
    directAdvice: 'नागरिकांसाठी महत्त्वाचा सल्ला',
    exportAdvisory: 'डाउनलोड व शेअर',
    keyFactors: 'महत्त्वाचे निकष',

    // Notification Drawer
    earlyWarnings: 'हवामान पूर्वसूचना व नागरिक इशारे',
    activeAdvisoriesCount: 'सक्रिय इशारे',
    markAllRead: 'सर्व वाचलेले चिन्हांकित करा',
    clearAllAlerts: 'सर्व हटवा',
    filterAll: 'सर्व इशारे',
    filterCritical: 'गंभीर (लाल / नारंगी)',
    filterWatch: 'निरीक्षण (पिवळा)',
    filterNormal: 'सामान्य (हिरवा)',
    triggerTestAlert: 'टेस्ट अलर्ट द्या',
    noAlertsFound: 'या श्रेणीमध्ये कोणतेही इशारे नाहीत.',
    actionRequired: 'शिफारस केलेली कृती',
    dismiss: 'रद्द करा',

    // Weather Conditions
    clearSky: 'निरभ्र आकाश',
    partlyCloudy: 'अंशतः ढगाळ',
    overcast: 'पूर्ण ढगाळ आकाश',
    denseFog: 'दाट धुके व कमी दृश्यमानता',
    lightRain: 'हलका पाऊस व रिमझिम',
    heavyRain: 'मुसळधार पाऊस व पाणी साचणे',
    severeSquall: 'विजांच्या कडकडाटासह जोरदार वादळ',
    cycloneAlert: 'चक्रीवादळाचा तीव्र इशारा',
    extremeHeat: 'तीव्र उष्णतेची लाट (हीटवेव्ह)',

    // Alert Levels
    greenLevel: 'सामान्य (नियमित स्थिती)',
    yellowLevel: 'पिवळा इशारा (सावध राहा)',
    orangeLevel: 'नारंगी इशारा (सज्ज राहा)',
    redLevel: 'लाल इशारा (त्वरित उपाययोजना करा)',
  },

  ta: {
    // Header
    appTitle: 'மௌசம்',
    appSubtitle: 'இந்திய வானிலை மையம்',
    ministry: 'புவி அறிவியல் அமைச்சகம், இந்திய அரசு',
    gpsLocation: 'ஜிபிஎஸ் இருப்பிடம்',
    detectingGps: 'கண்டறிகிறது...',
    warningProtocol: 'எச்சரிக்கை நெறிமுறை:',
    sync: 'புதுப்பி',
    updating: 'புதுப்பிக்கப்படுகிறது...',
    alerts: 'எச்சரிக்கைகள்',
    testAlert: 'சோதனை எச்சரிக்கை',
    popularCities: 'முக்கிய நகரங்கள்:',
    selectLanguage: 'மொழி',

    // Scenarios
    greenNormal: '🟢 பச்சை (இயல்பு / வழக்கம்)',
    yellowWatch: '🟡 மஞ்சள் (கண்காணிப்பு / மழை & காற்று)',
    orangeAlert: '🟠 ஆரஞ்சு (எச்சரிக்கை / பலத்த புயல்)',
    redWarning: '🔴 சிவப்பு (அதிதீவிர எச்சரிக்கை / பெரும் புயல்)',
    liveData: '🛰️ நேரலை வானிலை தரவு',

    // Persona Selector
    personaHeaderTitle: 'குடிமக்கள் சுயவிவரம் & தனிப்பயன் முன்னுரிமை',
    personaHeaderSubtitle:
      'வானிலை விட்ஜெட்டுகளை ஒழுங்கமைக்கவும், தனிப்பயனாக்கப்பட்ட ஏஐ ஆலோசனைகளைப் பெறவும் சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்.',
    hybridModeBadge: 'ஹைப்ரிட் பயன்முறை இயக்கத்தில்',
    primaryProfile: 'முதன்மை சுயவிவரம்',
    secondaryProfile: 'இரண்டாம் சுயவிவரம்',
    clearSecondary: 'இரண்டாம் சுயவிவரத்தை நீக்கு',
    clickToSetSecondary: 'இரண்டாம் சுயவிவரத்தை இணைக்க தட்டவும்',

    // Current Weather Hero
    feelsLike: 'உணரும் வெப்பநிலை',
    diurnalRange: 'தினசரி வெப்பநிலை வரம்பு',
    humidity: 'ஈரப்பதம்',
    windSpeed: 'காற்றின் வேகம்',
    visibility: 'பார்வைத்திறன்',
    airQuality: 'காற்று தரம் (AQI)',
    rainProb: 'மழை வாய்ப்பு',
    soilMoisture: 'மண் ஈரப்பதம்',
    seaTemp: 'கடல் மேற்பரப்பு வெப்பநிலை',
    uvIndex: 'புறஊதா (UV) குறியீடு',
    liveTelemetry: 'நேரலை வானிலை அளவீடு',
    updatedJustNow: 'இப்போது புதுப்பிக்கப்பட்டது',
    activeAdvisory: 'அதிகாரப்பூர்வ வானிலை எச்சரிக்கை',

    // Briefing Card
    aiBriefingTitle: 'ஐஎம்டி ஏஐ தினசரி வானிலை அறிக்கை',
    aiBriefingSubtitle: 'தனிப்பயனாக்கப்பட்ட வானிலை முன்னறிவிப்பு & நடவடிக்கை ஆலோசனை',
    regenerate: 'மீண்டும் உருவாக்கு',
    generating: 'ஆலோசனை உருவாக்கப்படுகிறது...',
    listenTts: 'அறிக்கையைக் கேட்கவும்',
    pauseTts: 'இடைநிறுத்து',
    resumeTts: 'தொடரவும்',
    stopTts: 'நிறுத்து',
    playingTts: 'குரல் ஒலிக்கிறது...',
    goldenWindow: 'சிறந்த நேர சாளரம்',
    directAdvice: 'பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்',
    exportAdvisory: 'பதிவிறக்கம் / பகிர்',
    keyFactors: 'முக்கிய காரணிகள்',

    // Notification Drawer
    earlyWarnings: 'முன்னெச்சரிக்கைகள் & குடிமக்கள் அறிவிப்புகள்',
    activeAdvisoriesCount: 'செயலில் உள்ள எச்சரிக்கைகள்',
    markAllRead: 'அனைத்தையும் படித்ததாகக் குறிக்கவும்',
    clearAllAlerts: 'அனைத்தையும் நீக்கு',
    filterAll: 'அனைத்து எச்சரிக்கைகள்',
    filterCritical: 'அதிதீவிரம் (சிவப்பு / ஆரஞ்சு)',
    filterWatch: 'கண்காணிப்பு (மஞ்சள்)',
    filterNormal: 'வழக்கமானது (பச்சை)',
    triggerTestAlert: 'சோதனை எச்சரிக்கை இயக்கு',
    noAlertsFound: 'இந்த பிரிவில் எச்சரிக்கைகள் இல்லை.',
    actionRequired: 'பரிந்துரைக்கப்பட்ட நடவடிக்கை',
    dismiss: 'நீக்கு',

    // Weather Conditions
    clearSky: 'தெளிவான வானம்',
    partlyCloudy: 'பகுதி மேகமூட்டம்',
    overcast: 'முழு மேகமூட்டம்',
    denseFog: 'அடர்ந்த பனிமூட்டம்',
    lightRain: 'லேசான மழை தூறல்',
    heavyRain: 'கனமழை & வெள்ளப்பெருக்கு',
    severeSquall: 'இடிமின்னலுடன் கூடிய பலத்த சூறாவளி',
    cycloneAlert: 'புயல் எச்சரிக்கை',
    extremeHeat: 'கடும் வெப்ப அலை எச்சரிக்கை',

    // Alert Levels
    greenLevel: 'இயல்பு நிலை',
    yellowLevel: 'மஞ்சள் எச்சரிக்கை (கவனமாக இருங்கள்)',
    orangeLevel: 'ஆரஞ்சு எச்சரிக்கை (தயாராக இருங்கள்)',
    redLevel: 'சிவப்பு எச்சரிக்கை (உடனடி நடவடிக்கை தேவை)',
  },
};

export const PERSONA_TRANSLATIONS: Partial<
  Record<
    LanguageCode,
    Record<
      PersonaId,
      {
        title: string;
        subtitle: string;
        badge: string;
        description: string;
      }
    >
  >
> = {
  en: {
    health: {
      title: 'Health-Conscious',
      subtitle: 'Respiratory, Air & UV',
      badge: 'AQI & Asthma',
      description: 'Prioritizes AQI, pollen count, UV index, and respiratory alert levels.',
    },
    fitness: {
      title: 'Outdoor Fitness',
      subtitle: 'Running, Cycling & Sports',
      badge: 'Golden Hours',
      description: 'Tracks sunrise/sunset, optimal workout windows, heat stress, and wind.',
    },
    beach: {
      title: 'Beachgoers & Coastal',
      subtitle: 'Surfing, Marine & Fishing',
      badge: 'Tides & Swell',
      description: 'Monitors high/low tides, sea surface temp, wave swell, and rip current risk.',
    },
    travelers: {
      title: 'Travelers & Tourists',
      subtitle: 'Intercity, Flights & Rail',
      badge: 'Flight Weather',
      description: 'Severe weather en route, terminal delays, packing tips, and saved destinations.',
    },
    parents: {
      title: 'Parents & Families',
      subtitle: 'School Run & Child Safety',
      badge: 'Commute Alerts',
      description: 'School commute rain alerts, playground heat windows, and gear recommendations.',
    },
    agriculture: {
      title: 'Agro & Gardeners',
      subtitle: 'Farming, Crops & Soil',
      badge: 'Soil Moisture',
      description: 'Soil moisture, 7-day precipitation, dew point, frost risk, and planting advice.',
    },
    commuters: {
      title: 'Daily Commuters',
      subtitle: 'Metro, Roads & Rail',
      badge: 'Visibility & Fog',
      description: 'Dense fog alerts, visibility indexing, slick road hazards, and rain squalls.',
    },
    events: {
      title: 'Event Planners',
      subtitle: 'Weddings & Public Gatherings',
      badge: 'Outdoor Comfort',
      description: 'Extended precipitation risk, wind gusts, humidity comfort, and backup planning.',
    },
  },

  hi: {
    health: {
      title: 'स्वास्थ्य-सचेत नागरिक',
      subtitle: 'श्वसन, वायु गुणवत्ता एवं यूवी',
      badge: 'AQI व अस्थमा',
      description: 'वायु गुणवत्ता सूचकांक (AQI), परागकण, यूवी इंडेक्स और एलर्जी अलर्ट पर केंद्रित।',
    },
    fitness: {
      title: 'आउटडोर फिटनेस एवं खिलाड़ी',
      subtitle: 'दौड़, साइकिलिंग एवं खेलकूद',
      badge: 'व्यायाम का सही समय',
      description: 'सूर्योदय/सूर्यास्त, सर्वश्रेष्ठ कसरत समय, लू व हवा की गति की सटीक जानकारी।',
    },
    beach: {
      title: 'समुद्र तट व मछुआरे',
      subtitle: 'सर्फिंग, नौकायन एवं तटीय क्षेत्र',
      badge: 'ज्वार-भाटा व लहरें',
      description: 'उच्च/निम्न ज्वार, समुद्र सतह तापमान, लहरों की ऊंचाई और समुद्री धाराओं की निगरानी।',
    },
    travelers: {
      title: 'यात्री एवं पर्यटक',
      subtitle: 'उड़ान, रेल एवं अंतर-राज्यीय यात्रा',
      badge: 'यात्रा मौसम अपडेट',
      description: 'मार्ग में भीषण मौसम, उड़ान विलंब, पैकिंग सलाह और गंतव्य स्थलों का पूर्वानुमान।',
    },
    parents: {
      title: 'अभिभावक एवं परिवार',
      subtitle: 'स्कूल आवागमन व बाल सुरक्षा',
      badge: 'स्कूल रन अलर्ट',
      description: 'स्कूल समय में बारिश का अलर्ट, खेल के सुरक्षित घंटे और बच्चों हेतु मौसम सुझाव।',
    },
    agriculture: {
      title: 'किसान एवं बागवान',
      subtitle: 'खेती, फसल व मिट्टी स्वास्थ्य',
      badge: 'मिट्टी की नमी',
      description: 'मृदा नमी, वर्षा पूर्वानुमान, पाला (तुषार) जोखिम और बुवाई-कटाई की वैज्ञानिक सलाह।',
    },
    commuters: {
      title: 'दैनिक यात्री (कम्यूटर)',
      subtitle: 'मेट्रो, सड़क व रेलवे',
      badge: 'दृश्यता व कोहरा',
      description: 'घना कोहरा चेतावनी, सड़क फिसलन, जलभराव एवं यातायात पर मौसम का प्रभाव।',
    },
    events: {
      title: 'इवेंट एवं विवाह आयोजक',
      subtitle: 'खुले मैदान, उत्सव व सम्मेलन',
      badge: 'आउटडोर कम्फर्ट',
      description: 'विस्तारित वर्षा जोखिम, आंधी के झोंके, उमस स्तर और वैकल्पिक जलरोधी योजना।',
    },
  },

  bn: {
    health: {
      title: 'স্বাস্থ্য-সচেতন নাগরিক',
      subtitle: 'শ্বাসযন্ত্র, বায়ুমান ও ইউভি',
      badge: 'AQI ও অ্যালার্জি',
      description: 'বায়ুমান সূচক (AQI), পরাগকণ, ইউভি ইনডেক্স ও অ্যালার্জি সতর্কতার উপর নজর।',
    },
    fitness: {
      title: 'আউটডোর ফিটনেস ও ক্রীড়া',
      subtitle: 'দৌড়, সাইক্লিং ও শরীরচর্চা',
      badge: 'সেরা ব্যায়ামের সময়',
      description: 'সূর্যোদয়/সূর্যাস্ত, শরীরচর্চার অনুকূল সময় এবং গরম ও বাতাসের গতিবিধি।',
    },
    beach: {
      title: 'সৈকতপ্রেমী ও উপকূলীয়',
      subtitle: 'সার্ফিং, মাছ ধরা ও নৌচালনা',
      badge: 'জোয়ার-ভাটা ও ঢেউ',
      description: 'জোয়ার-ভাটার সময়, সমুদ্রের তাপমাত্রা, ঢেউয়ের উচ্চতা এবং রিপ কারেন্ট সতর্কতা।',
    },
    travelers: {
      title: 'পর্যটক ও যাত্রী',
      subtitle: 'বিমান, ট্রেন ও আন্তঃনগর ভ্রমণ',
      badge: 'ভ্রমণ আবহাওয়া',
      description: 'যাত্রাপথে দুর্যোগপূর্ণ আবহাওয়া, ফ্লাইট সতর্কতা ও প্রয়োজনীয় প্যাকিং পরামর্শ।',
    },
    parents: {
      title: 'অভিভাবক ও পরিবার',
      subtitle: 'স্কুল যাত্রা ও শিশুদের সুরক্ষা',
      badge: 'স্কুল রান সতর্কতা',
      description: 'স্কুল যাতায়াতে বৃষ্টির সম্ভাবনা, শিশুদের জন্য উপযুক্ত আবহাওয়া ও সুরক্ষা নির্দেশ।',
    },
    agriculture: {
      title: 'কৃষক ও উদ্যানপালক',
      subtitle: 'চাষাবাদ, ফসল ও মৃত্তিকা',
      badge: 'মাটির আর্দ্রতা',
      description: 'মাটির আর্দ্রতা, বৃষ্টির সম্ভাবনা, তুষারপাত ঝুঁকি এবং ফসলের বৈজ্ঞানিক পরিচর্যা।',
    },
    commuters: {
      title: 'নিয়মিত যাত্রী (কমিউটার)',
      subtitle: 'মেট্রো, বাস, রেল ও সড়ক',
      badge: 'কুয়াশা ও দৃশ্যমানতা',
      description: 'ঘন কুয়াশা, দৃশ্যমানতা সূচক, পিচ্ছিল রাস্তা ও যানজট আবহাওয়া প্রভাব।',
    },
    events: {
      title: 'অনুষ্ঠান ও বিবাহ পরিকল্পক',
      subtitle: 'উন্মুক্ত মাঠ ও জনসমাবেশ',
      badge: 'আউটডোর আরাম সূচক',
      description: 'বৃষ্টিপাতের ঝুঁকি, ঝোড়ো হাওয়ার গতি, আর্দ্রতা ও বিকল্প শেড প্রস্তুতি।',
    },
  },

  mr: {
    health: {
      title: 'आरोग्य-जागरूक नागरिक',
      subtitle: 'श्वसन, हवेची गुणवत्ता व यूव्ही',
      badge: 'AQI व ॲलर्जी',
      description: 'हवेची गुणवत्ता (AQI), परागकण, यूव्ही इंडेक्स आणि श्वसनविकार सूचनांवर भर.',
    },
    fitness: {
      title: 'मैदानी तंदुरुस्ती व खेळाडू',
      subtitle: 'धावणे, सायकलिंग व व्यायाम',
      badge: 'व्यायामाची सर्वोत्तम वेळ',
      description: 'सूर्योदय/सूर्यास्त, व्यायामासाठी अनुकूल वेळ, उष्णता व वाऱ्याचा वेग.',
    },
    beach: {
      title: 'किनारपट्टी व मच्छीमार',
      subtitle: 'सर्फिंग, नौकानयन व सागरी क्षेत्र',
      badge: 'भरती-ओहोटी व लाटा',
      description: 'भरती-ओहोटीच्या वेळा, समुद्राचे तापमान, लाटांची उंची व सागरी प्रवाह निरीक्षण.',
    },
    travelers: {
      title: 'प्रवासी व पर्यटक',
      subtitle: 'विमान, रेल्वे व आंतरराज्य प्रवास',
      badge: 'प्रवास हवामान',
      description: 'प्रवासादरम्यानचे वादळी हवामान, उड्डाण विलंब, कपड्यांचे नियोजन व गंतव्य अंदाज.',
    },
    parents: {
      title: 'पालक व कुटुंबीय',
      subtitle: 'शाळेची वाहतूक व बाल सुरक्षा',
      badge: 'शाळा प्रवास इशारा',
      description: 'शाळेच्या वेळेतील पाऊस, मैदानातील उष्णतेची तीव्रता व मुलांच्या आरोग्याचे सल्ले.',
    },
    agriculture: {
      title: 'शेतकरी व बागायतदार',
      subtitle: 'शेती, पिके व मातीचे आरोग्य',
      badge: 'मातीतील ओलावा',
      description: 'मातीतील आर्द्रता, ७ दिवसांचा पाऊस, दवबिंदू, धुके व पेरणी-कापणीचा सल्ला.',
    },
    commuters: {
      title: 'दैनंदिन प्रवासी',
      subtitle: 'मेट्रो, रस्ते व लोकल रेल्वे',
      badge: 'दृश्यमानता व धुके',
      description: 'दाट धुके, रस्त्यावरील निसरडेपणा, वाहतूक कोंडी व पावसाचे परिणाम.',
    },
    events: {
      title: 'कार्यक्रम व सोहळा आयोजक',
      subtitle: 'विवाह, जाहीर सभा व मैदाने',
      badge: 'मैदानी अनुकूलता',
      description: 'पावसाची शक्यता, सोसाट्याचा वारा, दमटपणा व पर्यायी वॉटरप्रूफ मंडप नियोजन.',
    },
  },

  ta: {
    health: {
      title: 'சுகாதார விழிப்புணர்வுள்ளோர்',
      subtitle: 'சுவாசம், காற்று தரம் & UV',
      badge: 'AQI & ஆஸ்துமா',
      description: 'காற்று தரம் (AQI), மகரந்த துகள்கள், UV குறியீடு மற்றும் சுவாச எச்சரிக்கைகள்.',
    },
    fitness: {
      title: 'வெளிப்புற உடற்பயிற்சி ஆர்வலர்கள்',
      subtitle: 'ஓட்டம், மிதிவண்டி & விளையாட்டு',
      badge: 'சிறந்த பயிற்சி நேரம்',
      description: 'சூரிய உதயம்/மறைவு, சிறந்த உடற்பயிற்சி நேரம், வெப்ப அழுத்தம் மற்றும் காற்று வேகம்.',
    },
    beach: {
      title: 'கடற்கரை விரும்பிகள் & மீனவர்கள்',
      subtitle: 'அலைச்சறுக்கு & கடல்சார் நடவடிக்கைகள்',
      badge: 'அலைகள் & ஓதங்கள்',
      description: 'ஏற்ற/வற்ற ஓதங்கள், கடல் வெப்பநிலை, அலை உயரம் மற்றும் கடல் நீரோட்ட ஆபத்து.',
    },
    travelers: {
      title: 'பயணிகள் & சுற்றுலாப் பயணிகள்',
      subtitle: 'விமானம், ரயில் & சாலைப் பயணம்',
      badge: 'பயண வானிலை',
      description: 'பயணப்பாதை வானிலை மாற்றங்கள், விமான தாமதங்கள் மற்றும் சேமிக்கப்பட்ட இடங்களின் முன்னறிவிப்பு.',
    },
    parents: {
      title: 'பெற்றோர்கள் & குடும்பங்கள்',
      subtitle: 'பள்ளிப் பயணம் & குழந்தைகள் பாதுகாப்பு',
      badge: 'பள்ளி நேர எச்சரிக்கை',
      description: 'பள்ளிப் பயண மழை எச்சரிக்கைகள், விளையாட்டு மைதான வெப்பம் மற்றும் வழிகாட்டுதல்கள்.',
    },
    agriculture: {
      title: 'விவசாயிகள் & தோட்டக்காரர்கள்',
      subtitle: 'வேளாண்மை, பயிர்கள் & மண்',
      badge: 'மண் ஈரப்பதம்',
      description: 'மண் ஈரப்பதம், மழை முன்னறிவிப்பு, பனிப்பொழிவு அபாயம் மற்றும் நடவு ஆலோசனைகள்.',
    },
    commuters: {
      title: 'தினசரி பயணிகள்',
      subtitle: 'மெட்ரோ, பேருந்து & ரயில்',
      badge: 'பனிமூட்டம் & பார்வை',
      description: 'அடர்ந்த பனிமூட்ட எச்சரிக்கைகள், பார்வை குறியீடு, சாலை வழுக்கல் மற்றும் போக்குவரத்து தாக்கம்.',
    },
    events: {
      title: 'நிகழ்ச்சி அமைப்பாளர்கள்',
      subtitle: 'திருமணம் & பொதுக் கூட்டங்கள்',
      badge: 'வெளிப்புற வசதி குறியீடு',
      description: 'நீட்டிக்கப்பட்ட மழை வாய்ப்பு, காற்று வீச்சு, ஈரப்பதம் மற்றும் மாற்று ஏற்பாடுகள்.',
    },
  },
};

/**
 * Localized Alert Level Names for natural speech and UI
 */
export const ALERT_NAMES_LOCALIZED: Record<string, Record<string, string>> = {
  en: {
    green: 'Green (Normal)',
    yellow: 'Yellow (Watch)',
    orange: 'Orange (Alert)',
    red: 'Red (Warning)',
  },
  hi: {
    green: 'हरा (सामान्य स्थिति)',
    yellow: 'पीला (निगरानी स्तर)',
    orange: 'नारंगी (सतर्कता स्तर)',
    red: 'लाल (गंभीर चेतावनी स्तर)',
  },
  bn: {
    green: 'সবুজ (স্বাভাবিক)',
    yellow: 'হলুদ (নজরদারি)',
    orange: 'কমলা (সতর্কতা)',
    red: 'লাল (জরুরি সতর্কতা)',
  },
  mr: {
    green: 'हिरवा (सामान्य स्थिती)',
    yellow: 'पिवळा (दक्षता स्तर)',
    orange: 'केशरी (सतर्कता स्तर)',
    red: 'लाल (अतिदक्षता इशारा)',
  },
  ta: {
    green: 'பச்சை (வழக்கமானது)',
    yellow: 'மஞ்சள் (கண்காணிப்பு)',
    orange: 'ஆரஞ்சு (எச்சரிக்கை)',
    red: 'சிவப்பு (தீவிர எச்சரிக்கை)',
  },
  te: {
    green: 'ఆకుపచ్చ (సాధారణ)',
    yellow: 'పసుపు (నిఘా)',
    orange: 'నారింజ (హెచ్చరిక)',
    red: 'ఎరుపు (తీవ్ర హెచ్చరిక)',
  },
  gu: {
    green: 'લીલો (સામાન્ય)',
    yellow: 'પીળો (તકેદારી)',
    orange: 'કેસરી (ચેતવણી)',
    red: 'લાલ (ગંભીર ચેતવણી)',
  },
  kn: {
    green: 'ಹಸಿರು (ಸಾಮಾನ್ಯ)',
    yellow: 'ಹಳದಿ (ವೀಕ್ಷಣೆ)',
    orange: 'ಕಿತ್ತಳೆ (ಎಚ್ಚರಿಕೆ)',
    red: 'ಕೆಂಪು (ತೀವ್ರ ಎಚ್ಚರಿಕೆ)',
  },
  ml: {
    green: 'പച്ച (സാധാരണം)',
    yellow: 'മഞ്ഞ (നിരീക്ഷണം)',
    orange: 'ഓറഞ്ച് (മുന്നറിയിപ്പ്)',
    red: 'ചുവപ്പ് (തീവ്ര മുന്നറിയിപ്പ്)',
  },
  ur: {
    green: 'سبز (معمول)',
    yellow: 'پیلا (نگرانی)',
    orange: 'نارنجی (انتباہ)',
    red: 'سرخ (شدید وارننگ)',
  },
  pa: {
    green: 'ਹਰਾ (ਆਮ)',
    yellow: 'ਪੀਲਾ (ਨਿਗਰਾਨੀ)',
    orange: 'ਸੰਤਰੀ (ਚੇਤਾਵਨੀ)',
    red: 'ਲਾਲ (ਗੰਭੀਰ ਚੇਤਾਵਨੀ)',
  },
  or: {
    green: 'ସବୁଜ (ସ୍ୱାଭାବିକ)',
    yellow: 'ହଳଦିଆ (ନଜର)',
    orange: 'କମଳା (ସତର୍କତା)',
    red: 'ଲାଲ (ଜରୁରୀ ଚେତାବନୀ)',
  },
  es: {
    green: 'Verde (Normal)',
    yellow: 'Amarillo (Vigilancia)',
    orange: 'Naranja (Alerta)',
    red: 'Rojo (Alarma Extrema)',
  },
  fr: {
    green: 'Vert (Normal)',
    yellow: 'Jaune (Vigilance)',
    orange: 'Orange (Alerte)',
    red: 'Rouge (Vigilance Absolue)',
  },
  de: {
    green: 'Grün (Normal)',
    yellow: 'Gelb (Vorwarnung)',
    orange: 'Orange (Warnung)',
    red: 'Rot (Unwetterwarnung)',
  },
  ar: {
    green: 'أخضر (طبيعي)',
    yellow: 'أصفر (مراقبة)',
    orange: 'برتقالي (تحذير)',
    red: 'أحمر (إنذار شديد)',
  },
  ru: {
    green: 'Зелёный (Норма)',
    yellow: 'Жёлтый (Внимание)',
    orange: 'Оранжевый (Опасность)',
    red: 'Красный (Шторм/Угроза)',
  },
  ja: {
    green: '緑 (平常)',
    yellow: '黄 (注意報)',
    orange: '橙 (警報)',
    red: '赤 (特別警報)',
  },
  pt: {
    green: 'Verde (Normal)',
    yellow: 'Amarelo (Atenção)',
    orange: 'Laranja (Alerta)',
    red: 'Vermelho (Perigo Extremo)',
  },
  zh: {
    green: '绿色 (正常)',
    yellow: '黄色 (注意)',
    orange: '橙色 (预警)',
    red: '红色 (严重警告)',
  },
};

/**
 * Result of dynamic browser voice matching
 */
export interface VoiceMatchResult {
  voice: SpeechSynthesisVoice | null;
  langCode: string;
  isFallback: boolean;
  fallbackReason?: string;
  subDetail?: string;
}

/**
 * Maps app LanguageCode to Google Translate TTS audio stream language parameter (tl)
 */
export function getCloudTtsLangCode(lang: LanguageCode): string {
  const map: Record<string, string> = {
    hi: 'hi',
    en: 'en',
    bn: 'bn',
    te: 'te',
    mr: 'mr',
    ta: 'ta',
    ur: 'ur',
    gu: 'gu',
    kn: 'kn',
    ml: 'ml',
    or: 'or',
    pa: 'pa',
    as: 'bn', // Assamese / Eastern Nagari
    mai: 'hi', // Maithili (Devanagari phonetics)
    sat: 'hi', // Santali
    ks: 'ur', // Kashmiri
    ne: 'ne', // Nepali
    sd: 'sd', // Sindhi
    kok: 'mr', // Konkani (Devanagari phonetics)
    doi: 'hi', // Dogri
    mni: 'bn', // Manipuri
    brx: 'hi', // Bodo
    sa: 'sa', // Sanskrit
    es: 'es', // Spanish
    fr: 'fr', // French
    de: 'de', // German
    ar: 'ar', // Arabic
    ru: 'ru', // Russian
    ja: 'ja', // Japanese
    pt: 'pt', // Portuguese
    zh: 'zh-CN', // Chinese Simplified
  };
  return map[lang] || lang || 'en';
}

/**
 * Matches browser voices according to language requirements across all 31 supported languages.
 * If regional Indian voice is not installed, gracefully maps to the 'hi-IN' (Hindi) voice engine
 * so Devanagari phonetics sound natural, instead of defaulting to English.
 */
export function findBestVoiceForLanguage(
  voices: SpeechSynthesisVoice[],
  language: LanguageCode
): VoiceMatchResult {
  const norm = (s: string) => (s || '').toLowerCase().replace(/_/g, '-');

  const LANGUAGE_NAMES: Record<string, string> = {
    hi: 'Hindi',
    en: 'English (India)',
    bn: 'Bengali',
    te: 'Telugu',
    mr: 'Marathi',
    ta: 'Tamil',
    ur: 'Urdu',
    gu: 'Gujarati',
    kn: 'Kannada',
    ml: 'Malayalam',
    or: 'Odia',
    pa: 'Punjabi',
    as: 'Assamese',
    mai: 'Maithili',
    sat: 'Santali',
    ks: 'Kashmiri',
    ne: 'Nepali',
    sd: 'Sindhi',
    kok: 'Konkani',
    doi: 'Dogri',
    mni: 'Manipuri',
    brx: 'Bodo',
    sa: 'Sanskrit',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ar: 'Arabic',
    ru: 'Russian',
    ja: 'Japanese',
    pt: 'Portuguese',
    zh: 'Chinese',
  };

  const targetConfigs: Record<string, { bcp47: string; prefixes: string[]; isIndian?: boolean }> = {
    hi: { bcp47: 'hi-IN', prefixes: ['hi-in', 'hi'], isIndian: true },
    en: { bcp47: 'en-IN', prefixes: ['en-in', 'en-us', 'en-gb', 'en'], isIndian: true },
    bn: { bcp47: 'bn-IN', prefixes: ['bn-in', 'bn-bd', 'bn'], isIndian: true },
    te: { bcp47: 'te-IN', prefixes: ['te-in', 'te'], isIndian: true },
    mr: { bcp47: 'mr-IN', prefixes: ['mr-in', 'mr'], isIndian: true },
    ta: { bcp47: 'ta-IN', prefixes: ['ta-in', 'ta-lk', 'ta'], isIndian: true },
    ur: { bcp47: 'ur-IN', prefixes: ['ur-in', 'ur-pk', 'ur'], isIndian: true },
    gu: { bcp47: 'gu-IN', prefixes: ['gu-in', 'gu'], isIndian: true },
    kn: { bcp47: 'kn-IN', prefixes: ['kn-in', 'kn'], isIndian: true },
    ml: { bcp47: 'ml-IN', prefixes: ['ml-in', 'ml'], isIndian: true },
    or: { bcp47: 'or-IN', prefixes: ['or-in', 'or', 'od-in', 'od'], isIndian: true },
    pa: { bcp47: 'pa-IN', prefixes: ['pa-in', 'pa-pk', 'pa'], isIndian: true },
    as: { bcp47: 'as-IN', prefixes: ['as-in', 'as', 'bn-in', 'bn'], isIndian: true },
    mai: { bcp47: 'mai-IN', prefixes: ['mai-in', 'mai', 'hi-in', 'hi'], isIndian: true },
    sat: { bcp47: 'sat-IN', prefixes: ['sat-in', 'sat', 'hi-in', 'hi'], isIndian: true },
    ks: { bcp47: 'ks-IN', prefixes: ['ks-in', 'ks', 'ur-in', 'ur'], isIndian: true },
    ne: { bcp47: 'ne-NP', prefixes: ['ne-np', 'ne-in', 'ne'], isIndian: true },
    sd: { bcp47: 'sd-IN', prefixes: ['sd-in', 'sd', 'ur-in', 'ur'], isIndian: true },
    kok: { bcp47: 'kok-IN', prefixes: ['kok-in', 'kok', 'mr-in', 'mr'], isIndian: true },
    doi: { bcp47: 'doi-IN', prefixes: ['doi-in', 'doi', 'hi-in', 'hi'], isIndian: true },
    mni: { bcp47: 'mni-IN', prefixes: ['mni-in', 'mni', 'bn-in', 'bn'], isIndian: true },
    brx: { bcp47: 'brx-IN', prefixes: ['brx-in', 'brx', 'as-in', 'as'], isIndian: true },
    sa: { bcp47: 'sa-IN', prefixes: ['sa-in', 'sa', 'hi-in', 'hi'], isIndian: true },
    // International
    es: { bcp47: 'es-ES', prefixes: ['es-es', 'es-mx', 'es-us', 'es'] },
    fr: { bcp47: 'fr-FR', prefixes: ['fr-fr', 'fr-ca', 'fr'] },
    de: { bcp47: 'de-DE', prefixes: ['de-de', 'de-at', 'de-ch', 'de'] },
    ar: { bcp47: 'ar-SA', prefixes: ['ar-sa', 'ar-eg', 'ar-ae', 'ar'] },
    ru: { bcp47: 'ru-RU', prefixes: ['ru-ru', 'ru'] },
    ja: { bcp47: 'ja-JP', prefixes: ['ja-jp', 'ja'] },
    pt: { bcp47: 'pt-PT', prefixes: ['pt-pt', 'pt-br', 'pt'] },
    zh: { bcp47: 'zh-CN', prefixes: ['zh-cn', 'zh-sg', 'zh-tw', 'zh-hk', 'zh'] },
  };

  const config = targetConfigs[language] || targetConfigs.en;
  const langDisplay = LANGUAGE_NAMES[language] || language;

  if (voices && voices.length > 0) {
    // 1. Direct match for selected language prefix
    for (const prefix of config.prefixes) {
      const match = voices.find((v) => {
        const lang = norm(v.lang);
        return lang === prefix || lang.startsWith(prefix);
      });
      if (match) {
        return {
          voice: match,
          langCode: match.lang || config.bcp47,
          isFallback: false,
        };
      }
    }

    // 2. Regional Indian Voice Fallbacks (Marathi, Nepali, Gujarati, etc. -> 'hi-IN')
    if (config.isIndian && language !== 'en') {
      const hindiVoice = voices.find((v) => {
        const lang = norm(v.lang);
        return lang.startsWith('hi-in') || lang.startsWith('hi');
      });

      if (hindiVoice) {
        return {
          voice: hindiVoice,
          langCode: 'hi-IN',
          isFallback: true,
        };
      }

      // If no explicit Hindi voice object is listed in browser, still map to 'hi-IN'
      // so the underlying synthesizer uses Devanagari / Indic phonetics
      return {
        voice: null,
        langCode: 'hi-IN',
        isFallback: true,
      };
    }

    // 3. International fallback to English if non-Indian
    if (!config.isIndian && language !== 'en') {
      const standardEnglish = voices.find((v) => norm(v.lang).startsWith('en'));
      if (standardEnglish) {
        return {
          voice: standardEnglish,
          langCode: 'en-US',
          isFallback: true,
        };
      }
    }

    // 4. Any default voice
    const defaultVoice = voices.find((v) => v.default) || voices[0];
    if (defaultVoice) {
      return {
        voice: defaultVoice,
        langCode: config.isIndian && language !== 'en' ? 'hi-IN' : config.bcp47,
        isFallback: true,
      };
    }
  }

  // Fallback when voices are still initializing
  return {
    voice: null,
    langCode: config.isIndian && language !== 'en' ? 'hi-IN' : config.bcp47,
    isFallback: false,
  };
}

/**
 * Checks if a string contains characters from the native script of the selected language
 */
export function hasTargetScript(text: string, lang: LanguageCode): boolean {
  if (!text) return false;
  switch (lang) {
    case 'hi':
    case 'mr':
    case 'mai':
    case 'ne':
    case 'kok':
    case 'doi':
    case 'brx':
    case 'sa':
      return /[\u0900-\u097F]/.test(text); // Devanagari script
    case 'bn':
    case 'as':
    case 'mni':
      return /[\u0980-\u09FF]/.test(text); // Bengali / Assamese
    case 'pa':
      return /[\u0A00-\u0A7F]/.test(text); // Gurmukhi
    case 'gu':
      return /[\u0A80-\u0AFF]/.test(text); // Gujarati
    case 'or':
      return /[\u0B00-\u0B7F]/.test(text); // Odia
    case 'ta':
      return /[\u0B80-\u0BFF]/.test(text); // Tamil
    case 'te':
      return /[\u0C00-\u0C7F]/.test(text); // Telugu
    case 'kn':
      return /[\u0C80-\u0CFF]/.test(text); // Kannada
    case 'ml':
      return /[\u0D00-\u0D7F]/.test(text); // Malayalam
    case 'ur':
    case 'ks':
    case 'sd':
    case 'ar':
      return /[\u0600-\u06FF]/.test(text); // Arabic / Perso-Arabic
    case 'sat':
      return /[\u1C50-\u1C7F\u0900-\u097F]/.test(text); // Ol Chiki or Devanagari
    case 'ru':
      return /[\u0400-\u04FF]/.test(text); // Cyrillic
    case 'ja':
      return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text); // Japanese
    case 'zh':
      return /[\u4E00-\u9FFF]/.test(text); // Chinese
    case 'es':
    case 'fr':
    case 'de':
    case 'pt':
    case 'en':
    default:
      return /[a-zA-Z]/.test(text);
  }
}

/**
 * Ensures the briefing is translated into the target script.
 * If Gemini returned output in the target language and script, it is preserved seamlessly!
 */
export function getLocalizedBriefing(
  briefing: AIBriefing | null,
  lang: LanguageCode,
  persona: Persona,
  secondaryPersona: Persona | null | undefined,
  city: City,
  weather: WeatherData
): AIBriefing {
  // If English is selected, return existing if it has Latin text
  if (lang === 'en') {
    if (briefing && hasTargetScript(briefing.headline, 'en')) {
      return briefing;
    }
  }

  // If non-English and briefing already contains the target script from Gemini, return it directly!
  if (briefing && lang !== 'en' && hasTargetScript(briefing.headline, lang)) {
    return briefing;
  }

  const cityName = city.name;
  const isSevere = weather.alertLevel === 'red' || weather.alertLevel === 'orange';
  const isRain = weather.rainProb > 40 || weather.condition.toLowerCase().includes('rain');

  // Telugu Fallback
  if (lang === 'te') {
    return {
      headline: `వాతావరణ బులెటిన్ (${cityName}): ${persona.title} — ${
        isSevere ? 'అప్రమత్తంగా ఉండండి' : 'సాధారణ దినచర్యకు అనుకూలం'
      }`,
      tailoredImpact: `ప్రస్తుత ఉష్ణోగ్రత ${weather.temp}°C (అనుభూతి ${weather.feelsLike}°C), గాలిలో తేమ ${
        weather.humidity
      }%. ${
        isRain
          ? 'వర్ష సూచన ఉన్నందున ప్రయాణాల్లో జాగ్రత్తలు పాటించండి.'
          : 'వాతావరణం ప్రశాంతంగా ఉండి పనులకు అనుకూలంగా ఉంటుంది.'
      }`,
      actionRecommendation: isRain
        ? 'గొడుగు వెంట ఉంచుకోండి, నీరు నిలిచే రహదారులను నివారించండి.'
        : 'తగినంత నీరు త్రాగండి, మధ్యాహ్నం ఎండలో తగిన జాగ్రత్తలు తీసుకోండి.',
      goldenWindow: 'ఉదయం 06:00 - 08:30 IST',
      keyMetrics: [
        `ఉష్ణోగ్రత: ${weather.temp}°C`,
        `వర్షం అవకాశం: ${weather.rainProb}%`,
        `గాలి వేగం: ${weather.windSpeed} కి.మీ/గం`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // Gujarati Fallback
  if (lang === 'gu') {
    return {
      headline: `હવામાન બુલેટિન (${cityName}): ${persona.title} — ${
        isSevere ? 'સાવચેત રહો' : 'દૈનિક કામકાજ માટે અનુકૂળ'
      }`,
      tailoredImpact: `હાલનું તાપમાન ${weather.temp}°C (અનુભવાતું ${weather.feelsLike}°C) અને ભેજ ${
        weather.humidity
      }% છે. ${
        isRain
          ? 'વરસાદની સંભાવનાને કારણે મુસાફરીમાં સાવચેતી રાખવી.'
          : 'હવામાન અનુકૂળ હોવાથી દૈનિક કાર્યો સરળતાથી થઈ શકશે.'
      }`,
      actionRecommendation: isRain
        ? 'છત્રી સાથે રાખો અને પાણી ભરાયેલા રસ્તાઓ ટાળો.'
        : 'પૂરતું પાણી પીઓ અને બપોરના તડકાથી રક્ષણ મેળવો.',
      goldenWindow: 'સવારે 06:00 - 08:30 IST',
      keyMetrics: [
        `તાપમાન: ${weather.temp}°C`,
        `વરસાદની શક્યતા: ${weather.rainProb}%`,
        `પવનની ગતિ: ${weather.windSpeed} કિમી/કલાક`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // Kannada Fallback
  if (lang === 'kn') {
    return {
      headline: `ಹವಾಮಾನ ವರದಿ (${cityName}): ${persona.title} — ${
        isSevere ? 'ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ' : 'ದೈನಂದಿನ ಕೆಲಸಗಳಿಗೆ ಅನುಕೂಲಕರ'
      }`,
      tailoredImpact: `ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${weather.temp}°C (ಅನುಭವ ${weather.feelsLike}°C), ತೇವಾಂಶ ${
        weather.humidity
      }%. ${
        isRain
          ? 'ಮಳೆಯ ಸಾಧ್ಯತೆಯಿರುವುದರಿಂದ ಪ್ರಯಾಣದ ವೇಳೆ ಜಾಗರೂಕರಾಗಿರಿ.'
          : 'ಹವಾಮಾನವು ಸಾಮಾನ್ಯ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸೂಕ್ತವಾಗಿದೆ.'
      }`,
      actionRecommendation: isRain
        ? 'ಕೊಡೆ ಜೊತೆಗಿಟ್ಟುಕೊಳ್ಳಿ ಮತ್ತು ನೀರು ನಿಲ್ಲುವ ರಸ್ತೆಗಳನ್ನು ತಪ್ಪಿಸಿ.'
        : 'ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ, ಮಧ್ಯಾಹ್ನದ ಬಿಸಿಲಿನಿಂದ ರಕ್ಷಿಸಿಕೊಳ್ಳಿ.',
      goldenWindow: 'ಬೆಳಗ್ಗೆ 06:00 - 08:30 IST',
      keyMetrics: [
        `ತಾಪಮಾನ: ${weather.temp}°C`,
        `ಮಳೆಯ ಸಾಧ್ಯತೆ: ${weather.rainProb}%`,
        `ಗಾಳಿಯ ವೇಗ: ${weather.windSpeed} ಕಿ.ಮೀ/ಗಂ`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // Malayalam Fallback
  if (lang === 'ml') {
    return {
      headline: `കാലാവസ്ഥാ ബുള്ളറ്റിൻ (${cityName}): ${persona.title} — ${
        isSevere ? 'ജാഗ്രത പാലിക്കുക' : 'ദൈനംദിന കാര്യങ്ങൾക്ക് അനുകൂലം'
      }`,
      tailoredImpact: `നിലവിലെ താപനില ${weather.temp}°C (അനുഭവപ്പെടുന്നത് ${weather.feelsLike}°C), ഈർപ്പം ${
        weather.humidity
      }%. ${
        isRain
          ? 'മഴ സാധ്യതയുള്ളതിനാൽ യാത്രകളിൽ മുൻകരുതൽ എടുക്കുക.'
          : 'പുറംജോലികൾക്ക് കാലാവസ്ഥ അനുകൂലമായിരിക്കും.'
      }`,
      actionRecommendation: isRain
        ? 'കുട കരുതുക, വെള്ളക്കെട്ടുള്ള വഴികൾ ഒഴിവാക്കുക.'
        : 'ധാരാളം വെള്ളം കുടിക്കുക, ഉച്ചവെയിൽ ഒഴിവാക്കുക.',
      goldenWindow: 'രാവിലെ 06:00 - 08:30 IST',
      keyMetrics: [
        `താപനില: ${weather.temp}°C`,
        `മഴ സാധ്യത: ${weather.rainProb}%`,
        `കാറ്റിന്റെ വേഗത: ${weather.windSpeed} കി.മീ/മ`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // Urdu Fallback
  if (lang === 'ur') {
    return {
      headline: `موسمیاتی بلیٹن (${cityName}): ${persona.title} — ${
        isSevere ? 'محتاط رہنے کی ضرورت ہے' : 'روزمرہ معمولات کے لیے سازگار'
      }`,
      tailoredImpact: `موجودہ درجہ حرارت ${weather.temp}°C (محسوس ${weather.feelsLike}°C) اور نمی ${
        weather.humidity
      }% ہے۔ ${
        isRain
          ? 'بارش کے امکان کے پیش نظر سفر کے دوران احتیاط برتیں۔'
          : 'موسم عمومی سرگرمیوں کے لیے مناسب رہے گا۔'
      }`,
      actionRecommendation: isRain
        ? 'چھتری ساتھ رکھیں اور نشیبی راستوں سے گریز کریں۔'
        : 'پانی کا مناسب استعمال جاری رکھیں اور دوپہر کی دھوپ سے بچیں۔',
      goldenWindow: 'صبح 06:00 - 08:30 IST',
      keyMetrics: [
        `درجہ حرارت: ${weather.temp}°C`,
        `بارش کا امکان: ${weather.rainProb}%`,
        `ہوا کی رفتار: ${weather.windSpeed} کلومیٹر/گھنٹہ`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // Punjabi Fallback
  if (lang === 'pa') {
    return {
      headline: `ਮੌਸਮ ਬੁਲੇਟਿਨ (${cityName}): ${persona.title} — ${
        isSevere ? 'ਸਾਵਧਾਨੀ ਵਰਤੋ' : 'ਰੋਜ਼ਾਨਾ ਕੰਮਾਂ ਲਈ ਅਨੁਕੂਲ'
      }`,
      tailoredImpact: `ਮੌਜੂਦਾ ਤਾਪਮਾਨ ${weather.temp}°C (ਮਹਿਸੂਸ ${weather.feelsLike}°C) ਅਤੇ ਨਮੀ ${
        weather.humidity
      }% ਹੈ। ${
        isRain
          ? 'ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਦੇ ਮੱਦੇਨਜ਼ਰ ਯਾਤਰਾ ਦੌਰਾਨ ਸਾਵਧਾਨ ਰਹੋ।'
          : 'ਸਮੁੱਚੇ ਤੌਰ ਤੇ ਦਿਨ ਆਮ ਗਤੀਵਿਧੀਆਂ ਲਈ ਵਧੀਆ ਰਹੇਗਾ।'
      }`,
      actionRecommendation: isRain
        ? 'ਛਤਰੀ ਨਾਲ ਰੱਖੋ ਅਤੇ ਪਾਣੀ ਭਰੇ ਰਸਤਿਆਂ ਤੋਂ ਬਚੋ।'
        : 'ਲੋੜੀਂਦਾ ਪਾਣੀ ਪੀਓ ਅਤੇ ਧੁੱਪ ਤੋਂ ਬਚਾਅ ਰੱਖੋ।',
      goldenWindow: 'ਸਵੇਰੇ 06:00 - 08:30 IST',
      keyMetrics: [
        `ਤਾਪਮਾਨ: ${weather.temp}°C`,
        `ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ: ${weather.rainProb}%`,
        `ਹਵਾ ਦੀ ਗਤੀ: ${weather.windSpeed} ਕਿਮੀ/ਘੰਟਾ`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // Spanish Fallback
  if (lang === 'es') {
    return {
      headline: `Boletín Meteorológico (${cityName}): ${persona.title} — ${
        isSevere ? 'Precaución recomendada' : 'Condiciones favorables'
      }`,
      tailoredImpact: `Temperatura actual: ${weather.temp}°C (sensación térmica de ${weather.feelsLike}°C), humedad al ${
        weather.humidity
      }%. ${
        isRain
          ? 'Probabilidad de precipitaciones; planifique sus desplazamientos con antelación.'
          : 'Jornada propicia para el desarrollo habitual de actividades.'
      }`,
      actionRecommendation: isRain
        ? 'Lleve paraguas o chubasquero y evite calzadas inundables.'
        : 'Mantenga una buena hidratación y protección solar durante el mediodía.',
      goldenWindow: '06:00 - 08:30 IST',
      keyMetrics: [
        `Temp: ${weather.temp}°C`,
        `Lluvia: ${weather.rainProb}%`,
        `Viento: ${weather.windSpeed} km/h`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // French Fallback
  if (lang === 'fr') {
    return {
      headline: `Bulletin Météorologique (${cityName}): ${persona.title} — ${
        isSevere ? 'Vigilance de rigueur' : 'Conditions favorables'
      }`,
      tailoredImpact: `Température actuelle: ${weather.temp}°C (ressentie ${weather.feelsLike}°C), humidité à ${
        weather.humidity
      }%. ${
        isRain
          ? 'Risque d’averses; prévoyez vos trajets avec prudence.'
          : 'Conditions clémentes pour l’ensemble des activités quotidiennes.'
      }`,
      actionRecommendation: isRain
        ? 'Munissez-vous d’un parapluie et soyez prudent sur les routes humides.'
        : 'Pensez à bien vous hydrater et protégez-vous du soleil aux heures chaudes.',
      goldenWindow: '06:00 - 08:30 IST',
      keyMetrics: [
        `Temp: ${weather.temp}°C`,
        `Pluie: ${weather.rainProb}%`,
        `Vent: ${weather.windSpeed} km/h`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // German Fallback
  if (lang === 'de') {
    return {
      headline: `Wetterbericht (${cityName}): ${persona.title} — ${
        isSevere ? 'Erhöhte Aufmerksamkeit geboten' : 'Günstige Bedingungen'
      }`,
      tailoredImpact: `Aktuelle Temperatur: ${weather.temp}°C (gefühlte ${weather.feelsLike}°C), Luftfeuchtigkeit ${
        weather.humidity
      }%. ${
        isRain
          ? 'Regenrisiko vorhanden; bitte Verkehrsbehinderungen einplanen.'
          : 'Insgesamt gute Voraussetzungen für Ihre Tagesplanung.'
      }`,
      actionRecommendation: isRain
        ? 'Regenschutz mitführen und nasse Straßenabschnitte beachten.'
        : 'Auf ausreichende Flüssigkeitszufuhr achten und Sonnenschutz nutzen.',
      goldenWindow: '06:00 - 08:30 IST',
      keyMetrics: [
        `Temp: ${weather.temp}°C`,
        `Regen: ${weather.rainProb}%`,
        `Wind: ${weather.windSpeed} km/h`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // Japanese Fallback
  if (lang === 'ja') {
    return {
      headline: `気象情報 (${cityName}): ${persona.title} — ${
        isSevere ? '気象の変化にご注意ください' : '良好な活動条件'
      }`,
      tailoredImpact: `現在の気温は ${weather.temp}°C (体感 ${weather.feelsLike}°C)、湿度は ${
        weather.humidity
      }% です。${
        isRain
          ? '雨の予報があるため、外出時は足元や交通情報にご留意ください。'
          : '日中は安定した天候で過ごしやすい一日となる見込みです。'
      }`,
      actionRecommendation: isRain
        ? '傘を携帯し、水たまりや滑りやすい路面にご注意ください。'
        : 'こまめな水分補給と紫外線対策を心がけてください。',
      goldenWindow: '06:00 - 08:30 IST',
      keyMetrics: [
        `気温: ${weather.temp}°C`,
        `降水確率: ${weather.rainProb}%`,
        `風速: ${weather.windSpeed} km/h`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // Arabic Fallback
  if (lang === 'ar') {
    return {
      headline: `النشرة الجوية (${cityName}): ${persona.title} — ${
        isSevere ? 'يُنصح بتوخي الحذر والحيطة' : 'أجواء مناسبة للأنشطة اليومية'
      }`,
      tailoredImpact: `درجة الحرارة الحالية ${weather.temp}°م (الملموسة ${weather.feelsLike}°م) مع رطوبة ${
        weather.humidity
      }%. ${
        isRain
          ? 'احتمال هطول أمطار؛ يُرجى الانتباه أثناء التنقل وتجنب تجمعات المياه.'
          : 'الأجواء ملائمة لممارسة الأنشطة والمهام اليومية بشكل اعتيادي.'
      }`,
      actionRecommendation: isRain
        ? 'احرص على اصطحاب المظلة وتوخي الحذر على الطرق الزلقة.'
        : 'احرص على شرب كميات كافية من الماء وتجنب التعرض المباشر للشمس وقت الظهيرة.',
      goldenWindow: '06:00 - 08:30 بتوقيت الهند (IST)',
      keyMetrics: [
        `الحرارة: ${weather.temp}°م`,
        `فرصة الأمطار: ${weather.rainProb}%`,
        `الرياح: ${weather.windSpeed} كم/س`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // Hindi Fallback
  if (lang === 'hi') {
    const pTitle = PERSONA_TRANSLATIONS.hi?.[persona.id]?.title || persona.title;
    const sTitle = secondaryPersona
      ? PERSONA_TRANSLATIONS.hi?.[secondaryPersona.id]?.title || secondaryPersona.title
      : null;

    const hybridLabel = sTitle ? `संयुक्त प्राथमिकता (${pTitle} + ${sTitle})` : pTitle;

    return {
      headline: `मौसम सलाह (${cityName}): ${hybridLabel} — ${
        isSevere ? 'सतर्कता एवं सावधानी अपेक्षित' : 'दैनिक अनुकूल परिस्थितियां'
      }`,
      tailoredImpact: `वर्तमान तापमान ${weather.temp}°C (महसूस ${weather.feelsLike}°C) है तथा आर्द्रता ${
        weather.humidity
      }% दर्ज की गई है। ${
        isRain
          ? 'वर्षा की संभावना के कारण आवागमन तथा बाहरी गतिविधियों में जलभराव का ध्यान रखें।'
          : 'सामान्य मौसमी परिस्थितियों के साथ दिनचर्या अनुकूल बनी रहेगी।'
      }`,
      actionRecommendation: isRain
        ? 'बाहर निकलते समय छाता व रेनकोट साथ रखें तथा जलभराव वाले मार्गों से बचें।'
        : 'दिन के समय पर्याप्त जलपान करें और धूप में निकलते समय आवश्यक सावधानी बरतें।',
      goldenWindow: 'प्रातः 06:00 - 08:30 भा.मा.स. (IST)',
      keyMetrics: [
        `तापमान: ${weather.temp}°C`,
        `बारिश की संभावना: ${weather.rainProb}%`,
        `हवा: ${weather.windSpeed} किमी/घंटा`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // Bengali Fallback
  if (lang === 'bn') {
    const pTitle = PERSONA_TRANSLATIONS.bn?.[persona.id]?.title || persona.title;
    const sTitle = secondaryPersona
      ? PERSONA_TRANSLATIONS.bn?.[secondaryPersona.id]?.title || secondaryPersona.title
      : null;

    const hybridLabel = sTitle ? `যৌথ ফোকাস (${pTitle} + ${sTitle})` : pTitle;

    return {
      headline: `আবহাওয়া বুলেটিন (${cityName}): ${hybridLabel} — ${
        isSevere ? 'সতর্কতা অবলম্বন করুন' : 'দৈনন্দিন কাজের জন্য অনুকূল'
      }`,
      tailoredImpact: `বর্তমান তাপমাত্রা ${weather.temp}°C (অনুভূত ${weather.feelsLike}°C) এবং বাতাসের আর্দ্রতা ${
        weather.humidity
      }%। ${
        isRain
          ? 'বৃষ্টিপাতের পূর্বাভাসের কারণে যাত্রা পরিকল্পনা ও বহিরাঙ্গন কাজ সাবধানে করুন।'
          : 'সামগ্রিকভাবে দিনটি স্বাভাবিক কার্যকলাপে সহায়ক থাকবে।'
      }`,
      actionRecommendation: isRain
        ? 'ছাতা সাথে রাখুন এবং বৃষ্টির সময় নিরাপদ স্থানে আশ্রয় নিন।'
        : 'পর্যাপ্ত জল পান করুন এবং রোদ থেকে চোখ ও ত্বকের সুরক্ষা বজায় রাখুন।',
      goldenWindow: 'সকাল 06:00 - 08:30 আইএসটি (IST)',
      keyMetrics: [
        `तापমাত্রা: ${weather.temp}°C`,
        `বৃষ্টির সম্ভাবনা: ${weather.rainProb}%`,
        `বাতাসের গতি: ${weather.windSpeed} কিমি/ঘণ্টা`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // Marathi Fallback
  if (lang === 'mr') {
    const pTitle = PERSONA_TRANSLATIONS.mr?.[persona.id]?.title || persona.title;
    const sTitle = secondaryPersona
      ? PERSONA_TRANSLATIONS.mr?.[secondaryPersona.id]?.title || secondaryPersona.title
      : null;

    const hybridLabel = sTitle ? `संयुक्त प्राधान्य (${pTitle} + ${sTitle})` : pTitle;

    return {
      headline: `हवामान सल्ला (${cityName}): ${hybridLabel} — ${
        isSevere ? 'सावधगिरी बाळगा' : 'दैनंदिन कामकाजासाठी अनुकूल'
      }`,
      tailoredImpact: `सध्याचे तापमान ${weather.temp}°C (जाणवणारे ${weather.feelsLike}°C) असून आर्द्रता ${
        weather.humidity
      }% आहे। ${
        isRain
          ? 'पावसामुळे रस्त्यांवर पाणी साचण्याची शक्यता असून प्रवास करताना काळजी घ्या.'
          : 'हवामान अनुकूल असून दैनंदिन वेळापत्रक सहजतेने पाळता येईल.'
      }`,
      actionRecommendation: isRain
        ? 'बाहेर पडताना छत्री व रेनकोट सोबत ठेवा, वाहतूक कोंडी टाळण्यासाठी लवकर निघा.'
        : 'उन्हात निघताना डोक्यावर टोपी वापरा आणि शरीरातील पाण्याचे प्रमाण टिकवून ठेवा.',
      goldenWindow: 'सकाळी 06:00 - 08:30 आयएसटी (IST)',
      keyMetrics: [
        `तापमान: ${weather.temp}°C`,
        `पावसाचा धोका: ${weather.rainProb}%`,
        `हवेचा वेग: ${weather.windSpeed} किमी/तास`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // Tamil Fallback
  if (lang === 'ta') {
    const pTitle = PERSONA_TRANSLATIONS.ta?.[persona.id]?.title || persona.title;
    const sTitle = secondaryPersona
      ? PERSONA_TRANSLATIONS.ta?.[secondaryPersona.id]?.title || secondaryPersona.title
      : null;

    const hybridLabel = sTitle ? `கூட்டு கவனம் (${pTitle} + ${sTitle})` : pTitle;

    return {
      headline: `வானிலை அறிக்கை (${cityName}): ${hybridLabel} — ${
        isSevere ? 'எச்சரிக்கை தேவை' : 'வழக்கமான சூழல்'
      }`,
      tailoredImpact: `தற்போதைய வெப்பநிலை ${weather.temp}°C (உணரும் வெப்பம் ${
        weather.feelsLike
      }°C), ஈரப்பதம் ${weather.humidity}%. ${
        isRain
          ? 'மழை காரணமாக பயணங்களில் தாமதம் ஏற்படலாம், முன்னெச்சரிக்கையுடன் செயல்படவும்.'
          : 'வெளிப்புறப் பணிகளுக்கு வானிலை ஏற்றதாக உள்ளது.'
      }`,
      actionRecommendation: isRain
        ? 'குடை எடுத்துச் செல்லுங்கள், நீர் தேங்கும் சாலைப் பகுதிகளைத் தவிர்க்கவும்.'
        : 'போதிய அளவு தண்ணீர் குடிக்கவும், தீவிர வெயில் நேரங்களை தவிர்க்கவும்.',
      goldenWindow: 'காலை 06:00 - 08:30 ஐஎஸ்டி (IST)',
      keyMetrics: [
        `வெப்பநிலை: ${weather.temp}°C`,
        `மழை வாய்ப்பு: ${weather.rainProb}%`,
        `காற்று: ${weather.windSpeed} கிமீ/மணி`,
      ],
      source: briefing?.source || 'IMD Synoptic AI',
    };
  }

  // English fallback if briefing was null
  return (
    briefing || {
      headline: `Weather Briefing (${cityName}): Favorable conditions for ${persona.title}`,
      tailoredImpact: `Current temperature is ${weather.temp}°C (feels like ${weather.feelsLike}°C) with humidity at ${weather.humidity}%.`,
      actionRecommendation: 'Stay updated with local IMD radar telemetry and maintain hydration.',
      goldenWindow: '06:00 - 08:30 IST',
      keyMetrics: [`Temp: ${weather.temp}°C`, `Rain: ${weather.rainProb}%`, `Wind: ${weather.windSpeed} km/h`],
      source: 'IMD Synoptic AI',
    }
  );
}

/**
 * Builds the complete spoken text in the authentic target language
 */
export function getSpokenBriefingText(
  briefing: AIBriefing | null,
  lang: LanguageCode,
  city: City,
  weather: WeatherData,
  persona: Persona,
  secondaryPersona?: Persona | null
): string {
  const ttsConfig = TTS_LANGUAGE_CONFIG[lang] || TTS_LANGUAGE_CONFIG.en;
  const locBriefing = getLocalizedBriefing(briefing, lang, persona, secondaryPersona, city, weather);

  const intro = ttsConfig.introPrefix(city.name, city.state);
  const localizedLevel =
    ALERT_NAMES_LOCALIZED[lang]?.[weather.alertLevel] || weather.alertLevel;
  const warning = ttsConfig.warningPrefix(localizedLevel);
  const golden = locBriefing.goldenWindow
    ? `${ttsConfig.goldenWindowLabel} ${locBriefing.goldenWindow}.`
    : '';

  const rawSpoken = `${intro} ${warning} ${locBriefing.headline}. ${locBriefing.tailoredImpact}. ${locBriefing.actionRecommendation}. ${golden}`;

  // Clean Markdown formatting and special characters for natural voice output
  return rawSpoken
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#/g, '')
    .replace(/•/g, ', ')
    .replace(/\[.*?\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Helper to get a translation string safely with fallback to English
 */
export function t(key: string, lang: LanguageCode = 'en'): string {
  return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS.en[key] || key;
}

/**
 * Localizes persona object for display
 */
export function getLocalizedPersona<
  T extends { id: PersonaId; title: string; subtitle: string; badge: string; description: string }
>(persona: T, lang: LanguageCode): T {
  const trans = PERSONA_TRANSLATIONS[lang]?.[persona.id];
  if (!trans) return persona;
  return {
    ...persona,
    title: trans.title,
    subtitle: trans.subtitle,
    badge: trans.badge,
    description: trans.description,
  };
}
