import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchWeather, WEATHER_CODES } from "@/lib/weather.server";
import { analyzeRisks } from "@/lib/waterio/risk";
import {
  harvestableLiters,
  recommendedStorageLiters,
  storageUtilization,
  waterSecurityScore,
} from "@/lib/waterio/calc";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

export class AiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

type Msg = { role: "system" | "user" | "assistant"; content: string };

export async function callAI(messages: Msg[], jsonMode = false): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AiError("WaterIO AI is not configured.", 500);

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      messages,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (res.status === 429) throw new AiError("WaterIO AI is busy right now. Please try again in a moment.", 429);
  if (res.status === 402) throw new AiError("WaterIO AI credits are exhausted. Please add credits to continue.", 402);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new AiError(`WaterIO AI is temporarily unavailable. ${text.slice(0, 160)}`, res.status);
  }
  const json = (await res.json()) as any;
  const content = json?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new AiError("WaterIO AI returned an empty response. Please try again.", 502);
  }
  return content;
}

export function parseJson<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new AiError("WaterIO AI returned an unreadable response.", 502);
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}

export type WaterContext = Awaited<ReturnType<typeof buildWaterContext>>;

export async function buildWaterContext(supabase: SupabaseClient, userId: string) {
  const [{ data: profile, error: pErr }, { data: water, error: wErr }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("water_profiles").select("*").eq("user_id", userId).maybeSingle(),
  ]);
  if (pErr) throw new AiError(pErr.message);
  if (wErr) throw new AiError(wErr.message);
  if (!profile?.latitude || !profile?.longitude) {
    throw new AiError("Your location is not set yet. Complete onboarding to continue.", 400);
  }
  if (!water) throw new AiError("Your water profile is not set yet. Complete onboarding to continue.", 400);

  const weather = await fetchWeather(profile.latitude, profile.longitude);
  const rain7 = weather.daily.precipitation_sum.slice(0, 7).reduce((a, b) => a + (b ?? 0), 0);
  const rain14 = weather.daily.precipitation_sum.slice(0, 14).reduce((a, b) => a + (b ?? 0), 0);
  const dryDays = weather.daily.precipitation_sum.slice(0, 7).filter((v) => (v ?? 0) < 1).length;
  const maxTemp = Math.max(...weather.daily.temperature_2m_max.slice(0, 7));

  const efficiency = Number(water.collection_efficiency) || 0.85;
  const roof = Number(water.roof_area_m2) || 0;
  const harvest7 = harvestableLiters(rain7, roof, efficiency);
  const harvest14 = harvestableLiters(rain14, roof, efficiency);

  const security = waterSecurityScore({
    availableLiters: Number(water.available_water_liters) || 0,
    dailyConsumption: Number(water.daily_consumption_liters) || 0,
    storageCapacity: Number(water.storage_capacity_liters) || 0,
    forecastRainMm: rain7,
    harvestLiters: harvest7,
    maxTempC: Number.isFinite(maxTemp) ? maxTemp : null,
    dryDays,
  });

  const risks = analyzeRisks(weather.daily);

  return {
    profile,
    water,
    weather,
    stats: {
      rain7,
      rain14,
      dryDays,
      maxTemp,
      harvest7,
      harvest14,
      efficiency,
      roof,
      storageUtilization: storageUtilization(
        Number(water.available_water_liters) || 0,
        Number(water.storage_capacity_liters) || 0,
      ),
      recommendedStorage: recommendedStorageLiters(
        Number(water.daily_consumption_liters) || 0,
        harvest14,
      ),
      condition: WEATHER_CODES[weather.current.weatherCode] ?? "Unknown",
    },
    security,
    risks,
  };
}

