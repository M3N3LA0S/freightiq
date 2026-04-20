import { env } from "@freightiq/env";
import { hashString, seededFloat, seededInt } from "../mock-utils";

export interface RoadRateRequest {
  originCountry: string;
  originPostalCode: string;
  destinationCountry: string;
  destinationPostalCode: string;
  weightKg: number;
  cbm: number;
  pallets?: number;
}

export interface RoadRate {
  carrier: string;
  service: "FTL" | "LTL" | "PARCEL";
  totalEUR: number;
  transitDays: number;
  _mock?: true;
}

export interface RoadRateResponse {
  rates: RoadRate[];
  _mock?: true;
}

export async function getRoadRates(req: RoadRateRequest): Promise<RoadRateResponse> {
  if (!env.TIMOCOM_API_KEY) {
    console.log("[mock] road-rates-adapter — set TIMOCOM_API_KEY to activate live");
    return mockRoadRates(req);
  }
  try {
    const res = await fetch("https://api.timocom.com/v1/quotes", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.TIMOCOM_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`timocom ${res.status}`);
    return await res.json() as RoadRateResponse;
  } catch (e) {
    console.error("[road-rates] live call failed, falling back to mock", e);
    return mockRoadRates(req);
  }
}

const ROAD_CARRIERS = ["DB Schenker", "DHL Freight", "Kuehne+Nagel", "DSV", "XPO Logistics"];

function mockRoadRates(req: RoadRateRequest): RoadRateResponse {
  const seed = hashString(req.originCountry + req.destinationCountry + String(req.weightKg));
  // Distance proxy: intra-EU ~500-2000km, TR-EU ~2000-3500km
  const isTurkey = req.originCountry === "TR" || req.destinationCountry === "TR";
  const baseRate = isTurkey ? seededFloat(seed, 1500, 3200) : seededFloat(seed, 400, 2200);
  const rates: RoadRate[] = [
    {
      carrier: ROAD_CARRIERS[seed % ROAD_CARRIERS.length]!,
      service: req.cbm > 15 ? "FTL" : "LTL",
      totalEUR: Math.round(baseRate),
      transitDays: seededInt(seed, isTurkey ? 4 : 1, isTurkey ? 8 : 5),
      _mock: true,
    },
    {
      carrier: ROAD_CARRIERS[(seed + 2) % ROAD_CARRIERS.length]!,
      service: "LTL",
      totalEUR: Math.round(baseRate * seededFloat(seed + 1, 0.85, 1.15)),
      transitDays: seededInt(seed + 100, isTurkey ? 5 : 2, isTurkey ? 10 : 6),
      _mock: true,
    },
  ];
  return { rates, _mock: true };
}
