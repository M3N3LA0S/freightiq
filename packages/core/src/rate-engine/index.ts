import { getFreightosRates } from "@freightiq/adapters/freightos";
import { getSeaRates } from "@freightiq/adapters/searates";
import { getAirRates } from "@freightiq/adapters/flightaware";
import { getRailRates } from "@freightiq/adapters/railgate";
import { getRoadRates } from "@freightiq/adapters/road-rates";

export type RankStrategy = "CHEAPEST" | "FASTEST" | "BALANCED";
export type FreightMode = "SEA_FCL" | "SEA_LCL" | "AIR" | "RAIL" | "ROAD" | "MULTIMODAL";

export interface RateRequest {
  originCountry: string;
  originCity?: string;
  originPort?: string;
  originPostalCode?: string;
  destinationCountry: string;
  destinationCity?: string;
  destinationPort?: string;
  destinationPostalCode?: string;
  mode: FreightMode | "BEST";
  containerType?: "20GP" | "40GP" | "40HC";
  cbm: number;
  weightKg: number;
  readyDate?: string;
}

export interface RateOption {
  mode: FreightMode;
  carrier: string;
  totalFreightEUR: number;
  originChargesEUR: number;
  destinationChargesEUR: number;
  transitDays: number;
  validUntil: string;
  source: string;
  _mock?: true;
}

export interface RateEngineResult {
  options: RateOption[];
  rankedBy: RankStrategy;
  fetchedAt: string;
  _mock?: boolean;
}

export async function fetchRates(req: RateRequest, strategy: RankStrategy = "BALANCED"): Promise<RateEngineResult> {
  const modes = req.mode === "BEST"
    ? (["SEA_FCL", "SEA_LCL", "AIR", "RAIL", "ROAD"] as FreightMode[])
    : [req.mode];

  const promises = modes.flatMap(mode => fetchForMode(req, mode));
  const settled = await Promise.allSettled(promises);
  const options: RateOption[] = settled
    .filter((r): r is PromiseFulfilledResult<RateOption[]> => r.status === "fulfilled")
    .flatMap(r => r.value);

  const ranked = rankOptions(options, strategy);
  const anyMock = options.some(o => o._mock);

  return {
    options: ranked,
    rankedBy: strategy,
    fetchedAt: new Date().toISOString(),
    _mock: anyMock,
  };
}

async function fetchForMode(req: RateRequest, mode: FreightMode): Promise<RateOption[]> {
  const originLocode = countryToLocode(req.originCountry, req.originCity ?? req.originPort ?? "");
  const destLocode = countryToLocode(req.destinationCountry, req.destinationCity ?? req.destinationPort ?? "");
  const container = req.containerType ?? "40GP";

  if (mode === "SEA_FCL" || mode === "SEA_LCL") {
    const [freightos, searates] = await Promise.allSettled([
      getFreightosRates({ originPort: originLocode, destinationPort: destLocode, mode, containerType: container, cbm: req.cbm, weightKg: req.weightKg }),
      mode === "SEA_FCL" ? getSeaRates({ originLocode, destinationLocode: destLocode, containerType: container }) : Promise.resolve({ rates: [] }),
    ]);
    const options: RateOption[] = [];
    if (freightos.status === "fulfilled") {
      options.push(...freightos.value.rates.map(r => toRateOption(r, mode, "freightos")));
    }
    if (searates.status === "fulfilled") {
      options.push(...searates.value.rates.map(r => toRateOption(r, mode, "searates")));
    }
    return options;
  }

  if (mode === "AIR") {
    const originAirport = countryToAirport(req.originCountry);
    const destAirport = countryToAirport(req.destinationCountry);
    const res = await getAirRates({ originAirport, destinationAirport: destAirport, weightKg: req.weightKg, cbm: req.cbm });
    return res.rates.map(r => ({ mode, carrier: r.airline, totalFreightEUR: r.totalEUR, originChargesEUR: 0, destinationChargesEUR: 0, transitDays: r.transitDays, validUntil: validUntilDays(7), source: "flightaware", ...(r._mock ? { _mock: true as const } : {}) }));
  }

  if (mode === "RAIL") {
    const res = await getRailRates({ originCity: req.originCity ?? req.originCountry, destinationCity: req.destinationCity ?? req.destinationCountry, containerType: container });
    return res.rates.map(r => ({ mode, carrier: r.operator, totalFreightEUR: r.totalEUR, originChargesEUR: 0, destinationChargesEUR: 0, transitDays: r.transitDays, validUntil: validUntilDays(7), source: "railgate", ...(r._mock ? { _mock: true as const } : {}) }));
  }

  if (mode === "ROAD") {
    const res = await getRoadRates({ originCountry: req.originCountry, originPostalCode: req.originPostalCode ?? "100000", destinationCountry: req.destinationCountry, destinationPostalCode: req.destinationPostalCode ?? "10117", weightKg: req.weightKg, cbm: req.cbm });
    return res.rates.map(r => ({ mode, carrier: r.carrier, totalFreightEUR: r.totalEUR, originChargesEUR: 0, destinationChargesEUR: 0, transitDays: r.transitDays, validUntil: validUntilDays(5), source: "timocom", ...(r._mock ? { _mock: true as const } : {}) }));
  }

  return [];
}

