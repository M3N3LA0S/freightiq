import { env } from "@freightiq/env";
import { hashString, seededFloat, seededInt } from "../mock-utils";

export interface FlightAwareRateRequest {
  originAirport: string;
  destinationAirport: string;
  weightKg: number;
  cbm?: number;
  readyDate?: string;
}

export interface AirRate {
  airline: string;
  totalEUR: number;
  transitDays: number;
  service: "EXPRESS" | "STANDARD" | "ECONOMY";
  _mock?: true;
}

export interface FlightAwareRateResponse {
  rates: AirRate[];
  _mock?: true;
}

export async function getAirRates(req: FlightAwareRateRequest): Promise<FlightAwareRateResponse> {
  if (!env.FLIGHTAWARE_API_KEY) {
    console.log("[mock] flightaware-adapter — set FLIGHTAWARE_API_KEY to activate live");
    return mockAirRates(req);
  }
  try {
    const res = await fetch(`https://aeroapi.flightaware.com/aeroapi/cargo/rates`, {
      method: "POST",
      headers: { "x-apikey": env.FLIGHTAWARE_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`flightaware ${res.status}`);
    return await res.json() as FlightAwareRateResponse;
  } catch (e) {
    console.error("[flightaware] live call failed, falling back to mock", e);
    return mockAirRates(req);
  }
}

function mockAirRates(req: FlightAwareRateRequest): FlightAwareRateResponse {
  const seed = hashString(req.originAirport + req.destinationAirport);
  const chargeable = Math.max(req.weightKg, (req.cbm ?? 0) * 167);
  return {
    rates: [
      { airline: "Lufthansa Cargo", service: "EXPRESS", totalEUR: Math.round(chargeable * seededFloat(seed, 7, 9.5)), transitDays: seededInt(seed, 2, 4), _mock: true },
      { airline: "Air France Cargo", service: "STANDARD", totalEUR: Math.round(chargeable * seededFloat(seed + 1, 4.5, 7)), transitDays: seededInt(seed + 1, 4, 7), _mock: true },
      { airline: "China Southern Cargo", service: "ECONOMY", totalEUR: Math.round(chargeable * seededFloat(seed + 2, 3, 5)), transitDays: seededInt(seed + 2, 5, 9), _mock: true },
    ],
    _mock: true,
  };
}
