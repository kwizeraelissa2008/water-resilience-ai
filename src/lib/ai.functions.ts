import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type WaterPlanResult = {
  summary: string;
  assessment: string;
  risks: { title: string; severity: string; detail: string }[];
  recommendations: { action: string; why: string; priority: string }[];
  rainwater_advice: string;
  confidence_notes: string;
};

/** Real weather + user data + deterministic calculations, no AI. Used by the dashboard. */
export const getWaterOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { buildWaterContext } = await import("@/lib/ai.server");
    const ctx = await buildWaterContext(context.supabase, context.userId);
    return {
      profile: ctx.profile,
      water: ctx.water,
      weather: ctx.weather,
      stats: ctx.stats,
      security: ctx.security,
      risks: ctx.risks,
    };
  });

/** Runs the WaterIO risk engine on live forecast data and persists new alerts. */
export const refreshRiskAlerts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { buildWaterContext } = await import("@/lib/ai.server");
    const ctx = await buildWaterContext(context.supabase, context.userId);
    const place = [ctx.profile.location, ctx.profile.country].filter(Boolean).join(", ");

    const rows = ctx.risks.map((r) => ({
      user_id: context.userId,
      location: place,
      risk_type: r.type,
      severity: r.severity,
      period: r.period,
      forecast_data: { metrics: r.metrics, fetched_at: ctx.weather.fetchedAt, source: "Open-Meteo" },
      explanation: r.explanation,
      recommendations: r.recommendations,
    }));

    const { error } = await context.supabase.from("risk_alerts").insert(rows);
    if (error) throw new Error(error.message);

    const notable = ctx.risks.filter((r) => r.severity !== "low");
    if (notable.length) {
      await context.supabase.from("notifications").insert(
        notable.map((r) => ({
          user_id: context.userId,
          kind: "risk",
          title: `${r.severity === "severe" ? "Severe" : r.severity === "high" ? "High" : "Moderate"} ${r.title.toLowerCase()} — ${place}`,
          body: r.explanation,
        })),
      );
    }

    return { risks: ctx.risks, fetchedAt: ctx.weather.fetchedAt, location: place };
  });

/** Full AI water management plan grounded in real data. */
export const generateWaterPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { buildWaterContext, contextBlock, callAI, parseJson, PLAN_SYSTEM } = await import("@/lib/ai.server");
    const ctx = await buildWaterContext(context.supabase, context.userId);

    const raw = await callAI(
      [
        { role: "system", content: PLAN_SYSTEM },
        {
          role: "user",
          content: `Create my personalised WaterIO water management plan from this real data:\n${contextBlock(ctx)}`,
        },
      ],
      true,
    );
    const plan = parseJson<WaterPlanResult>(raw);

    const { data, error } = await context.supabase
      .from("water_plans")
      .insert({
        user_id: context.userId,
        plan_data: { ai: plan, stats: ctx.stats, security: ctx.security, weather_at: ctx.weather.fetchedAt },
        ai_summary: plan.summary,
        water_security_score: ctx.security.score,
        supply_duration_days: ctx.security.durationDays,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    await context.supabase.from("notifications").insert({
      user_id: context.userId,
      kind: "plan",
      title: "New AI water plan ready",
      body: `Water security score ${ctx.security.score}/100 based on the latest forecast.`,
    });

    return { plan, record: data, stats: ctx.stats, security: ctx.security, weather: ctx.weather };
  });

const RainwaterInput = z.object({
  roofArea: z.number().min(1).max(100000),
  roofType: z.string().min(1).max(40),
  efficiency: z.number().min(0.1).max(1),
  tankCapacity: z.number().min(0).max(10000000),
  currentStored: z.number().min(0).max(10000000),
  persist: z.boolean().optional(),
});

