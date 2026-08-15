/**
 * WaterIO Climate Risk Estimate engine.
 * Informational early-warning heuristics derived from real Open-Meteo forecast data.
 * This is NOT an official emergency warning system.
 */

export type Severity = "low" | "moderate" | "high" | "severe";

export type RiskEstimate = {
  type: "flood" | "drought" | "heat" | "heavy_rain";
  title: string;
  severity: Severity;
  period: string;
  explanation: string;
  recommendations: string[];
  metrics: Record<string, number>;
};

export type DailyForecast = {
  time: string[];
  precipitation_sum: number[];
  precipitation_probability_max: (number | null)[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
};

const SEVERITY_ORDER: Severity[] = ["low", "moderate", "high", "severe"];
export function severityRank(s: Severity) {
  return SEVERITY_ORDER.indexOf(s);
}

export function analyzeRisks(daily: DailyForecast): RiskEstimate[] {
  const risks: RiskEstimate[] = [];
  const rain = daily.precipitation_sum ?? [];
  const days = daily.time ?? [];
  const next2 = rain.slice(0, 2).reduce((a, b) => a + (b ?? 0), 0);
  const next7 = rain.slice(0, 7).reduce((a, b) => a + (b ?? 0), 0);
  const maxDay = Math.max(0, ...rain.slice(0, 7).map((v) => v ?? 0));
  const maxTemp = Math.max(...daily.temperature_2m_max.slice(0, 7));
  const dryDays = rain.slice(0, 7).filter((v) => (v ?? 0) < 1).length;
  let consecutiveWet = 0;
  let maxConsecutiveWet = 0;
  for (const v of rain.slice(0, 7)) {
    if ((v ?? 0) >= 10) {
      consecutiveWet += 1;
      maxConsecutiveWet = Math.max(maxConsecutiveWet, consecutiveWet);
    } else consecutiveWet = 0;
  }

  // Flood risk
  let floodSeverity: Severity = "low";
  if (next2 >= 100 || maxDay >= 80) floodSeverity = "severe";
  else if (next2 >= 60 || maxDay >= 50 || maxConsecutiveWet >= 3) floodSeverity = "high";
  else if (next2 >= 25 || maxDay >= 20 || maxConsecutiveWet >= 2) floodSeverity = "moderate";

  risks.push({
    type: "flood",
    title: "Flood risk",
    severity: floodSeverity,
    period: "Next 48 hours",
    explanation:
      floodSeverity === "low"
        ? `Forecast rainfall over the next 48 hours is ${next2.toFixed(1)} mm, below WaterIO's flood-watch threshold.`
        : `${next2.toFixed(1)} mm of rainfall is forecast in the next 48 hours, with a peak daily total of ${maxDay.toFixed(1)} mm and ${maxConsecutiveWet} consecutive heavy-rain day(s) in the 7-day outlook.`,
    recommendations:
      floodSeverity === "low"
        ? ["Keep gutters and drainage clear", "Continue routine rainwater collection"]
        : [
            "Protect stored drinking water from contamination",
            "Check and clear drainage around your property",
            "Move critical supplies above expected water level",
            "Avoid unnecessary exposure to flood-prone areas",
            "Monitor official local emergency guidance",
          ],
    metrics: { rain_48h_mm: round(next2), peak_daily_mm: round(maxDay), consecutive_heavy_days: maxConsecutiveWet },
  });

  // Drought / water stress
  let droughtSeverity: Severity = "low";
  if (next7 < 2 && dryDays >= 7) droughtSeverity = "severe";
  else if (next7 < 5 && dryDays >= 6) droughtSeverity = "high";
  else if (next7 < 15 && dryDays >= 4) droughtSeverity = "moderate";

  risks.push({
    type: "drought",
    title: "Dry period / water stress",
    severity: droughtSeverity,
    period: "Next 7 days",
    explanation: `${next7.toFixed(1)} mm of rain is forecast over the next 7 days, with ${dryDays} day(s) below 1 mm.`,
    recommendations:
      droughtSeverity === "low"
        ? ["Maintain your normal conservation habits", "Keep your emergency reserve topped up"]
        : [
            "Reduce non-essential water use now, before supplies drop",
            "Prioritise drinking, cooking and hygiene",
            "Delay water-intensive activities such as washing vehicles",
            "Confirm your emergency reserve is full and sealed",
          ],
    metrics: { rain_7d_mm: round(next7), dry_days: dryDays },
  });

  // Extreme heat
  let heatSeverity: Severity = "low";
  if (maxTemp >= 40) heatSeverity = "severe";
  else if (maxTemp >= 35) heatSeverity = "high";
  else if (maxTemp >= 32) heatSeverity = "moderate";
  if (heatSeverity !== "low") {
    risks.push({
      type: "heat",
      title: "Extreme temperature",
      severity: heatSeverity,
      period: "Next 7 days",
      explanation: `Peak forecast temperature reaches ${maxTemp.toFixed(1)}°C, which increases evaporation losses and drinking-water demand.`,
      recommendations: [
        "Shade and cover open water storage to reduce evaporation",
        "Increase drinking water allowance per person",
        "Irrigate early morning or late evening only",
      ],
      metrics: { peak_temp_c: round(maxTemp) },
    });
  }

  return risks.sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
}

function round(v: number) {
  return Math.round(v * 10) / 10;
}

export const SEVERITY_META: Record<Severity, { label: string; dot: string; className: string }> = {
  low: { label: "Low", dot: "🟢", className: "bg-leaf/12 text-leaf border-leaf/30" },
  moderate: { label: "Moderate", dot: "🟡", className: "bg-warn/15 text-warn border-warn/40" },
  high: { label: "High", dot: "🟠", className: "bg-high/15 text-high border-high/40" },
  severe: { label: "Severe", dot: "🔴", className: "bg-destructive/12 text-destructive border-destructive/40" },
};
