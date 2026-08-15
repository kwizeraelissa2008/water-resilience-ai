import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CoordsSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const getWeather = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => CoordsSchema.parse(input))
  .handler(async ({ data }) => {
    const { fetchWeather } = await import("@/lib/weather.server");
    return fetchWeather(data.latitude, data.longitude);
  });

export const searchLocation = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ query: z.string().trim().min(2).max(80) }).parse(input))
  .handler(async ({ data }) => {
    const { geocodeSearch } = await import("@/lib/weather.server");
    return geocodeSearch(data.query);
  });

export const reverseLookup = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => CoordsSchema.parse(input))
  .handler(async ({ data }) => {
    const { reverseGeocode } = await import("@/lib/weather.server");
    return reverseGeocode(data.latitude, data.longitude);
  });
