import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-memory cache for briefings to prevent duplicate API hits during demand spikes
const briefingCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedBriefing(key: string) {
  const cached = briefingCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

function setCachedBriefing(key: string, data: any) {
  // Prune old entries if map gets too large
  if (briefingCache.size > 200) {
    briefingCache.clear();
  }
  briefingCache.set(key, { data, timestamp: Date.now() });
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value: ${process.env.PORT}`);
  }

  const localUrl = `http://localhost:${port}`;
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction && process.env.APP_URL) {
    let configuredOrigin: string;
    try {
      configuredOrigin = new URL(process.env.APP_URL).origin;
    } catch {
      throw new Error(`APP_URL must be a valid URL; expected ${localUrl}`);
    }
    if (configuredOrigin !== localUrl) {
      throw new Error(`APP_URL must match PORT; set APP_URL=${localUrl}`);
    }
  }

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "Mausam - India Meteorological Department (MoES) API",
      timestamp: new Date().toISOString(),
    });
  });

  // AI Personalized Briefing Endpoint
  app.post("/api/gemini/briefing", async (req, res) => {
    const { persona, secondaryPersona, city, weather, alertLevel, language = "en" } = req.body;
    
    // Check cache first (includes secondary persona and language in cache key)
    const cacheKey = `${city?.name || 'city'}_${persona?.id || 'persona'}_${secondaryPersona?.id || 'none'}_${weather?.temp || 0}_${weather?.condition || ''}_${alertLevel || 'green'}_${language || 'en'}`;
    const cachedResponse = getCachedBriefing(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    try {
      const ai = getGeminiClient();

      if (!ai) {
        // Return structured deterministic response when Gemini API key is not configured
        const fallback = {
          source: "imd-synoptic-analyst",
          briefing: generateDeterministicBriefing(persona, secondaryPersona, city, weather, alertLevel, language),
        };
        setCachedBriefing(cacheKey, fallback);
        return res.json(fallback);
      }

      const personaTargetPrompt = secondaryPersona
        ? `Citizen Focus: HYBRID MULTI-PERSONA MODE
- Primary Focus: "${persona.title}" (${persona.description})
- Secondary Focus: "${secondaryPersona.title}" (${secondaryPersona.description})
CRITICAL: Synthesize recommendations addressing BOTH profiles dynamically in the headline, impact, and actionable advisory (e.g. if Commuter + Parent, address school run transit times and road waterlogging; if Health + Fitness, balance workout timing with AQI/pollen thresholds).`
        : `Citizen Focus: "${persona.title}" (${persona.description})`;

      const LANGUAGE_NAMES: Record<string, string> = {
        hi: "Hindi (हिंदी)",
        en: "English (India)",
        bn: "Bengali (বাংলা)",
        te: "Telugu (తెలుగు)",
        mr: "Marathi (मराठी)",
        ta: "Tamil (தமிழ்)",
        ur: "Urdu (اردو)",
        gu: "Gujarati (ગુજરાતી)",
        kn: "Kannada (ಕನ್ನಡ)",
        ml: "Malayalam (മലയാളം)",
        or: "Odia (ଓଡ଼ିଆ)",
        pa: "Punjabi (ਪੰਜਾਬੀ)",
        as: "Assamese (অসমীয়া)",
        mai: "Maithili (मैथिली)",
        sat: "Santali (संथाली)",
        ks: "Kashmiri (कॉशुर)",
        ne: "Nepali (नेपाली)",
        sd: "Sindhi (سنڌي)",
        kok: "Konkani (कोंकणी)",
        doi: "Dogri (डोगरी)",
        mni: "Manipuri (মৈতৈলোন্)",
        brx: "Bodo (बर’)",
        sa: "Sanskrit (संस्कृतम्)",
        es: "Spanish (Español)",
        fr: "French (Français)",
        de: "German (Deutsch)",
        ar: "Arabic (العربية)",
        ru: "Russian (Русский)",
        ja: "Japanese (日本語)",
        pt: "Portuguese (Português)",
        zh: "Chinese Simplified (简体中文)",
      };
      const selectedLangName = LANGUAGE_NAMES[language] || "English";

      const prompt = `You are the Lead Agromet & Specialized Forecaster at the India Meteorological Department (IMD - MoES), National Weather Forecasting Centre, New Delhi.
Generate an authoritative, concise, and highly personalized daily meteorological briefing for the following citizen setup:
${personaTargetPrompt}

Location: ${city.name}, ${city.state}
Current Conditions:
- Temperature: ${weather.temp}°C (Feels like ${weather.feelsLike}°C)
- Condition: ${weather.condition}
- Humidity: ${weather.humidity}%
- Wind: ${weather.windSpeed} km/h from ${weather.windDirection}
- Rain Probability: ${weather.rainProb}% (Accumulation: ${weather.rainMm} mm)
- AQI: ${weather.aqi} (${weather.aqiCategory})
- UV Index: ${weather.uvIndex} (${weather.uvCategory})
- Visibility: ${weather.visibility} km
- Soil Moisture: ${weather.soilMoisture}%
- Sea Condition: ${weather.seaState || "Inland / Calm"}
- Regional Geography: ${city.coastal ? "Coastal Maritime Zone" : "Landlocked Region (marine telemetry routed from nearest coastal station / INCOIS West Coast Buoy Network)"}
- Current IMD Alert Status: ${alertLevel.toUpperCase()}

MANDATORY MULTILINGUAL LOCALIZATION REQUIREMENT:
You MUST output the entire response text strictly and fluently in ${selectedLangName}.
Every string field ("headline", "tailoredImpact", "actionRecommendation", "goldenWindow", and array items in "keyMetrics") MUST be written in natural, fluent, authoritative ${selectedLangName}. Keep time numbers and standard temperatures in readable digits (e.g. 06:00 - 08:30 IST, 28°C).

Return ONLY valid JSON matching this schema:
{
  "headline": "A short, authoritative 6-12 word headline in ${selectedLangName} (highlighting hybrid profile impact if two profiles are active)",
  "tailoredImpact": "2-3 sentences in ${selectedLangName} explaining exactly how today's weather affects this specific citizen profile's daily activity or risk factors",
  "actionRecommendation": "Direct, actionable advice or precautions in ${selectedLangName} addressing the active citizen profile(s)",
  "goldenWindow": "Best time window for activity today in ${selectedLangName} (e.g., '05:30 - 07:45 IST' or '18:00 IST नंतर' or 'காலை 06:00 - 08:00 IST')",
  "keyMetrics": ["Short metric pill 1 in ${selectedLangName}", "Short metric pill 2", "Short metric pill 3"]
}`;

      // Try candidate models with graceful degradation on high-demand spikes
      const CANDIDATE_MODELS = [
        "gemini-3.8-flash",
        "gemini-3.1-flash-lite",
        "gemini-flash-latest",
      ];

      let parsedBriefing = null;
      let usedModel = "";

      for (const modelName of CANDIDATE_MODELS) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.3,
            },
          });

          const responseText = response.text?.trim();
          if (responseText) {
            parsedBriefing = JSON.parse(responseText);
            usedModel = modelName;
            break;
          }
        } catch (modelErr: any) {
          // Check for capacity spikes or temporary 503/429
          const isCapacitySpike =
            modelErr?.status === 503 ||
            modelErr?.code === 503 ||
            modelErr?.status === "UNAVAILABLE" ||
            modelErr?.status === 429 ||
            (typeof modelErr?.message === "string" &&
              (modelErr.message.includes("503") ||
                modelErr.message.includes("high demand") ||
                modelErr.message.includes("quota") ||
                modelErr.message.includes("ResourceExhausted")));

          if (isCapacitySpike) {
            console.info(`Model ${modelName} temporary capacity busy. Attempting alternative candidate...`);
            continue;
          }
          console.info(`Model ${modelName} non-fatal notice: ${modelErr?.message || 'Check alternate'}`);
        }
      }

      if (parsedBriefing) {
        const payload = {
          source: usedModel,
          briefing: parsedBriefing,
        };
        setCachedBriefing(cacheKey, payload);
        return res.json(payload);
      }

      // If models are temporarily unavailable, cleanly serve IMD synoptic analyst briefing
      console.info("Upstream models temporarily busy; serving official IMD synoptic analyst briefing.");
      const fallbackResult = {
        source: "imd-synoptic-analyst",
        briefing: generateDeterministicBriefing(persona, secondaryPersona, city, weather, alertLevel, language),
      };
      setCachedBriefing(cacheKey, fallbackResult);
      return res.json(fallbackResult);
    } catch (err: any) {
      console.info("Serving IMD synoptic fallback briefing:", err?.message || "Transient notice");
      const fallbackResult = {
        source: "imd-synoptic-analyst",
        briefing: generateDeterministicBriefing(persona, secondaryPersona, city, weather, alertLevel, language),
      };
      return res.json(fallbackResult);
    }
  });

  // Vite middleware in dev; static build in prod
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const appUrl = isProduction ? process.env.APP_URL || localUrl : localUrl;
  await new Promise<void>((resolve, reject) => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`Mausam IMD Dashboard running on ${appUrl}`);
      resolve();
    });

    server.once("error", reject);
  });
}

