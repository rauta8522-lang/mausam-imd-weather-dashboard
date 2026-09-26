import { City, WeatherData, AlertColor, SavedDestination } from '../types';

export type WeatherScenario =
  | 'green_normal'
  | 'yellow_watch'
  | 'orange_alert'
  | 'red_warning'
  | 'live'
  | 'current_normal'
  | 'cyclone_alert'
  | 'winter_fog'
  | 'heatwave';

export const SCENARIO_LABELS: Record<WeatherScenario, { name: string; alertLevel: AlertColor; desc: string }> = {
  green_normal: {
    name: '🟢 Green (Normal / Routine)',
    alertLevel: 'green',
    desc: 'Standard seasonal climate with moderate temperature & routine advisories',
  },
  yellow_watch: {
    name: '🟡 Yellow (Watch / Moderate Rain & Gusts)',
    alertLevel: 'yellow',
    desc: 'Be updated: Moderate rain spells, localized road water pooling & fog watch',
  },
  orange_alert: {
    name: '🟠 Orange (Alert / Severe Thunderstorm)',
    alertLevel: 'orange',
    desc: 'Be prepared: Squalls 50-65 km/h, heavy downpours & arterial road delays',
  },
  red_warning: {
    name: '🔴 Red (Warning / Severe Cyclone & Emergency)',
    alertLevel: 'red',
    desc: 'Take action: Extreme torrential rain >115mm, gale gusts >85 km/h, stay indoors',
  },
  live: {
    name: '🛰️ Live Open-Meteo & IMD Feed',
    alertLevel: 'green',
    desc: 'Real-time satellite & station telemetry via Open-Meteo API',
  },
  current_normal: {
    name: '🟢 Normal Weather (Green)',
    alertLevel: 'green',
    desc: 'Standard seasonal climate with moderate temperature & gentle breeze',
  },
  cyclone_alert: {
    name: '🟠 Cyclonic Storm & Rain (Orange Alert)',
    alertLevel: 'orange',
    desc: 'Deep depression, heavy rainfall bursts, high swell & coastal squalls',
  },
  winter_fog: {
    name: '🟡 Dense Winter Fog & High AQI (Yellow Watch)',
    alertLevel: 'yellow',
    desc: 'Low visibility < 500m, elevated PM2.5, airport & train delays',
  },
  heatwave: {
    name: '🟠 Severe Heatwave (Orange Alert)',
    alertLevel: 'orange',
    desc: 'Extreme thermal stress > 41°C, high UV radiation, dry topsoil',
  },
};

export async function fetchWeatherData(
  city: City,
  scenario: WeatherScenario = 'current_normal'
): Promise<WeatherData> {
  if (scenario === 'live') {
    try {
      return await fetchLiveOpenMeteoWeather(city);
    } catch (err) {
      console.warn('Failed to fetch live weather, falling back to realistic normal data', err);
      return generateScenarioWeather(city, 'current_normal');
    }
  }

  return generateScenarioWeather(city, scenario);
}

