import type { DailyForecast } from "@/lib/waterio/risk";

export type WeatherPayload = {
  fetchedAt: string;
  timezone: string;
  current: {
    temperature: number;
    apparentTemperature: number | null;
    precipitation: number;
    windSpeed: number | null;
    weatherCode: number;
    humidity: number | null;
  };
  daily: DailyForecast;
  hourlyProbabilityNext24: number | null;
};

export type GeoResult = {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";
const GEOCODE = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE = "https://nominatim.openstreetmap.org/reverse";

export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherPayload> {
  const url =
    `${OPEN_METEO}?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,relative_humidity_2m` +
    `&hourly=precipitation_probability` +
    `&daily=precipitation_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min,weather_code` +
    `&forecast_days=14&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo request failed (${res.status})`);
  const json = (await res.json()) as any;

  const probs: number[] = (json.hourly?.precipitation_probability ?? []).slice(0, 24).filter((v: unknown) => typeof v === "number");

  return {
    fetchedAt: new Date().toISOString(),
    timezone: json.timezone ?? "UTC",
    current: {
      temperature: json.current?.temperature_2m ?? 0,
      apparentTemperature: json.current?.apparent_temperature ?? null,
      precipitation: json.current?.precipitation ?? 0,
      windSpeed: json.current?.wind_speed_10m ?? null,
      weatherCode: json.current?.weather_code ?? 0,
      humidity: json.current?.relative_humidity_2m ?? null,
    },
    daily: {
      time: json.daily?.time ?? [],
      precipitation_sum: json.daily?.precipitation_sum ?? [],
      precipitation_probability_max: json.daily?.precipitation_probability_max ?? [],
      temperature_2m_max: json.daily?.temperature_2m_max ?? [],
      temperature_2m_min: json.daily?.temperature_2m_min ?? [],
    },
    hourlyProbabilityNext24: probs.length ? Math.max(...probs) : null,
  };
}

export async function geocodeSearch(query: string): Promise<GeoResult[]> {
  const res = await fetch(`${GEOCODE}?name=${encodeURIComponent(query)}&count=6&language=en&format=json`);
  if (!res.ok) throw new Error(`Geocoding request failed (${res.status})`);
  const json = (await res.json()) as any;
  return (json.results ?? []).map((r: any) => ({
    name: r.name,
    country: r.country ?? "",
    admin1: r.admin1 ?? undefined,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone ?? undefined,
  }));
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoResult | null> {
  const res = await fetch(`${REVERSE}?lat=${latitude}&lon=${longitude}&format=json&zoom=10`, {
    headers: { "User-Agent": "WaterIO/1.0 (climate water resilience app)" },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as any;
  const a = json.address ?? {};
  const name = a.city ?? a.town ?? a.village ?? a.county ?? a.state ?? json.name ?? "Unknown location";
  return { name, country: a.country ?? "", latitude, longitude };
}

export const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm",
};