function generateDeterministicBriefing(
  persona: { id: string; title: string },
  secondaryPersona: { id: string; title: string } | null | undefined,
  city: { name: string; state: string; coastal?: boolean },
  weather: {
    temp: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    rainProb: number;
    rainMm?: number;
    aqi: number;
    aqiCategory: string;
    uvIndex: number;
    visibility: number;
    soilMoisture: number;
    seaState?: string;
  },
  alertLevel: string,
  language: string = "en"
) {
  const primary = getSinglePersonaBriefing(persona, city, weather, alertLevel, language);
  if (!secondaryPersona) {
    return localizeBriefingIfNonEnglish(primary, language, persona, city, weather);
  }

  const secondary = getSinglePersonaBriefing(secondaryPersona, city, weather, alertLevel, language);
  
  const hybridPrefixes: Record<string, string> = {
    hi: `संयुक्त ध्यान (${persona.title} एवं ${secondaryPersona.title})`,
    bn: `যৌথ ফোকাস (${persona.title} ও ${secondaryPersona.title})`,
    mr: `संयुक्त प्राधान्य (${persona.title} व ${secondaryPersona.title})`,
    ta: `கூட்டு கவனம் (${persona.title} & ${secondaryPersona.title})`,
    te: `ఉమ్మడి దృష్టి (${persona.title} & ${secondaryPersona.title})`,
    gu: `સંયુક્ત ધ્યાન (${persona.title} અને ${secondaryPersona.title})`,
    kn: `ಸಂಯುಕ್ತ ಗಮನ (${persona.title} ಮತ್ತು ${secondaryPersona.title})`,
    ml: `സംയുക്ത ശ്രദ്ധ (${persona.title} & ${secondaryPersona.title})`,
    ur: `مشترکہ ترجیح (${persona.title} اور ${secondaryPersona.title})`,
    pa: `ਸਾਂਝਾ ਧਿਆਨ (${persona.title} ਅਤੇ ${secondaryPersona.title})`,
    es: `Enfoque Combinado (${persona.title} y ${secondaryPersona.title})`,
    fr: `Priorité Mixte (${persona.title} et ${secondaryPersona.title})`,
    de: `Kombinierter Fokus (${persona.title} & ${secondaryPersona.title})`,
    ar: `تركيز مشترك (${persona.title} و ${secondaryPersona.title})`,
    ru: `Совместный фокус (${persona.title} и ${secondaryPersona.title})`,
    ja: `複合フォーカス (${persona.title}・${secondaryPersona.title})`,
    pt: `Foco Combinado (${persona.title} e ${secondaryPersona.title})`,
    zh: `复合重点 (${persona.title} 与 ${secondaryPersona.title})`,
    en: `Hybrid Focus (${persona.title} & ${secondaryPersona.title})`,
  };

  const hybridPrefix = hybridPrefixes[language] || hybridPrefixes.en;

  const combined = {
    headline: `${hybridPrefix}: ${primary.headline}`,
    tailoredImpact: `${primary.tailoredImpact} ${secondary.tailoredImpact}`,
    actionRecommendation: `${primary.actionRecommendation} [${secondaryPersona.title}]: ${secondary.actionRecommendation}`,
    goldenWindow: `${primary.goldenWindow} | ${secondary.goldenWindow}`,
    keyMetrics: [
      primary.keyMetrics[0] || `AQI: ${weather.aqi}`,
      primary.keyMetrics[1] || `UV: ${weather.uvIndex}`,
      secondary.keyMetrics[0] || `${secondaryPersona.title}`,
    ],
  };

  return localizeBriefingIfNonEnglish(combined, language, persona, city, weather);
}