/** Rainwater harvest plan: real forecast + user roof inputs + AI explanation. */
export const generateRainwaterPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => RainwaterInput.parse(input))
  .handler(async ({ data, context }) => {
    const { buildWaterContext, contextBlock, callAI } = await import("@/lib/ai.server");
    const { harvestableLiters, recommendedStorageLiters, storageUtilization } = await import("@/lib/waterio/calc");
    const ctx = await buildWaterContext(context.supabase, context.userId);

    const h7 = harvestableLiters(ctx.stats.rain7, data.roofArea, data.efficiency);
    const h14 = harvestableLiters(ctx.stats.rain14, data.roofArea, data.efficiency);
    const recommended = recommendedStorageLiters(Number(ctx.water.daily_consumption_liters) || 0, h14);
    const utilization = storageUtilization(data.currentStored, data.tankCapacity);

    const summary = await callAI([
      {
        role: "system",
        content:
          "You are WaterIO AI. Explain a rainwater harvesting plan using ONLY the supplied real forecast and calculated values. Never invent numbers. Use cautious forecast language. Reply in 120-180 words of plain text with 3-5 short bullet points at the end.",
      },
      {
        role: "user",
        content: `Explain my rainwater plan.\nContext: ${contextBlock(ctx)}\nThis plan's inputs and calculations: ${JSON.stringify(
          {
            roof_area_m2: data.roofArea,
            roof_type: data.roofType,
            efficiency: data.efficiency,
            tank_capacity_liters: data.tankCapacity,
            currently_stored_liters: data.currentStored,
            storage_utilization_pct: Math.round(utilization),
            expected_rain_7d_mm: Math.round(ctx.stats.rain7 * 10) / 10,
            expected_rain_14d_mm: Math.round(ctx.stats.rain14 * 10) / 10,
            harvestable_7d_liters: Math.round(h7),
            harvestable_14d_liters: Math.round(h14),
            recommended_storage_liters: recommended,
          },
        )}`,
      },
    ]);

    const result = {
      expectedRainfall7: ctx.stats.rain7,
      expectedRainfall14: ctx.stats.rain14,
      harvest7: h7,
      harvest14: h14,
      recommendedStorage: recommended,
      utilization,
      summary,
      fetchedAt: ctx.weather.fetchedAt,
      daily: ctx.weather.daily,
    };

    if (data.persist !== false) {
      const { error } = await context.supabase.from("rainwater_plans").insert({
        user_id: context.userId,
        rainfall_data: {
          days: ctx.weather.daily.time.slice(0, 14),
          precipitation_mm: ctx.weather.daily.precipitation_sum.slice(0, 14),
          source: "Open-Meteo",
          fetched_at: ctx.weather.fetchedAt,
        },
        roof_area: data.roofArea,
        efficiency: data.efficiency,
        expected_rainfall_mm: ctx.stats.rain14,
        estimated_harvest_liters: h14,
        recommended_storage_liters: recommended,
        ai_summary: summary,
      });
      if (error) throw new Error(error.message);
    }

    return result;
  });

const ChatInput = z.object({
  message: z.string().trim().min(1).max(1200),
  conversationId: z.string().uuid().nullable().optional(),
});

export const sendChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data, context }) => {
    const { buildWaterContext, contextBlock, callAI, CHAT_SYSTEM } = await import("@/lib/ai.server");
    const supabase = context.supabase;

    // Basic abuse protection: cap messages per user per hour.
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("ai_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", context.userId)
      .eq("role", "user")
      .gte("created_at", since);
    if ((count ?? 0) >= 60) {
      throw new Error("You've reached the hourly WaterIO AI limit. Please try again later.");
    }

    let conversationId = data.conversationId ?? null;
    if (!conversationId) {
      const { data: conv, error } = await supabase
        .from("ai_conversations")
        .insert({ user_id: context.userId, title: data.message.slice(0, 60) })
        .select()
        .single();
      if (error) throw new Error(error.message);
      conversationId = conv.id;
    }

    const { error: userMsgError } = await supabase
      .from("ai_messages")
      .insert({ conversation_id: conversationId, user_id: context.userId, role: "user", content: data.message });
    if (userMsgError) throw new Error(userMsgError.message);

    const { data: history } = await supabase
      .from("ai_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(30);

    const ctx = await buildWaterContext(supabase, context.userId);
    const reply = await callAI([
      { role: "system", content: CHAT_SYSTEM },
      { role: "system", content: `Current WaterIO context for this user:\n${contextBlock(ctx)}` },
      ...(history ?? []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ]);

    const { error: aiMsgError } = await supabase
      .from("ai_messages")
      .insert({ conversation_id: conversationId, user_id: context.userId, role: "assistant", content: reply });
    if (aiMsgError) throw new Error(aiMsgError.message);

    return { conversationId, reply };
  });
