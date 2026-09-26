export type PersonaId =
  | 'health'
  | 'fitness'
  | 'beach'
  | 'travelers'
  | 'parents'
  | 'agriculture'
  | 'commuters'
  | 'events';

export type AlertColor = 'green' | 'yellow' | 'orange' | 'red';

export type LanguageCategory = 'indian' | 'international';

export type LanguageCode =
  // Official & Regional Indian Languages (All 22 Scheduled + English India)
  | 'hi'
  | 'en'
  | 'bn'
  | 'te'
  | 'mr'
  | 'ta'
  | 'ur'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'or'
  | 'pa'
  | 'as'
  | 'mai'
  | 'sat'
  | 'ks'
  | 'ne'
  | 'sd'
  | 'kok'
  | 'doi'
  | 'mni'
  | 'brx'
  | 'sa'
  // Major International Languages
  | 'es'
  | 'fr'
  | 'de'
  | 'ar'
  | 'ru'
  | 'ja'
  | 'pt'
  | 'zh';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  bcp47: string;
  category: LanguageCategory;
  region?: string;
  script?: string;
  englishSub?: string;
}

export interface Persona {
  id: PersonaId;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  description: string;
  targetFocus: string[];
  themeColor: string;
  prioritizedWidgets: WidgetId[];
}

export type WidgetId =
  | 'aqi_pollen'
  | 'uv_health'
  | 'fitness_hours'
  | 'marine_tides'
  | 'coastal_surf'
  | 'travel_destinations'
  | 'trip_planner'
  | 'family_commute'
  | 'agromet_soil'
  | 'crop_pest'
  | 'visibility_traffic'
  | 'fog_slickness'
  | 'event_comfort'
  | 'banquet_evening'
  | 'hourly_timeline'
  | 'weekly_outlook'
  | 'radar_satellite';

export interface City {
  id: string;
  name: string;
  hindiName: string;
  state: string;
  lat: number;
  lon: number;
  zone: string;
  coastal: boolean;
}

export interface HourlyData {
  time: string;
  temp: number;
  feelsLike: number;
  pop: number; // probability of precipitation %
  rainMm: number;
  windSpeed: number;
  humidity: number;
  uvIndex: number;
  condition: string;
  conditionCode: string;
}

export interface DailyForecast {
  day: string;
  date: string;
  maxTemp: number;
  minTemp: number;
  rainProb: number;
  rainMm: number;
  condition: string;
  conditionCode: string;
  alertLevel: AlertColor;
}

export interface SavedDestination {
  city: string;
  code: string;
  state: string;
  temp: number;
  condition: string;
  flightStatus: 'On Time' | 'Weather Delay 20m' | 'Severe Crosswind Alert' | 'Gate Hold';
  statusColor: 'green' | 'yellow' | 'orange' | 'red';
  packingAdvice: string;
}

export interface WeatherData {
  city: City;
  updatedAt: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  conditionCode: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  windGusts: number;
  uvIndex: number;
  uvCategory: string;
  aqi: number;
  aqiCategory: string;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  pollenTrees: 'Low' | 'Moderate' | 'High' | 'Very High';
  pollenGrass: 'Low' | 'Moderate' | 'High' | 'Very High';
  pollenWeeds: 'Low' | 'Moderate' | 'High' | 'Very High';
  visibility: number; // in km
  visibilityDesc: string;
  soilMoisture: number; // percentage
  soilTemp: number; // °C
  rainProb: number; // percentage
  rainMm: number;
  seaState: 'Calm' | 'Slight' | 'Moderate' | 'Rough' | 'Very Rough';
  waveHeight: number; // meters
  waterTemp: number; // °C
  tideNextHigh: string;
  tideNextLow: string;
  ripCurrentRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  sunrise: string;
  sunset: string;
  goldenHourMorning: string;
  goldenHourEvening: string;
  alertLevel: AlertColor;
  alertTitle: string;
  alertDescription: string;
  hourly: HourlyData[];
  daily: DailyForecast[];
  savedDestinations: SavedDestination[];
}

export interface AIBriefing {
  headline: string;
  tailoredImpact: string;
  actionRecommendation: string;
  goldenWindow: string;
  keyMetrics: string[];
  source: string;
  loading?: boolean;
}

export interface WeatherAlertItem {
  id: string;
  title: string;
  message: string;
  severity: AlertColor;
  timestamp: string;
  category: 'aqi' | 'storm' | 'fog' | 'heat' | 'uv' | 'rain' | 'general' | 'persona';
  personaTarget?: string;
  read: boolean;
  actionAdvice?: string;
}
