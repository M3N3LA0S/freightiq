import { env } from "@freightiq/env";
import { hashString, seededFloat, seededInt } from "../mock-utils";

export interface FreightosRequest {
  originPort: string;      // IATA/UN LOCODE, e.g. "CNSHA"
  destinationPort: string; // e.g. "NLRTM"
  mode: "SEA_FCL" | "SEA_LCL" | "AIR";
  containerType?: "20GP" | "40GP" | "40HC";
  cbm?: number;
  weightKg?: number;
  readyDate?: string;
}

export interface FreightosRate {
  carrier: string;
  totalEUR: number;
  transitDays: number;
  validUntil: string;
  breakdown: {
    originCharges: number;
    oceanFreight: number;
    destinationCharges: number;
    baf: number;
    caf: number;
  };
  _mock?: true;
}

export interface FreightosResponse {
  rates: FreightosRate[];
  _mock?: true;
}

export async function getFreightosRates(req: FreightosRequest): Promise<FreightosResponse> {
  if (!env.FREIGHTOS_API_KEY) {
    console.log("[mock] freightos-adapter — set FREIGHTOS_API_KEY to activate live");
    return mockFreightosRates(req);
  }
  try {
    const res = await fetch("https://api.freightos.com/api/v1/rates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.FREIGHTOS_API_KEY}`,
      },
      body: JSON.stringify(req),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`freightos ${res.status}`);
    return await res.json() as FreightosResponse;
  } catch (e) {
    console.error("[freightos] live call failed, falling back to mock", e);
    return mockFreightosRates(req);
  }
}

const CARRIERS_SEA = ["Maersk", "MSC", "CMA CGM", "Hapag-Lloyd", "COSCO", "Evergreen"];
const CARRIERS_AIR = ["Lufthansa Cargo", "Air France Cargo", "Qatar Airways Cargo", "Emirates SkyCargo"];

function mockFreightosRates(req: FreightosRequest): FreightosResponse {
  const seed = hashString(req.originPort + req.destinationPort + req.mode);
  const numRates = seededInt(seed, 3, 6);
  const rates: FreightosRate[] = [];

  for (let i = 0; i < numRates; i++) {
    const s = seed + i * 1000;
    rates.push(buildMockRate(req, s, i));
  }
  rates.sort((a, b) => a.totalEUR - b.totalEUR);
  return { rates: rates.map(r => ({ ...r, _mock: true as const })), _mock: true };
}

function buildMockRate(req: FreightosRequest, seed: number, idx: number): FreightosRate {
  const carrierList = req.mode === "AIR" ? CARRIERS_AIR : CARRIERS_SEA;
  const carrier = carrierList[seed % carrierList.length] ?? carrierList[0]!;
  const validDays = 7;
  const validUntil = new Date(Date.now() + validDays * 86400000).toISOString().split("T")[0]!;

  void idx;

  if (req.mode === "SEA_FCL") {
    const base = seededFloat(seed, 1400, 3800);
    const originC = seededFloat(seed + 1, 150, 350);
    const destC = seededFloat(seed + 2, 200, 450);
    const baf = base * seededFloat(seed + 3, 0.08, 0.15);
    const caf = base * seededFloat(seed + 4, 0.03, 0.06);
    return {
      carrier, transitDays: seededInt(seed + 5, 22, 42), validUntil,
      breakdown: { originCharges: Math.round(originC), oceanFreight: Math.round(base), destinationCharges: Math.round(destC), baf: Math.round(baf), caf: Math.round(caf) },
      totalEUR: Math.round(originC + base + destC + baf + caf),
    };
  }
  if (req.mode === "SEA_LCL") {
    const cbm = req.cbm ?? 5;
    const ratePerCbm = seededFloat(seed, 55, 140);
    const base = cbm * ratePerCbm;
    const originC = seededFloat(seed + 1, 80, 200);
    const destC = seededFloat(seed + 2, 100, 250);
    return {
      carrier, transitDays: seededInt(seed + 5, 25, 45), validUntil,
      breakdown: { originCharges: Math.round(originC), oceanFreight: Math.round(base), destinationCharges: Math.round(destC), baf: Math.round(base * 0.1), caf: Math.round(base * 0.04) },
      totalEUR: Math.round(originC + base + destC + base * 0.14),
    };
  }
  // AIR
  const kg = req.weightKg ?? 100;
  const ratePerKg = seededFloat(seed, 3.2, 8.5);
  const base = kg * ratePerKg;
  const originC = seededFloat(seed + 1, 50, 150);
  const destC = seededFloat(seed + 2, 80, 200);
  return {
    carrier, transitDays: seededInt(seed + 5, 3, 7), validUntil,
    breakdown: { originCharges: Math.round(originC), oceanFreight: Math.round(base), destinationCharges: Math.round(destC), baf: 0, caf: 0 },
    totalEUR: Math.round(originC + base + destC),
  };
}