export function contextBlock(ctx: WaterContext) {
  return JSON.stringify(
    {
      note: "All weather values are REAL measurements/forecasts from Open-Meteo. All water values are user-entered or calculated. Never invent numbers.",
      location: {
        place: ctx.profile.location,
        country: ctx.profile.country,
        latitude: ctx.profile.latitude,
        longitude: ctx.profile.longitude,
        timezone: ctx.weather.timezone,
      },
      user_water_profile: {
        household_type: ctx.water.household_type,
        people: ctx.water.household_size,
        available_water_liters: ctx.water.available_water_liters,
        storage_capacity_liters: ctx.water.storage_capacity_liters,
        daily_consumption_liters: ctx.water.daily_consumption_liters,
        emergency_reserve_liters: ctx.water.emergency_reserve_liters,
        roof_area_m2: ctx.water.roof_area_m2,
        roof_type: ctx.water.roof_type,
        collection_efficiency: ctx.water.collection_efficiency,
        rainwater_collection: ctx.water.rainwater_collection_enabled,
      },
      goals: ctx.profile.goals,
      measured_weather_now: {
        temperature_c: ctx.weather.current.temperature,
        condition: ctx.stats.condition,
        precipitation_mm: ctx.weather.current.precipitation,
        humidity_pct: ctx.weather.current.humidity,
        observed_at: ctx.weather.fetchedAt,
      },
      forecast: {
        days: ctx.weather.daily.time.slice(0, 14),
        precipitation_mm: ctx.weather.daily.precipitation_sum.slice(0, 14),
        temp_max_c: ctx.weather.daily.temperature_2m_max.slice(0, 14),
        rain_next_7_days_mm: round(ctx.stats.rain7),
        rain_next_14_days_mm: round(ctx.stats.rain14),
        dry_days_next_7: ctx.stats.dryDays,
      },
      calculated_estimates: {
        harvestable_liters_7d: Math.round(ctx.stats.harvest7),
        harvestable_liters_14d: Math.round(ctx.stats.harvest14),
        formula: "rainfall_mm x roof_area_m2 x collection_efficiency",
        storage_utilization_pct: round(ctx.stats.storageUtilization),
        recommended_storage_liters: ctx.stats.recommendedStorage,
        water_security_score: ctx.security.score,
        supply_duration_days: ctx.security.durationDays === null ? null : round(ctx.security.durationDays),
        score_breakdown: ctx.security.factors,
      },
      waterio_risk_estimates: ctx.risks.map((r) => ({
        type: r.type,
        severity: r.severity,
        period: r.period,
        why: r.explanation,
      })),
    },
    null,
    1,
  );
}

function round(v: number) {
  return Math.round(v * 10) / 10;
}

export const PLAN_SYSTEM = `You are WaterIO AI, a water-resilience analyst for households and communities.
You receive REAL weather data (Open-Meteo) and REAL user-entered water data, plus deterministic calculations.
Rules:
- NEVER invent weather values, rainfall figures, or measurements. Only use numbers present in the provided context.
- Clearly separate measured data, calculated estimates and your recommendations.
- Use cautious language for forecasts ("expected", "forecast suggests"); never present predictions as guaranteed.
- Be practical, specific and locally realistic. Keep language simple and respectful.
Respond ONLY with JSON matching:
{
 "summary": string (2-3 sentences),
 "assessment": string (a paragraph explaining the water security score and supply duration),
 "risks": [{"title": string, "severity": "low"|"moderate"|"high"|"severe", "detail": string}],
 "recommendations": [{"action": string, "why": string, "priority": "high"|"medium"|"low"}],
 "rainwater_advice": string,
 "confidence_notes": string
}`;

export const CHAT_SYSTEM = `You are WaterIO AI, the assistant inside the WaterIO water-resilience platform.
Answer using ONLY the user's real WaterIO data and the real Open-Meteo weather context provided.
- Never fabricate weather, rainfall or measurements. If something is not in the context, say so.
- Distinguish measured data, calculated estimates, and your own recommendations.
- Forecasts are uncertain — say "expected"/"forecast suggests", never guarantee.
- For emergencies, tell the user to follow official local authorities.
Keep answers concise (under 220 words), warm and practical. Use short markdown lists where helpful.`;
