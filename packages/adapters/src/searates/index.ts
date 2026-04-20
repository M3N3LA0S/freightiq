import { env } from "@freightiq/env";
import { hashString, seededFloat, seededInt } from "../mock-utils";

export interface SeaRatesRequest {
  originLocode: string;
  destinationLocode: string;
  containerType: "20GP" | "40GP" | "40HC";
  readyDate?: string;
}

export interface SeaRatesRate {
  carrier: string;
  totalEUR: number;
  transitDays: number;
  validUntil: string;
  _mock?: true;
}

export interface SeaRatesResponse {
  rates: SeaRatesRate[];
  _mock?: true;
}

export async function getSeaRates(req: SeaRatesRequest): Promise<SeaRatesResponse> {
  if (!env.SEARATES_API_KEY) {
    console.log("[mock] searates-adapter — set SEARATES_API_KEY to activate live");
    return mockSeaRates(req);
  }
  try {
    const params = new URLSearchParams({
      origin: req.originLocode, destination: req.destinationLocode,
      container: req.containerType, date: req.readyDate ?? new Date().toISOString().split("T")[0]!,
    });
    const res = await fetch(`https://sirius.searates.com/api/v1/rates?${params.toString()}`, {
      headers: { Authorization: `Bearer ${env.SEARATES_API_KEY}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`searates ${res.status}`);
    return await res.json() as SeaRatesResponse;
  } catch (e) {
    console.error("[searates] live call failed, falling back to mock", e);
    return mockSeaRates(req);
  }
}

function mockSeaRates(req: SeaRatesRequest): SeaRatesResponse {
  const seed = hashString(req.originLocode + req.destinationLocode + req.containerType);
  const carriers = ["Maersk Line", "MSC", "ONE", "Yang Ming", "PIL"];
  const validUntil = new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0]!;
  const rates = Array.from({ length: 4 }, (_, i) => ({
    carrier: carriers[(seed + i) % carriers.length]!,
    totalEUR: Math.round(seededFloat(seed + i * 777, 1300, 4000)),
    transitDays: seededInt(seed + i * 333, 20, 45),
    validUntil,
    _mock: true as const,
  }));
  return { rates, _mock: true };
}