function toRateOption(r: { carrier: string; totalEUR: number; transitDays: number; validUntil: string; _mock?: true; breakdown?: { originCharges: number; destinationCharges: number } }, mode: FreightMode, source: string): RateOption {
  return {
    mode,
    carrier: r.carrier,
    totalFreightEUR: r.totalEUR,
    originChargesEUR: r.breakdown?.originCharges ?? 0,
    destinationChargesEUR: r.breakdown?.destinationCharges ?? 0,
    transitDays: r.transitDays,
    validUntil: r.validUntil,
    source,
    ...(r._mock ? { _mock: true as const } : {}),
  };
}

function rankOptions(options: RateOption[], strategy: RankStrategy): RateOption[] {
  if (strategy === "CHEAPEST") return [...options].sort((a, b) => a.totalFreightEUR - b.totalFreightEUR);
  if (strategy === "FASTEST") return [...options].sort((a, b) => a.transitDays - b.transitDays);

  // BALANCED: normalize both dimensions and score
  if (options.length === 0) return [];
  const maxCost = Math.max(...options.map(o => o.totalFreightEUR));
  const minCost = Math.min(...options.map(o => o.totalFreightEUR));
  const maxDays = Math.max(...options.map(o => o.transitDays));
  const minDays = Math.min(...options.map(o => o.transitDays));
  const costRange = maxCost - minCost || 1;
  const daysRange = maxDays - minDays || 1;

  return [...options]
    .map(o => ({
      ...o,
      _score: ((o.totalFreightEUR - minCost) / costRange) * 0.6 + ((o.transitDays - minDays) / daysRange) * 0.4,
    }))
    .sort((a, b) => (a as typeof a & { _score: number })._score - (b as typeof b & { _score: number })._score)
    .map(({ ...o }) => {
      const { _score: _removed, ...rest } = o as typeof o & { _score: number };
      void _removed;
      return rest;
    });
}

function countryToLocode(country: string, city: string): string {
  void city;
  const portMap: Record<string, string> = {
    CN: "CNSHA", VN: "VNSGN", TR: "TRIST", IN: "INNSA",
    DE: "DEHAM", NL: "NLRTM", BE: "BEANR", FR: "FRMRS",
    GB: "GBFXT", PL: "PLGDY", IT: "ITGOA", ES: "ESVLC",
  };
  return portMap[country] ?? `${country}XXX`;
}

function countryToAirport(country: string): string {
  const airportMap: Record<string, string> = {
    CN: "PVG", VN: "SGN", TR: "IST", IN: "BOM",
    DE: "FRA", NL: "AMS", BE: "BRU", FR: "CDG",
    GB: "LHR", PL: "WAW", IT: "MXP", ES: "MAD",
  };
  return airportMap[country] ?? "FRA";
}

function validUntilDays(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().split("T")[0]!;
}