async function fetchLiveOpenMeteoWeather(city: City): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m,uv_index,relative_humidity_2m,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset&timezone=Asia%2FKolkata`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const data = await res.json();

  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;

  const temp = Math.round(current.temperature_2m);
  const feelsLike = Math.round(current.apparent_temperature);
  const weatherCode = current.weather_code;
  const condition = getWeatherCodeDescription(weatherCode);
  const windSpeed = Math.round(current.wind_speed_10m);
  const humidity = Math.round(current.relative_humidity_2m);
  const pressure = Math.round(current.surface_pressure);
  const windDirection = getWindDirectionText(current.wind_direction_10m);
  const rainProb = daily.precipitation_probability_max?.[0] ?? Math.min(100, Math.round((current.precipitation || 0) * 20));
  const rainMm = current.precipitation || 0;

  // Derive AQI and visibility
  const baseAqi = city.id === 'delhi' ? 185 : city.id === 'mumbai' ? 95 : 75;
  const aqi = baseAqi + Math.floor(Math.random() * 20) - 10;
  const aqiCategory = getAqiCategory(aqi);

  // Hourly mapping (next 12 hours)
  const currentHour = new Date().getHours();
  const hourlyData = [];
  for (let i = 0; i < 12; i++) {
    const idx = (currentHour + i) % 24;
    const hTime = `${(currentHour + i) % 24}:00`;
    hourlyData.push({
      time: i === 0 ? 'Now' : hTime,
      temp: Math.round(hourly.temperature_2m?.[idx] ?? temp),
      feelsLike: Math.round((hourly.temperature_2m?.[idx] ?? temp) + 1),
      pop: Math.round(hourly.precipitation_probability?.[idx] ?? rainProb),
      rainMm: +(hourly.precipitation?.[idx] ?? 0).toFixed(1),
      windSpeed: Math.round(hourly.wind_speed_10m?.[idx] ?? windSpeed),
      humidity: Math.round(hourly.relative_humidity_2m?.[idx] ?? humidity),
      uvIndex: Math.round(hourly.uv_index?.[idx] ?? 4),
      condition: getWeatherCodeDescription(weatherCode),
      conditionCode: 'partly_cloudy',
    });
  }

  // Daily mapping (next 7 days)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = new Date().getDay();
  const dailyData = [];
  for (let i = 0; i < 7; i++) {
    const dayName = i === 0 ? 'Today' : daysOfWeek[(todayIndex + i) % 7];
    const maxT = Math.round(daily.temperature_2m_max?.[i] ?? temp + 2);
    const minT = Math.round(daily.temperature_2m_min?.[i] ?? temp - 6);
    const dRain = Math.round(daily.precipitation_probability_max?.[i] ?? 20);
    const dCode = daily.weather_code?.[i] ?? weatherCode;
    dailyData.push({
      day: dayName,
      date: `Sep ${21 + i}`,
      maxTemp: maxT,
      minTemp: minT,
      rainProb: dRain,
      rainMm: +(daily.precipitation_sum?.[i] ?? 1.2).toFixed(1),
      condition: getWeatherCodeDescription(dCode),
      conditionCode: 'cloudy',
      alertLevel: (dRain > 70 ? 'orange' : dRain > 40 ? 'yellow' : 'green') as AlertColor,
    });
  }

  const uvIndex = Math.max(1, Math.min(11, Math.round(hourly.uv_index?.[currentHour] ?? 6)));
  const alertLevel: AlertColor = rainProb > 75 ? 'orange' : rainProb > 45 ? 'yellow' : 'green';

  return {
    city,
    updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST (Live Feed)',
    temp,
    feelsLike,
    tempMin: Math.round(daily.temperature_2m_min?.[0] ?? temp - 5),
    tempMax: Math.round(daily.temperature_2m_max?.[0] ?? temp + 3),
    condition,
    conditionCode: 'live',
    humidity,
    pressure,
    windSpeed,
    windDirection,
    windGusts: windSpeed + 8,
    uvIndex,
    uvCategory: getUvCategory(uvIndex),
    aqi,
    aqiCategory,
    pm25: Math.round(aqi * 0.62),
    pm10: Math.round(aqi * 1.15),
    no2: 24,
    so2: 12,
    pollenTrees: aqi > 150 ? 'High' : 'Moderate',
    pollenGrass: 'Moderate',
    pollenWeeds: 'Low',
    visibility: 7.5,
    visibilityDesc: 'Good - Normal Driving Conditions',
    soilMoisture: city.coastal ? 62 : 44,
    soilTemp: temp - 2,
    rainProb,
    rainMm,
    seaState: city.coastal ? (windSpeed > 30 ? 'Rough' : 'Moderate') : 'Calm',
    waveHeight: city.coastal ? +(1.2 + (windSpeed / 30)).toFixed(1) : 0.4,
    waterTemp: city.coastal ? 28.2 : 24.0,
    tideNextHigh: '13:45 IST (1.8m)',
    tideNextLow: '19:30 IST (0.5m)',
    ripCurrentRisk: windSpeed > 30 ? 'High' : 'Moderate',
    sunrise: daily.sunrise?.[0]?.split('T')[1] || '06:12',
    sunset: daily.sunset?.[0]?.split('T')[1] || '18:24',
    goldenHourMorning: '05:45 - 06:45 IST',
    goldenHourEvening: '17:35 - 18:35 IST',
    alertLevel,
    alertTitle: alertLevel === 'orange' ? 'Heavy Rain Watch' : alertLevel === 'yellow' ? 'Thunderstorm Warning' : 'No Severe Weather Warning',
    alertDescription: alertLevel === 'green'
      ? 'No active meteorological warning for this division. Conditions normal across urban and rural zones.'
      : 'Squally winds and localized waterlogging possible in low-lying roads. Citizens advised to stay updated with IMD bulletins.',
    hourly: hourlyData,
    daily: dailyData,
    savedDestinations: getSavedDestinations(),
  };
}

export function generateScenarioWeather(city: City, scenario: WeatherScenario): WeatherData {
  const isCoastal = city.coastal;
  const isHimalayan = city.id === 'shimla';

  let temp = isHimalayan ? 18 : 31;
  let feelsLike = isHimalayan ? 17 : 34;
  let condition = 'Partly Cloudy';
  let rainProb = 25;
  let rainMm = 1.2;
  let windSpeed = 14;
  let windDirection = 'WSW';
  let humidity = 64;
  let uvIndex = 7;
  let aqi = city.id === 'delhi' ? 180 : 88;
  let visibility = 8.5;
  let visibilityDesc = 'Good - Clear roadways';
  let alertLevel: AlertColor = 'green';
  let alertTitle = 'No Severe Warning (Green Level)';
  let alertDescription = 'Atmospheric conditions stable. Regular outdoor activities and field operations can proceed normally.';
  let soilMoisture = 48;
  let waveHeight = isCoastal ? 1.4 : 0.3;
  let seaState: WeatherData['seaState'] = isCoastal ? 'Moderate' : 'Calm';

  if (scenario === 'red_warning') {
    temp = 23;
    feelsLike = 26;
    condition = 'Torrential Rain & Severe Gale';
    rainProb = 100;
    rainMm = 124.5;
    windSpeed = 76;
    windDirection = 'NE';
    humidity = 98;
    uvIndex = 1;
    aqi = 22;
    visibility = 0.6;
    visibilityDesc = 'Severely Restricted - Zero Visibility in Torrential Downpours';
    alertLevel = 'red';
    alertTitle = 'Severe Cyclone & Heavy Rain Emergency (Red Warning)';
    alertDescription = 'IMD MoES RED ALERT: Take immediate precautionary action! Torrential precipitation (>115 mm), gale gusts 85-110 km/h, flash flooding & storm surge hazards. Stay indoors.';
    soilMoisture = 96;
    waveHeight = isCoastal ? 5.2 : 1.2;
    seaState = 'Very Rough';
  } else if (scenario === 'orange_alert' || scenario === 'cyclone_alert') {
    temp = 26;
    feelsLike = 29;
    condition = 'Heavy Rain & Squalls';
    rainProb = 92;
    rainMm = 62.4;
    windSpeed = 48;
    windDirection = 'ENE';
    humidity = 92;
    uvIndex = 2;
    aqi = 38;
    visibility = 2.4;
    visibilityDesc = 'Poor - Heavy Rain Sheets & Surface Spray';
    alertLevel = 'orange';
    alertTitle = 'Squall & Deep Depression Alert (Orange Level)';
    alertDescription = 'IMD ORANGE ALERT: Be prepared. Gale winds gusting to 65 km/h, intense waterlogging on arterial roads, and flash flooding in low-lying basins.';
    soilMoisture = 86;
    waveHeight = isCoastal ? 3.8 : 0.8;
    seaState = 'Rough';
  } else if (scenario === 'yellow_watch') {
    temp = isHimalayan ? 12 : 28;
    feelsLike = isHimalayan ? 11 : 31;
    condition = 'Scattered Showers & Gusts';
    rainProb = 65;
    rainMm = 18.5;
    windSpeed = 28;
    windDirection = 'SW';
    humidity = 82;
    uvIndex = 4;
    aqi = city.id === 'delhi' ? 220 : 110;
    visibility = 3.5;
    visibilityDesc = 'Moderate - Low-lying haze & wet roadways';
    alertLevel = 'yellow';
    alertTitle = 'Moderate Rain & Gusts Watch (Yellow Level)';
    alertDescription = 'IMD YELLOW WATCH: Be updated. Scattered thunderstorm activity with rain accumulation up to 25mm, gusty surface winds (30-45 km/h), and localized traffic delays.';
    soilMoisture = 62;
    waveHeight = isCoastal ? 2.2 : 0.5;
    seaState = 'Moderate';
  } else if (scenario === 'winter_fog') {
    temp = isHimalayan ? 9 : 17;
    feelsLike = isHimalayan ? 7 : 16;
    condition = 'Dense Fog & Cold Haze';
    rainProb = 5;
    rainMm = 0;
    windSpeed = 6;
    windDirection = 'NW';
    humidity = 88;
    uvIndex = 3;
    aqi = 345; // Very Poor to Severe
    visibility = 0.4; // 400 meters
    visibilityDesc = 'Very Poor - Dense Fog / Runway CAT-III in effect';
    alertLevel = 'yellow';
    alertTitle = 'Dense Fog & Low Visibility Watch (Yellow Level)';
    alertDescription = 'Visibility below 500 meters along highways. Flight departures and train schedules impacted. Vulnerable populations face severe respiratory risks.';
    soilMoisture = 42;
    waveHeight = isCoastal ? 0.9 : 0.2;
    seaState = 'Slight';
  } else if (scenario === 'heatwave') {
    temp = 41;
    feelsLike = 44;
    condition = 'Intense Sunlight & Heatwave';
    rainProb = 0;
    rainMm = 0;
    windSpeed = 18;
    windDirection = 'W';
    humidity = 28;
    uvIndex = 11; // Extreme
    aqi = 165;
    visibility = 9.0;
    visibilityDesc = 'Clear Sky - Strong Glare';
    alertLevel = 'orange';
    alertTitle = 'Severe Heatwave Warning (Orange Level)';
    alertDescription = 'Maximum temperatures 4.5°C to 6.4°C above normal. High probability of heat stroke for outdoor workers, athletes, and children between 12:00 and 16:00 IST.';
    soilMoisture = 19;
    waveHeight = isCoastal ? 1.1 : 0.2;
    seaState = 'Calm';
  } else {
    // Green normal routine
    alertLevel = 'green';
    alertTitle = 'Routine Meteorological Advisory (Green Level)';
    alertDescription = 'IMD GREEN ADVISORY: Atmospheric conditions stable. Regular outdoor activities, commuting, and agriculture operations can proceed routinely.';
  }

  // Generate 12-hour hourly forecast
  const currentHour = 10;
  const hourly = Array.from({ length: 12 }, (_, i) => {
    const hour = (currentHour + i) % 24;
    const hourStr = `${hour.toString().padStart(2, '0')}:00`;
    const tempDelta = Math.sin((i / 12) * Math.PI) * 4;
    const isRed = scenario === 'red_warning';
    const isOrange = scenario === 'orange_alert' || scenario === 'cyclone_alert';
    const hRainProb = isRed ? 100 : isOrange ? Math.min(100, 85 + i * 2) : Math.max(5, rainProb + (i % 3) * 5 - 5);
    return {
      time: i === 0 ? 'Now' : hourStr,
      temp: Math.round(temp + tempDelta),
      feelsLike: Math.round(feelsLike + tempDelta),
      pop: hRainProb,
      rainMm: isRed ? +(12.5 + Math.sin(i) * 3).toFixed(1) : isOrange ? +(4.5 + Math.sin(i) * 2).toFixed(1) : +(rainMm * 0.1).toFixed(1),
      windSpeed: Math.round(windSpeed + Math.sin(i) * 3),
      humidity: Math.min(98, Math.max(20, humidity + (i % 2 === 0 ? 3 : -3))),
      uvIndex: hour >= 11 && hour <= 15 ? uvIndex : Math.max(0, uvIndex - 4),
      condition,
      conditionCode: 'cloudy',
    };
  });

  // 7-day outlook
  const days = ['Today', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const daily = days.map((day, i) => {
    const isRed = scenario === 'red_warning';
    const isOrange = scenario === 'orange_alert' || scenario === 'cyclone_alert';
    const rainP = isRed ? Math.max(70, 100 - i * 5) : isOrange ? Math.max(40, 95 - i * 12) : Math.max(10, (rainProb + i * 5) % 80);
    const dayAlertLevel: AlertColor = (isRed && i <= 2) ? 'red' : rainP > 70 ? 'orange' : rainP > 40 ? 'yellow' : 'green';
    return {
      day,
      date: `Sep ${21 + i}`,
      maxTemp: Math.round(temp + (i % 2 === 0 ? 1 : -1)),
      minTemp: Math.round(temp - (isHimalayan ? 8 : 6)),
      rainProb: rainP,
      rainMm: isRed ? Math.max(25, 120 - i * 18) : isOrange ? Math.max(5, 50 - i * 8) : +(rainP * 0.15).toFixed(1),
      condition: rainP > 75 ? 'Torrential Downpours' : rainP > 50 ? 'Heavy Showers' : rainP > 30 ? 'Scattered Rain' : 'Sunny Spells',
      conditionCode: rainP > 60 ? 'rain' : 'sunny',
      alertLevel: dayAlertLevel,
    };
  });

  return {
    city,
    updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST (IMD Station Model)',
    temp,
    feelsLike,
    tempMin: Math.round(temp - 6),
    tempMax: Math.round(temp + 3),
    condition,
    conditionCode: 'imd',
    humidity,
    pressure: scenario === 'red_warning' ? 978 : scenario === 'orange_alert' ? 994 : 1010,
    windSpeed,
    windDirection,
    windGusts: windSpeed + (scenario === 'red_warning' ? 26 : (scenario === 'orange_alert' || scenario === 'cyclone_alert') ? 18 : 6),
    uvIndex,
    uvCategory: getUvCategory(uvIndex),
    aqi,
    aqiCategory: getAqiCategory(aqi),
    pm25: Math.round(aqi * 0.58),
    pm10: Math.round(aqi * 1.12),
    no2: aqi > 200 ? 54 : 22,
    so2: 14,
    pollenTrees: aqi > 200 ? 'High' : 'Moderate',
    pollenGrass: 'Moderate',
    pollenWeeds: 'Low',
    visibility,
    visibilityDesc,
    soilMoisture,
    soilTemp: temp - 3,
    rainProb,
    rainMm,
    seaState,
    waveHeight,
    waterTemp: isCoastal ? 28.6 : 24.0,
    tideNextHigh: '12:45 IST (2.1m)',
    tideNextLow: '18:50 IST (0.4m)',
    ripCurrentRisk: scenario === 'cyclone_alert' ? 'Severe' : windSpeed > 25 ? 'High' : 'Low',
    sunrise: '06:10',
    sunset: '18:22',
    goldenHourMorning: '05:40 - 06:40 IST',
    goldenHourEvening: '17:40 - 18:40 IST',
    alertLevel,
    alertTitle,
    alertDescription,
    hourly,
    daily,
    savedDestinations: getSavedDestinations(),
  };
}

function getSavedDestinations(): SavedDestination[] {
  return [
    {
      city: 'Mumbai',
      code: 'BOM',
      state: 'Maharashtra',
      temp: 29,
      condition: 'Humid & Passing Rain',
      flightStatus: 'On Time',
      statusColor: 'green',
      packingAdvice: 'Breathable linen, light umbrella, slip-resistant footwear',
    },
    {
      city: 'New Delhi',
      code: 'DEL',
      state: 'NCR',
      temp: 34,
      condition: 'Hazy Sun & Moderate PM2.5',
      flightStatus: 'Weather Delay 20m',
      statusColor: 'yellow',
      packingAdvice: 'N95 face mask, UV sunglasses, light cotton layers',
    },
    {
      city: 'Bengaluru',
      code: 'BLR',
      state: 'Karnataka',
      temp: 24,
      condition: 'Pleasant Breeze & Overcast',
      flightStatus: 'On Time',
      statusColor: 'green',
      packingAdvice: 'Light cardigan or windcheater, walking sneakers',
    },
    {
      city: 'Goa (Dabolim / Mopa)',
      code: 'GOI',
      state: 'Goa',
      temp: 28,
      condition: 'Coastal Showers & High Swell',
      flightStatus: 'Severe Crosswind Alert',
      statusColor: 'orange',
      packingAdvice: 'Waterproof dry-bag, quick-dry shorts, rain poncho',
    },
    {
      city: 'Shimla',
      code: 'SLV',
      state: 'Himachal Pradesh',
      temp: 16,
      condition: 'Crisp Mountain Breeze',
      flightStatus: 'On Time',
      statusColor: 'green',
      packingAdvice: 'Fleece jacket, thermal inner, warm socks',
    },
  ];
}

function getWeatherCodeDescription(code: number): string {
  switch (code) {
    case 0:
      return 'Clear Sky';
    case 1:
      return 'Mainly Clear';
    case 2:
      return 'Partly Cloudy';
    case 3:
      return 'Overcast';
    case 45:
    case 48:
      return 'Fog & Depositing Rime';
    case 51:
    case 53:
    case 55:
      return 'Drizzle / Light Showers';
    case 61:
    case 63:
    case 65:
      return 'Moderate to Heavy Rain';
    case 71:
    case 73:
    case 75:
      return 'Snowfall / Flurries';
    case 80:
    case 81:
    case 82:
      return 'Rain Showers';
    case 95:
    case 96:
    case 99:
      return 'Thunderstorm with Squalls';
    default:
      return 'Partly Cloudy';
  }
}

function getWindDirectionText(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function getAqiCategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

function getUvCategory(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}
