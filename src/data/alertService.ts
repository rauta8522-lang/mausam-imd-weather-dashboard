import { WeatherData, City, Persona, WeatherAlertItem, AlertColor } from '../types';

/**
 * Synthesize audio chime using Web Audio API for alert notification
 */
export function playAlertChime(severity: AlertColor) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (severity === 'red' || severity === 'orange') {
      // Two-tone warning chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      const now = ctx.currentTime;
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880.0, now + 0.15); // A5
      osc2.frequency.setValueAtTime(440.0, now); // A4
      osc2.frequency.setValueAtTime(659.25, now + 0.15); // E5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } else {
      // Gentle notification ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    console.debug('Audio chime unable to play:', e);
  }
}

/**
 * Dispatch native browser push notification if permitted
 */
export async function sendNativeNotification(alert: WeatherAlertItem) {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;

  try {
    if (Notification.permission === 'granted') {
      new Notification(`IMD Alert: ${alert.title}`, {
        body: `${alert.message}\nAction: ${alert.actionAdvice || 'Exercise caution.'}`,
        icon: '/favicon.ico',
        tag: alert.id,
      });
      return true;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(`IMD Alert: ${alert.title}`, {
          body: `${alert.message}\nAction: ${alert.actionAdvice || 'Exercise caution.'}`,
          icon: '/favicon.ico',
          tag: alert.id,
        });
        return true;
      }
    }
  } catch (err) {
    console.debug('Browser native notification failed:', err);
  }
  return false;
}

/**
 * Generate automated context-aware alerts for the active meteorological state and personas
 */