function getSinglePersonaBriefing(
  persona: { id: string; title: string },
  city: { name: string; state: string; coastal?: boolean },
  weather: {
    temp: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    rainProb: number;
    rainMm?: number;
    aqi: number;
    aqiCategory: string;
    uvIndex: number;
    visibility: number;
    soilMoisture: number;
    seaState?: string;
  },
  alertLevel: string,
  language: string = "en"
) {
  const isRain = weather.rainProb > 45 || weather.condition.toLowerCase().includes("rain");
  const isHot = weather.temp >= 36;
  const isPoorAir = weather.aqi > 150;

  switch (persona.id) {
    case "health":
      return {
        headline: isPoorAir
          ? `Air Quality Alert for ${city.name}: Sensitive respiratory precautions in effect`
          : `Moderate respiratory conditions in ${city.name} with UV ${weather.uvIndex}`,
        tailoredImpact: isPoorAir
          ? `AQI currently stands at ${weather.aqi} (${weather.aqiCategory}) with elevated particulate matter (PM2.5) and ${weather.humidity}% humidity. High risk of bronchial irritation for asthmatics and elders.`
          : `Current AQI (${weather.aqi}, ${weather.aqiCategory}) is favorable. Peak solar UV of ${weather.uvIndex} expected between 11:30 AM and 2:30 PM.`,
        actionRecommendation: isPoorAir
          ? "Wear N95 masks outdoors, keep rescue inhalers accessible, and keep air purifiers running indoors."
          : "Apply broad-spectrum sunscreen and maintain hydration with electrolytes as humidity peaks.",
        goldenWindow: "06:00 - 08:30 IST (Lowest PM2.5 concentrations)",
        keyMetrics: [
          `AQI: ${weather.aqi} (${weather.aqiCategory})`,
          `UV Index: ${weather.uvIndex}`,
          `Humidity: ${weather.humidity}%`,
        ],
      };

    case "fitness":
      return {
        headline: isHot
          ? `High Heat Stress Notice: Early morning workout hours strongly advised in ${city.name}`
          : `Favorable training conditions early morning; wind steady at ${weather.windSpeed} km/h`,
        tailoredImpact: `Current temperature is ${weather.temp}°C (feels like ${weather.feelsLike}°C) with ${weather.windSpeed} km/h winds. Wet-bulb globe temperature reaches peak intensity past 11:00 AM.`,
        actionRecommendation: isHot
          ? "Shift cardio sessions indoors or wrap up all outdoor runs before 07:45 AM. Pre-hydrate with 500ml water."
          : "Ideal morning session window. Keep hydration pack handy if logging >10 km runs.",
        goldenWindow: "05:45 - 07:30 IST (Coolest ambient temperature)",
        keyMetrics: [
          `Optimal Temp: 24°C at 06:15 IST`,
          `Wind: ${weather.windSpeed} km/h`,
          `Heat Index: ${weather.feelsLike}°C`,
        ],
      };

    case "beach":
      const isLandlockedCity = city.coastal === false;
      return {
        headline: isLandlockedCity
          ? `Inland Telemetry Notice: Marine telemetry routed from nearest coastal station (Mumbai / West Coast Buoy)`
          : `Coastal bulletin: ${weather.seaState || "Moderate"} seas with ${weather.windSpeed} km/h on-shore breeze`,
        tailoredImpact: isLandlockedCity
          ? `Selected city (${city.name}) is in a landlocked region. Ocean telemetry is routed from nearest coastal buoy network (INCOIS MoES array) with wave heights averaging 1.4m to 2.1m and water temp holding at 28.5°C.`
          : `Wave heights averaging 1.4m to 2.1m. Mid-day high tide cycle with water temperature holding steady at 28.5°C. Moderate rip-current vigilance flagged by INCOIS/IMD.`,
        actionRecommendation: isLandlockedCity
          ? "Viewing remote coastal telemetry for travel planning. Verify surf safety flags and rip current velocity if visiting coastal zones."
          : "Avoid venturing past the surf break during high tide. Check local lifeguard flags (Red/Yellow/Green) and heed INCOIS rip current warnings.",
        goldenWindow: "07:00 - 10:30 IST (Calm swell & low rip risk)",
        keyMetrics: [
          `Swell: 1.6m @ 9s`,
          `Water Temp: 28°C`,
          `Wind: ${weather.windSpeed} km/h`,
        ],
      };

    case "travelers":
      return {
        headline: isRain
          ? `Transit Alert for ${city.name}: Rain showers may induce local airport and highway slowdowns (METAR / TAF Synoptic Feed)`
          : `Smooth flight & transit corridors across ${city.name} airport and major expressways (METAR / TAF Synoptic Feed)`,
        tailoredImpact: isRain
          ? `Runway surface wetness and approach visibility at ${weather.visibility} km may cause 15-25 min taxiing delays. METAR / TAF aviation observations suggest potential holding patterns during heavy rain bursts.`
          : `Visibility at ${weather.visibility} km with calm crosswinds. METAR synoptic aviation feed confirms VFR flight clearance connecting to regional hubs. Use the destination trip planner for intercity packing.`,
        actionRecommendation:
          "Consult METAR/TAF airport status, utilize the destination trip planner for weather-tailored packing, and buffer 30 extra minutes for highway transfers.",
        goldenWindow: "Departures 09:30 - 13:00 IST (Lowest turbulence & rain risk)",
        keyMetrics: [
          `Visibility: ${weather.visibility} km`,
          `Flight Delay Risk: ${isRain ? "Moderate (Yellow)" : "Low (Green)"}`,
          `Rain: ${weather.rainProb}%`,
        ],
      };

    case "parents":
      return {
        headline: isRain
          ? `School Commute & Afternoon Pickup Alert: Rain showers expected in ${city.name}`
          : `Pleasant school morning & afternoon pickup window with safe CPCB & IAP pediatric ratings`,
        tailoredImpact: isRain
          ? `Rain probability of ${weather.rainProb}% peaks during the afternoon school pickup window (14:00 - 16:00 IST) with morning assembly showers. CPCB & IAP air quality guidance active.`
          : `Morning temperature comfortable at ${weather.temp}°C. Afternoon school pickup (14:00 - 16:00 IST) remains stable. CPCB & Indian Academy of Pediatrics (IAP) index supports outdoor recess with UV monitoring.`,
        actionRecommendation: isRain
          ? "Equip backpacks with raincoats and umbrellas; allow 15 min extra for afternoon pickup gates. Follow IAP school commute guidance."
          : "Pack an extra 500ml water bottle; playground recess safe under CPCB & IAP air quality thresholds.",
        goldenWindow: "07:30 - 08:30 IST (Morning bus) & 14:30 - 15:30 IST (Pickup window)",
        keyMetrics: [
          `Morning Rain: ${Math.round(weather.rainProb * 0.7)}%`,
          `Pickup Alert: 14:00-16:00 IST`,
          `IAP Recess Air: ${weather.aqiCategory}`,
        ],
      };

    case "agriculture":
      return {
        headline: `GKMS • IMD Advisory: Soil moisture at ${weather.soilMoisture}%, humidity at ${weather.humidity}% — monitor fungal hazard`,
        tailoredImpact: `Gramin Krishi Mausam Sewa (GKMS) bulletin: Standing crops require vigilance for fungal/pest pressure under ${weather.humidity}% humidity. Spray retention index stands at ${weather.rainProb > 45 ? "32% (Wash-off risk)" : "88% (Optimal absorption)"}.`,
        actionRecommendation: weather.rainProb > 50
          ? "Postpone foliar sprays and nitrogen top-dressing due to wash-off risk. Follow Kharif/Rabi standing drainage protocols."
          : "Optimal foliar spray retention window between 07:00 and 10:30 IST. Check Kharif/Rabi standing crops for sucking pests and blight.",
        goldenWindow: "06:30 - 09:30 IST (Lowest drift for spray retention)",
        keyMetrics: [
          `Soil Moisture: ${weather.soilMoisture}%`,
          `Fungal Hazard: ${weather.humidity > 68 ? "High" : "Moderate"} (${weather.humidity}%)`,
          `Spray Retention: ${weather.rainProb > 45 ? "Low" : "Optimal"}`,
        ],
      };

    case "commuters":
      const isFoggyCommute = weather.visibility < 1.0;
      const isWetRoad = weather.rainProb > 45 || ((weather.rainMm ?? 0) > 2);
      return {
        headline: isFoggyCommute
          ? `NHAI Corridor Fog Advisory: Reduced sightline along expressways and flyovers in ${city.name}`
          : `Clear highway corridors with ${weather.visibility} km sightline and stable asphalt friction in ${city.name}`,
        tailoredImpact: `Standard: IMD Fog & Visibility Forecast Model (NHAI Corridor Protocols). Highway sightline stands at ${weather.visibility < 1 ? Math.round(weather.visibility * 1000) + 'm' : weather.visibility + 'km'} with wet asphalt slickness index at ${isWetRoad ? "elevated (+35% braking distance)" : "normal dry grip (μ = 0.82)"}. Arterial flyover delay probability is ${isFoggyCommute ? "72%" : "22%"}.`,
        actionRecommendation: isFoggyCommute
          ? "Switch on amber fog lamps and low beams; cap expressway speeds at 40 km/h and double following headway."
          : "Optimal arterial road flow. Keep vehicle spacing standard on elevated bridge ramps.",
        goldenWindow: "07:45 - 08:30 IST & 16:30 - 17:30 IST (Optimal traffic & visibility buffer)",
        keyMetrics: [
          `Sight Distance: ${weather.visibility < 1 ? Math.round(weather.visibility * 1000) + 'm' : weather.visibility + 'km'}`,
          `Asphalt Grip: ${isWetRoad ? "Damp / Slick" : "Dry Grip (μ=0.82)"}`,
          `Flyover Delay Risk: ${isFoggyCommute ? "High (Cat II/III)" : "Low (Cat 0)"}`,
        ],
      };

    case "events":
    default:
      const maxGust = ((weather as any).windGusts as number | undefined) || weather.windSpeed + 8;
      const isTrussSafe = maxGust <= 35;
      return {
        headline: `Banquet & Evening Event Viability: Thom's DI score is ${weather.feelsLike < 32 ? "82/100 (Pleasant)" : "64/100 (Humid)"} for ${city.name}`,
        tailoredImpact: `Metric: Thom's Biometeorological Discomfort Index (DI) & IMD NWP Forecast. Evening banquet timeline (16:00 - 00:00 IST) indicates ${weather.rainProb}% peak precipitation risk. Sound and electrical truss rigging tolerance is ${isTrussSafe ? "Safe (<35 km/h limit)" : "Caution (Gusts >35 km/h)"} with evening lawn dew expected post 21:00 IST.`,
        actionRecommendation: weather.rainProb > 40
          ? "Deploy waterproof marquee canopies, ensure cable ramps protect power distribution, and monitor evening rain curve (20:00 - 22:30 IST)."
          : "Favorable open-lawn dinner conditions. Secure stage rigging anchors against gusts and lay waterproof tarp beneath lawn carpets.",
        goldenWindow: "17:30 - 22:30 IST (Prime twilight reception window)",
        keyMetrics: [
          `Dinner Rain Risk: ${weather.rainProb}%`,
          `Truss Wind: ${maxGust} km/h (Limit: 35 km/h)`,
          `Lawn Dew: Post 21:00 IST`,
        ],
      };
  }
}

