/**
 * WaterIO transparent water calculations.
 * Pure functions — no side effects, safe on client and server.
 */

export const ROOF_RUNOFF: Record<string, number> = {
  metal: 0.9,
  tile: 0.85,
  concrete: 0.8,
  asphalt: 0.8,
  thatch: 0.6,
  other: 0.75,
};

/** 1 mm of rain over 1 m² ≈ 1 litre. */
export function harvestableLiters(rainfallMm: number, roofAreaM2: number, efficiency: number) {
  if (!rainfallMm || !roofAreaM2 || !efficiency) return 0;
  return Math.max(0, rainfallMm * roofAreaM2 * efficiency);
}

export function supplyDurationDays(availableLiters: number, dailyConsumption: number) {
  if (!dailyConsumption || dailyConsumption <= 0) return null;
  return availableLiters / dailyConsumption;
}

export function storageUtilization(currentLiters: number, capacityLiters: number) {
  if (!capacityLiters || capacityLiters <= 0) return 0;
  return Math.min(100, (currentLiters / capacityLiters) * 100);
}

export function waterBalance(
  availableLiters: number,
  incomingLiters: number,
  dailyConsumption: number,
  days: number,
) {
  const consumption = dailyConsumption * days;
  return {
    incoming: incomingLiters,
    consumption,
    net: availableLiters + incomingLiters - consumption,
  };
}

export function recommendedStorageLiters(dailyConsumption: number, expectedHarvest: number) {
  // Cover a 21-day buffer of demand, but never less than what a forecast harvest could deliver.
  const demandBuffer = dailyConsumption * 21;
  return Math.round(Math.max(demandBuffer, expectedHarvest) / 500) * 500;
}

export type SecurityInput = {
  availableLiters: number;
  dailyConsumption: number;
  storageCapacity: number;
  forecastRainMm: number;
  harvestLiters: number;
  maxTempC: number | null;
  dryDays: number;
};

export type SecurityScore = {
  score: number;
  label: "Critical" | "At risk" | "Fair" | "Good" | "Strong";
  durationDays: number | null;
  factors: { name: string; points: number; max: number; detail: string }[];
};

/**
 * Water Security Score (0–100) — deterministic, derived from user data + real forecast.
 * Never AI-generated, never hard-coded.
 */
export function waterSecurityScore(input: SecurityInput): SecurityScore {
  const duration = supplyDurationDays(input.availableLiters, input.dailyConsumption);
  const factors: SecurityScore["factors"] = [];

  // 1. Supply duration (max 45)
  const d = duration ?? 0;
  const durationPoints = Math.round(Math.min(45, (Math.min(d, 30) / 30) * 45));
  factors.push({
    name: "Supply duration",
    points: durationPoints,
    max: 45,
    detail:
      duration === null
        ? "Daily consumption not set"
        : `${d.toFixed(1)} days of water at current consumption`,
  });

  // 2. Storage capacity vs demand (max 20)
  const daysOfStorage = input.dailyConsumption > 0 ? input.storageCapacity / input.dailyConsumption : 0;
  const storagePoints = Math.round(Math.min(20, (Math.min(daysOfStorage, 21) / 21) * 20));
  factors.push({
    name: "Storage capacity",
    points: storagePoints,
    max: 20,
    detail: `Storage covers ${daysOfStorage.toFixed(1)} days of demand`,
  });

  // 3. Incoming rainwater over the forecast window (max 20)
  const coverage = input.dailyConsumption > 0 ? input.harvestLiters / (input.dailyConsumption * 7) : 0;
  const rainPoints = Math.round(Math.min(20, coverage * 20));
  factors.push({
    name: "Forecast rainwater",
    points: rainPoints,
    max: 20,
    detail: `${Math.round(input.harvestLiters).toLocaleString()} L harvestable from ${input.forecastRainMm.toFixed(1)} mm forecast rain`,
  });

  // 4. Climate stress (max 15)
  let stress = 15;
  if (input.dryDays >= 5) stress -= 6;
  else if (input.dryDays >= 3) stress -= 3;
  if (input.maxTempC !== null && input.maxTempC >= 35) stress -= 6;
  else if (input.maxTempC !== null && input.maxTempC >= 30) stress -= 3;
  const stressPoints = Math.max(0, stress);
  factors.push({
    name: "Climate stress",
    points: stressPoints,
    max: 15,
    detail: `${input.dryDays} dry day(s) forecast${input.maxTempC !== null ? `, peak ${Math.round(input.maxTempC)}°C` : ""}`,
  });

  const score = Math.max(0, Math.min(100, durationPoints + storagePoints + rainPoints + stressPoints));
  const label: SecurityScore["label"] =
    score >= 85 ? "Strong" : score >= 70 ? "Good" : score >= 50 ? "Fair" : score >= 30 ? "At risk" : "Critical";

  return { score, label, durationDays: duration, factors };
}

export function formatLiters(value: number) {
  if (!Number.isFinite(value)) return "—";
  return `${Math.round(value).toLocaleString()} L`;
}