export function generateAlertsForState(
  weather: WeatherData,
  city: City,
  primaryPersona: Persona,
  secondaryPersona?: Persona | null
): WeatherAlertItem[] {
  const alerts: WeatherAlertItem[] = [];
  const now = new Date();
  const formatTime = (minusMinutes = 0) => {
    const d = new Date(now.getTime() - minusMinutes * 60000);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // 1. Critical Scenario / IMD Warning Alert
  if (weather.alertLevel === 'red') {
    alerts.push({
      id: `alert-red-warning-${weather.updatedAt}`,
      title: '🔴 RED WARNING: Severe Cyclone & Torrential Rainfall',
      message: `IMD MoES emergency bulletin for ${city.name}. Torrential rain (>115mm) with gale winds gusting to ${weather.windGusts} km/h. High risk of flash flooding and structural damage.`,
      severity: 'red',
      timestamp: formatTime(5),
      category: 'storm',
      personaTarget: 'All Citizens & First Responders',
      actionAdvice: 'STAY INDOORS. Suspend all non-essential road and outdoor movement. Keep emergency supplies ready.',
      read: false,
    });
  } else if (weather.alertLevel === 'orange') {
    alerts.push({
      id: `alert-orange-alert-${weather.updatedAt}`,
      title: '🟠 ORANGE ALERT: Severe Thunderstorm & Squall Activity',
      message: `Deep depression squalls gusting to ${weather.windGusts} km/h with localized waterlogging across ${city.name}. Tree fall and power interruption risks.`,
      severity: 'orange',
      timestamp: formatTime(15),
      category: 'storm',
      personaTarget: 'Commuters & Outdoor Personnel',
      actionAdvice: 'Be prepared: Avoid underpasses, secure rooftop items, and expect airport/railway schedule delays.',
      read: false,
    });
  } else if (weather.alertLevel === 'yellow') {
    alerts.push({
      id: `alert-yellow-watch-${weather.updatedAt}`,
      title: '🟡 YELLOW WATCH: Moderate Atmospheric Disturbance',
      message: `Scattered convective showers (accumulation ${weather.rainMm} mm) and gusty winds in ${city.name}. Roads slick with reduced visibility.`,
      severity: 'yellow',
      timestamp: formatTime(25),
      category: 'rain',
      personaTarget: primaryPersona.title,
      actionAdvice: 'Be updated: Monitor IMD Doppler radar bulletins and keep rain gear accessible.',
      read: false,
    });
  }

  // 2. Air Quality Alerts (AQI)
  if (weather.aqi >= 200) {
    alerts.push({
      id: `alert-aqi-severe-${city.id}`,
      title: '🔴 AQI Spike: Severe Air Degradation Alert',
      message: `AQI reached ${weather.aqi} (${weather.aqiCategory}) in ${city.name} with PM2.5 at ${weather.pm25} µg/m³. Respiratory hazards high for vulnerable groups.`,
      severity: weather.aqi >= 300 ? 'red' : 'orange',
      timestamp: formatTime(35),
      category: 'aqi',
      personaTarget: 'Health & Senior Citizens',
      actionAdvice: 'Wear N95 masks outdoors. Keep home HEPA filtration active. Avoid vigorous outdoor workouts.',
      read: false,
    });
  } else if (weather.aqi >= 120) {
    alerts.push({
      id: `alert-aqi-mod-${city.id}`,
      title: '🟡 Elevated AQI Notice (Unhealthy for Sensitive Groups)',
      message: `AQI stands at ${weather.aqi} (${weather.aqiCategory}). Haze layer trap with PM2.5 at ${weather.pm25} µg/m³.`,
      severity: 'yellow',
      timestamp: formatTime(50),
      category: 'aqi',
      personaTarget: 'Asthma & Allergy Patients',
      actionAdvice: 'Sensitive individuals should limit prolonged afternoon outdoor exposure.',
      read: false,
    });
  }

  // 3. Dense Fog / Visibility Hazard
  if (weather.visibility <= 1.0) {
    alerts.push({
      id: `alert-fog-${city.id}`,
      title: weather.visibility <= 0.5 ? '🔴 Dense Fog Alert: Zero Visibility Hazard' : '🟡 Moderate Fog & Smog Warning',
      message: `Surface visibility restricted to ${weather.visibility} km (${weather.visibilityDesc}). Heavy impact on early commuter highways, Northern Railways, and CAT III airport arrivals.`,
      severity: weather.visibility <= 0.5 ? 'orange' : 'yellow',
      timestamp: formatTime(60),
      category: 'fog',
      personaTarget: 'Commuters & Logistics',
      actionAdvice: 'Use fog lights, reduce driving speed to under 35 km/h, and allow 40% extra buffer time.',
      read: false,
    });
  }

  // 4. Extreme Heat / Heatwave Stress
  if (weather.temp >= 40 || weather.feelsLike >= 43) {
    alerts.push({
      id: `alert-heat-${city.id}`,
      title: '🟠 Severe Heat Stress & Thermal Warning',
      message: `Ambient temperature ${weather.temp}°C (Heat Index feels like ${weather.feelsLike}°C). Danger of heat exhaustion and cramps during midday.`,
      severity: 'orange',
      timestamp: formatTime(40),
      category: 'heat',
      personaTarget: 'Fitness, Outdoor Workers & Children',
      actionAdvice: 'Drink oral rehydration salts (ORS), stay shaded between 11:30 AM - 15:30 PM, wear loose light clothing.',
      read: false,
    });
  }

  // 5. High Solar UV Index
  if (weather.uvIndex >= 8) {
    alerts.push({
      id: `alert-uv-${city.id}`,
      title: '🟡 Very High UV Radiation Index (8+)',
      message: `Solar UV Index currently ${weather.uvIndex} (${weather.uvCategory}). Unprotected skin burn time under 15 minutes.`,
      severity: 'yellow',
      timestamp: formatTime(70),
      category: 'uv',
      personaTarget: 'Health & Outdoor Fitness',
      actionAdvice: 'Apply SPF 50+ broad-spectrum sunscreen and wear UV-400 sunglasses.',
      read: false,
    });
  }

  // 6. Coastal Marine / High Swell Alert
  if (city.coastal && (weather.waveHeight >= 2.5 || weather.seaState === 'Rough' || weather.seaState === 'Very Rough')) {
    alerts.push({
      id: `alert-marine-${city.id}`,
      title: '🟠 High Swell & Rough Sea Marine Advisory',
      message: `Wave heights up to ${weather.waveHeight}m with ${weather.seaState} sea state along ${city.name} coast. Strong rip currents detected.`,
      severity: 'orange',
      timestamp: formatTime(85),
      category: 'storm',
      personaTarget: 'Fishermen & Coastal Residents',
      actionAdvice: 'Fishermen advised not to venture into deep sea or coastal reefs until advisory downgrades.',
      read: false,
    });
  }

  // 7. Persona-Specific Targeted Alerts
  const addPersonaAlert = (p: Persona) => {
    switch (p.id) {
      case 'agriculture':
        if (weather.rainProb >= 60) {
          alerts.push({
            id: `alert-farmer-rain-${p.id}`,
            title: '🟡 Agromet Advisory: Postpone Pesticide & Fertilizer Application',
            message: `${weather.rainProb}% rain probability and high soil moisture (${weather.soilMoisture}%) will cause wash-off. Ensure adequate drainage in standing kharif/rabi beds.`,
            severity: 'yellow',
            timestamp: formatTime(90),
            category: 'persona',
            personaTarget: 'Farmers & Agromet Sector',
            actionAdvice: 'Halt spray operations; secure grain harvests in waterproof storage.',
            read: false,
          });
        }
        break;
      case 'commuters':
        if (weather.rainMm > 15 || weather.visibility < 3.0) {
          alerts.push({
            id: `alert-commuter-transit-${p.id}`,
            title: '🟡 Commute Advisory: Route Congestion & Slick Pavement',
            message: `Rain accumulation (${weather.rainMm} mm) and reduced visibility on arterial thoroughfares. Metro/rail transits experiencing wet track speed restrictions.`,
            severity: 'yellow',
            timestamp: formatTime(15),
            category: 'persona',
            personaTarget: 'Daily Commuters',
            actionAdvice: 'Leave 20 minutes early. Check live traffic maps for underpass detours.',
            read: false,
          });
        }
        break;
      case 'parents':
        if (weather.aqi > 150 || weather.temp > 38 || weather.rainProb > 70) {
          alerts.push({
            id: `alert-parent-child-${p.id}`,
            title: '🟡 School & Child Safety Meteorological Bulletin',
            message: `Weather parameters require school-run adjustments. Keep children hydrated and monitor school transport advisories.`,
            severity: 'yellow',
            timestamp: formatTime(45),
            category: 'persona',
            personaTarget: 'Parents & School Caretakers',
            actionAdvice: 'Pack weather-safe gear and notify school regarding outdoor recess precautions.',
            read: false,
          });
        }
        break;
      case 'fitness':
        alerts.push({
          id: `alert-fitness-window-${p.id}`,
          title: '🟢 Golden Training Window Calculated',
          message: `Diurnal temperature & wind optimum at 05:45 - 07:30 IST. Moderate AQI and minimal UV index before sunrise peak.`,
          severity: 'green',
          timestamp: formatTime(120),
          category: 'persona',
          personaTarget: 'Fitness Enthusiasts & Runners',
          actionAdvice: 'Schedule outdoor cardio and endurance sessions during this optimal morning window.',
          read: true,
        });
        break;
      default:
        break;
    }
  };

  addPersonaAlert(primaryPersona);
  if (secondaryPersona) {
    addPersonaAlert(secondaryPersona);
  }

  // 8. Always ensure at least one routine baseline alert if list is empty
  if (alerts.length === 0) {
    alerts.push({
      id: `alert-routine-${city.id}`,
      title: '🟢 Routine Meteorological Advisory (Green Status)',
      message: `Atmospheric parameters stable across ${city.name}. No severe thunderstorm, squall, or extreme heatwave warnings in force.`,
      severity: 'green',
      timestamp: formatTime(10),
      category: 'general',
      personaTarget: primaryPersona.title,
      actionAdvice: 'Normal citizen activities, commutes, and outdoor operations can proceed as scheduled.',
      read: true,
    });
  }

  return alerts;
}

/**
 * Generate a realistic Test Alert on demand for demo purposes
 */
export function generateTestAlert(
  city: City,
  persona: Persona,
  testSeverity: AlertColor = 'orange'
): WeatherAlertItem {
  const timestamp = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  if (testSeverity === 'red') {
    return {
      id: `test-alert-red-${Date.now()}`,
      title: '🔴 DEMO TEST: Emergency Flash Flood & Severe Cyclone Warning',
      message: `Simulated MoES Flash Bulletin for ${city.name}: Extreme gale gusts >90 km/h and localized inundation expected. Instant emergency broadcast test.`,
      severity: 'red',
      timestamp,
      category: 'storm',
      personaTarget: `${persona.title} (Simulated)`,
      actionAdvice: 'Take immediate shelter indoors away from glass windows and loose trees.',
      read: false,
    };
  }

  if (testSeverity === 'yellow') {
    return {
      id: `test-alert-yellow-${Date.now()}`,
      title: '🟡 DEMO TEST: Sudden Fog & Micro-Rain Advisory',
      message: `Simulated IMD Watch: Visibility dropping below 1.2 km with gusty surface breezes across ${city.name}.`,
      severity: 'yellow',
      timestamp,
      category: 'fog',
      personaTarget: `${persona.title} (Simulated)`,
      actionAdvice: 'Keep fog lights on and follow posted speed reductions.',
      read: false,
    };
  }

  return {
    id: `test-alert-orange-${Date.now()}`,
    title: '🟠 DEMO TEST: Severe Squall & Rapid Rain Burst Alert',
    message: `Simulated IMD Early Warning for ${city.name}: Squall 60 km/h and sudden cloudburst burst detected on Doppler radar. Tailored for ${persona.title}.`,
    severity: 'orange',
    timestamp,
    category: 'storm',
    personaTarget: `${persona.title} (Simulated)`,
    actionAdvice: 'Be prepared: Seek covered parking, carry high-visibility rain protection, and avoid flooded subways.',
    read: false,
  };
}