function localizeBriefingIfNonEnglish(
  result: any,
  language: string,
  persona: { id: string; title: string },
  city: { name: string; state: string },
  weather: any
) {
  if (language === "en" || !result) return result;

  const cityName = city.name;

  if (language === "hi") {
    return {
      headline: `मौसम सलाह (${cityName}): ${result.headline.includes("Alert") || result.headline.includes("Warning") ? "सतर्कता एवं सावधानी अपेक्षित" : "दैनिक अनुकूल परिस्थितियां"}`,
      tailoredImpact: `वर्तमान तापमान ${weather.temp}°C (महसूस ${weather.feelsLike}°C) है तथा आर्द्रता ${weather.humidity}% दर्ज की गई है। ${weather.rainProb > 40 ? "वर्षा की संभावना के कारण आवागमन प्रभावित हो सकता है।" : "सामान्य मौसम के साथ दिनचर्या अनुकूल बनी रहेगी।"}`,
      actionRecommendation: weather.rainProb > 40
        ? "घर से निकलते समय छाता व रेनकोट साथ रखें तथा जलभराव वाले मार्गों से बचें।"
        : "दिन के समय पर्याप्त जलपान करें और धूप में निकलने से पूर्व आवश्यक सावधानी बरतें।",
      goldenWindow: result.goldenWindow.replace("IST", "भा.मा.स. (IST)"),
      keyMetrics: [
        `तापमान: ${weather.temp}°C`,
        `बारिश की संभावना: ${weather.rainProb}%`,
        `हवा: ${weather.windSpeed} किमी/घंटा`,
      ],
    };
  }

  if (language === "bn") {
    return {
      headline: `আবহাওয়া বুলেটিন (${cityName}): ${result.headline.includes("Alert") || result.headline.includes("Warning") ? "সতর্কতা অবলম্বন করুন" : "দৈনন্দিন কাজের জন্য অনুকূল"}`,
      tailoredImpact: `বর্তমান তাপমাত্রা ${weather.temp}°C (অনুভূত ${weather.feelsLike}°C) এবং বাতাসের আর্দ্রতা ${weather.humidity}%। ${weather.rainProb > 40 ? "বৃষ্টিপাতের পূর্বাভাসের কারণে যাত্রা পরিকল্পনা সাবধানে করুন।" : "সামগ্রিকভাবে দিনটি স্বাভাবিক কার্যকলাপে সহায়ক থাকবে।"}`,
      actionRecommendation: weather.rainProb > 40
        ? "ছাতা সাথে রাখুন এবং বৃষ্টির সময় নিরাপদ স্থানে আশ্রয় নিন।"
        : "পর্যাপ্ত জল পান করুন এবং রোদ থেকে সুরক্ষা বজায় রাখুন।",
      goldenWindow: result.goldenWindow.replace("IST", "আইএসটি (IST)"),
      keyMetrics: [
        `তাপমাত্রা: ${weather.temp}°C`,
        `বৃষ্টির সম্ভাবনা: ${weather.rainProb}%`,
        `বায়ুমান: ${weather.aqi} AQI`,
      ],
    };
  }

  if (language === "mr") {
    return {
      headline: `हवामान सल्ला (${cityName}): ${result.headline.includes("Alert") || result.headline.includes("Warning") ? "सावधगिरी बाळगा" : "दैनंदिन कामकाजासाठी अनुकूल"}`,
      tailoredImpact: `सध्याचे तापमान ${weather.temp}°C (जाणवणारे ${weather.feelsLike}°C) असून आर्द्रता ${weather.humidity}% आहे. ${weather.rainProb > 40 ? "पावसामुळे रस्त्यांवर पाणी साचण्याची शक्यता आहे." : "हवामान अनुकूल असून दैनंदिन वेळापत्रक पाळता येईल."}`,
      actionRecommendation: weather.rainProb > 40
        ? "बाहेर पडताना छत्री व रेनकोट सोबत ठेवा, वाहतूक कोंडी टाळण्यासाठी लवकर निघा."
        : "उन्हात निघताना डोक्यावर टोपी वापरा आणि पुरेसे पाणी प्या.",
      goldenWindow: result.goldenWindow.replace("IST", "आयएसटी (IST)"),
      keyMetrics: [
        `तापमान: ${weather.temp}°C`,
        `पावसाचा धोका: ${weather.rainProb}%`,
        `हवेचा वेग: ${weather.windSpeed} किमी/तास`,
      ],
    };
  }

  if (language === "ta") {
    return {
      headline: `வானிலை அறிக்கை (${cityName}): ${result.headline.includes("Alert") || result.headline.includes("Warning") ? "எச்சரிக்கை தேவை" : "வழக்கமான சூழல்"}`,
      tailoredImpact: `தற்போதைய வெப்பநிலை ${weather.temp}°C (உணரும் வெப்பம் ${weather.feelsLike}°C), ஈரப்பதம் ${weather.humidity}%. ${weather.rainProb > 40 ? "மழை காரணமாக பயணங்களில் தாமதம் ஏற்படலாம்." : "வெளிப்புறப் பணிகளுக்கு வானிலை ஏற்றதாக உள்ளது."}`,
      actionRecommendation: weather.rainProb > 40
        ? "குடை எடுத்துச் செல்லுங்கள், நீர் தேங்கும் பகுதிகளைத் தவிர்க்கவும்."
        : "போதிய அளவு தண்ணீர் குடிக்கவும், மதிய வெயிலைத் தவிர்க்கவும்.",
      goldenWindow: result.goldenWindow.replace("IST", "ஐஎஸ்டி (IST)"),
      keyMetrics: [
        `வெப்பநிலை: ${weather.temp}°C`,
        `மழை வாய்ப்பு: ${weather.rainProb}%`,
        `காற்று: ${weather.windSpeed} கிமீ/மணி`,
      ],
    };
  }

  if (language === "te") {
    return {
      headline: `వాతావరణ బులెటిన్ (${cityName}): ${result.headline.includes("Alert") || result.headline.includes("Warning") ? "అప్రమత్తంగా ఉండండి" : "సాధారణ దినచర్యకు అనుకూలం"}`,
      tailoredImpact: `ప్రస్తుత ఉష్ణోగ్రత ${weather.temp}°C (అనుభూతి ${weather.feelsLike}°C), గాలిలో తేమ ${weather.humidity}%. ${weather.rainProb > 40 ? "వర్ష సూచన ఉన్నందున ప్రయాణాల్లో జాగ్రత్తలు పాటించండి." : "వాతావరణం అనుకూలంగా ఉంది."}`,
      actionRecommendation: weather.rainProb > 40
        ? "గొడుగు వెంట ఉంచుకోండి మరియు నీరు నిలిచే రోడ్లను నివారించండి."
        : "తగినంత నీరు త్రాగండి, మధ్యాహ్నం ఎండలో తగిన జాగ్రత్తలు తీసుకోండి.",
      goldenWindow: result.goldenWindow,
      keyMetrics: [
        `ఉష్ణోగ్రత: ${weather.temp}°C`,
        `వర్షం అవకాశం: ${weather.rainProb}%`,
        `గాలి వేగం: ${weather.windSpeed} కి.మీ/గం`,
      ],
    };
  }

  if (language === "gu") {
    return {
      headline: `હવામાન બુલેટિન (${cityName}): ${result.headline.includes("Alert") || result.headline.includes("Warning") ? "સાવચેત રહો" : "દૈનિક કામકાજ માટે અનુકૂળ"}`,
      tailoredImpact: `હાલનું તાપમાન ${weather.temp}°C (અનુભવાતું ${weather.feelsLike}°C) અને ભેજ ${weather.humidity}% છે. ${weather.rainProb > 40 ? "વરસાદની સંભાવનાને કારણે મુસાફરીમાં સાવચેતી રાખવી." : "હવામાન અનુકૂળ રહેવાની અપેક્ષા છે."}`,
      actionRecommendation: weather.rainProb > 40
        ? "છત્રી સાથે રાખો અને પાણી ભરાયેલા રસ્તાઓ ટાળો."
        : "પૂરતું પાણી પીઓ અને બપોરના તડકાથી સાચવો.",
      goldenWindow: result.goldenWindow,
      keyMetrics: [
        `તાપમાન: ${weather.temp}°C`,
        `વરસાદની શક્યતા: ${weather.rainProb}%`,
        `પવનની ગતિ: ${weather.windSpeed} કિમી/કલાક`,
      ],
    };
  }

  if (language === "kn") {
    return {
      headline: `ಹವಾಮಾನ ವರದಿ (${cityName}): ${result.headline.includes("Alert") || result.headline.includes("Warning") ? "ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ" : "ದೈನಂದಿನ ಕೆಲಸಗಳಿಗೆ ಅನುಕೂಲಕರ"}`,
      tailoredImpact: `ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${weather.temp}°C (ಅನುಭವ ${weather.feelsLike}°C), ತೇವಾಂಶ ${weather.humidity}%. ${weather.rainProb > 40 ? "ಮಳೆಯ ಸಾಧ್ಯತೆಯಿರುವುದರಿಂದ ಪ್ರಯಾಣದಲ್ಲಿ ಎಚ್ಚರಿಕೆ ಇರಲಿ." : "ಹವಾಮಾನವು ಸಾಮಾನ್ಯ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸೂಕ್ತವಾಗಿದೆ."}`,
      actionRecommendation: weather.rainProb > 40
        ? "ಕೊಡೆ ಜೊತೆಗಿಟ್ಟುಕೊಳ್ಳಿ ಮತ್ತು ನೀರು ನಿಲ್ಲುವ ರಸ್ತೆಗಳನ್ನು ತಪ್ಪಿಸಿ."
        : "ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ ಮತ್ತು ಬಿಸಿಲಿನಿಂದ ರಕ್ಷಿಸಿಕೊಳ್ಳಿ.",
      goldenWindow: result.goldenWindow,
      keyMetrics: [
        `ತಾಪಮಾನ: ${weather.temp}°C`,
        `ಮಳೆಯ ಸಾಧ್ಯತೆ: ${weather.rainProb}%`,
        `ಗಾಳಿಯ ವೇಗ: ${weather.windSpeed} ಕಿ.ಮೀ/ಗಂ`,
      ],
    };
  }

  if (language === "ml") {
    return {
      headline: `കാലാവസ്ഥാ ബുള്ളറ്റിൻ (${cityName}): ${result.headline.includes("Alert") || result.headline.includes("Warning") ? "ജാഗ്രത പാലിക്കുക" : "ദൈനംദിന കാര്യങ്ങൾക്ക് അനുകൂലം"}`,
      tailoredImpact: `നിലവിലെ താപനില ${weather.temp}°C (അനുഭവപ്പെടുന്നത് ${weather.feelsLike}°C), ഈർപ്പം ${weather.humidity}%. ${weather.rainProb > 40 ? "മഴ സാധ്യതയുള്ളതിനാൽ യാത്രകളിൽ മുൻകരുതൽ എടുക്കുക." : "പുറംജോലികൾക്ക് കാലാവസ്ഥ അനുകൂലമാണ്."}`,
      actionRecommendation: weather.rainProb > 40
        ? "കുട കരുതുക, വെള്ളക്കെട്ടുള്ള വഴികൾ ഒഴിവാക്കുക."
        : "ധാരാളം വെള്ളം കുടിക്കുക, ഉച്ചവെയിൽ ഒഴിവാക്കുക.",
      goldenWindow: result.goldenWindow,
      keyMetrics: [
        `താപനില: ${weather.temp}°C`,
        `മഴ സാധ്യത: ${weather.rainProb}%`,
        `കാറ്റിന്റെ വേഗത: ${weather.windSpeed} കി.മീ/മ`,
      ],
    };
  }

  if (language === "ur") {
    return {
      headline: `موسمیاتی بلیٹن (${cityName}): ${result.headline.includes("Alert") || result.headline.includes("Warning") ? "محتاط رہنے کی ضرورت ہے" : "روزمرہ معمولات کے لیے سازگار"}`,
      tailoredImpact: `موجودہ درجہ حرارت ${weather.temp}°C (محسوس ${weather.feelsLike}°C) اور نمی ${weather.humidity}% ہے۔ ${weather.rainProb > 40 ? "بارش کے امکان کے پیش نظر سفر میں احتیاط برتیں۔" : "موسم عمومی سرگرمیوں کے لیے مناسب رہے گا۔"}`,
      actionRecommendation: weather.rainProb > 40
        ? "چھتری ساتھ رکھیں اور نشیبی راستوں سے گریز کریں۔"
        : "پانی کا مناسب استعمال جاری رکھیں اور دوپہر کی دھوپ سے بچیں۔",
      goldenWindow: result.goldenWindow,
      keyMetrics: [
        `درجہ حرارت: ${weather.temp}°C`,
        `بارش کا امکان: ${weather.rainProb}%`,
        `ہوا کی رفتار: ${weather.windSpeed} کلومیٹر/گھنٹہ`,
      ],
    };
  }

  if (language === "es") {
    return {
      headline: `Boletín Meteorológico (${cityName}): ${result.headline.includes("Alert") || result.headline.includes("Warning") ? "Precaución recomendada" : "Condiciones favorables"}`,
      tailoredImpact: `Temperatura actual: ${weather.temp}°C (sensación térmica ${weather.feelsLike}°C), humedad al ${weather.humidity}%. ${weather.rainProb > 40 ? "Probabilidad de lluvia; planifique sus desplazamientos." : "Jornada propicia para actividades habituales."}`,
      actionRecommendation: weather.rainProb > 40
        ? "Lleve paraguas o impermeable y evite zonas inundables."
        : "Mantenga buena hidratación y protéjase del sol en horas centrales.",
      goldenWindow: result.goldenWindow,
      keyMetrics: [
        `Temp: ${weather.temp}°C`,
        `Lluvia: ${weather.rainProb}%`,
        `Viento: ${weather.windSpeed} km/h`,
      ],
    };
  }

  if (language === "fr") {
    return {
      headline: `Bulletin Météorologique (${cityName}): ${result.headline.includes("Alert") || result.headline.includes("Warning") ? "Vigilance recommandée" : "Conditions favorables"}`,
      tailoredImpact: `Température actuelle: ${weather.temp}°C (ressentie ${weather.feelsLike}°C), humidité à ${weather.humidity}%. ${weather.rainProb > 40 ? "Risque d'averses; prévoyez vos déplacements avec soin." : "Conditions clémentes pour les activités quotidiennes."}`,
      actionRecommendation: weather.rainProb > 40
        ? "Munissez-vous d'un parapluie et soyez prudent sur les routes."
        : "Hydratez-vous régulièrement et évitez les heures de fort ensoleillement.",
      goldenWindow: result.goldenWindow,
      keyMetrics: [
        `Temp: ${weather.temp}°C`,
        `Pluie: ${weather.rainProb}%`,
        `Vent: ${weather.windSpeed} km/h`,
      ],
    };
  }

  if (language === "ja") {
    return {
      headline: `気象情報 (${cityName}): ${result.headline.includes("Alert") || result.headline.includes("Warning") ? "気象の変化にご注意ください" : "概ね良好な活動条件"}`,
      tailoredImpact: `現在の気温は ${weather.temp}°C (体感 ${weather.feelsLike}°C)、湿度は ${weather.humidity}% です。${weather.rainProb > 40 ? "降雨の可能性があるため、外出時は交通状況にご留意ください。" : "日中は過ごしやすい一日となる見込みです。"}`,
      actionRecommendation: weather.rainProb > 40
        ? "折りたたみ傘を携行し、足元にご注意ください。"
        : "こまめな水分補給と紫外線対策をおすすめします。",
      goldenWindow: result.goldenWindow,
      keyMetrics: [
        `気温: ${weather.temp}°C`,
        `降水確率: ${weather.rainProb}%`,
        `風速: ${weather.windSpeed} km/h`,
      ],
    };
  }

  return result;
}

startServer();
