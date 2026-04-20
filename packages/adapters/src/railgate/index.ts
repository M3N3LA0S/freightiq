import { env } from "@freightiq/env";
import { hashString, seededFloat, seededInt } from "../mock-utils";

export interface RailGateRequest {
  originCity: string;   // e.g. "Chengdu", "Yiwu", "Zhengzhou"
  destinationCity: string; // e.g. "Hamburg", "Warsaw", "Madrid"
  containerType: "20GP" | "40GP" | "40HC";
  readyDate?: string;
}

export interface RailRate {
  operator: string;
  totalEUR: number;
  transitDays: number;
  service: string;
  routeVia: string;
  _mock?: true;
}

export interface RailGateResponse {
  rates: RailRate[];
  _mock?: true;
}

export async function getRailRates(req: RailGateRequest): Promise<RailGateResponse> {
  if (!env.RAILGATE_API_KEY) {
    console.log("[mock] railgate-adapter — set RAILGATE_API_KEY to activate live");
    return mockRailRates(req);
  }
  try {
    const res = await fetch("https://api.railgate.eu/v1/quotes", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RAILGATE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`railgate ${res.status}`);
    return await res.json() as RailGateResponse;
  } catch (e) {
    console.error("[railgate] live call failed, falling back to mock", e);
    return mockRailRates(req);
  }
}

function mockRailRates(req: RailGateRequest): RailGateResponse {
  const seed = hashString(req.originCity + req.destinationCity + req.containerType);
  const routes = [
    { via: "Kazakhstan–Russia", operator: "DB Cargo Eurasia", extra: 0 },
    { via: "Kazakhstan–Belarus", operator: "RZD Logistics", extra: 150 },
    { via: "China–Kazakhstan–Poland", operator: "UTLC ERA", extra: 80 },
  ];
  const rates: RailRate[] = routes.map((route, i) => {
    const s = seed + i * 500;
    const base = seededFloat(s, 2200, 4500);
    return {
      operator: route.operator,
      totalEUR: Math.round(base + route.extra),
      transitDays: seededInt(s, 14, 22),
      service: i === 0 ? "Express" : "Standard",
      routeVia: route.via,
      _mock: true,
    };
  });
  return { rates, _mock: true };
}
