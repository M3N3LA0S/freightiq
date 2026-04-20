import { env } from "@freightiq/env";
import { hashString, seededFloat } from "../mock-utils";

export interface VesselPositionRequest {
  vesselImo?: string;
  vesselName?: string;
  mmsi?: string;
}

export interface VesselPosition {
  imo: string;
  name: string;
  lat: number;
  lng: number;
  speed: number;
  course: number;
  status: string;
  lastUpdated: string;
  eta?: string;
  destination?: string;
  _mock?: true;
}

export async function getVesselPosition(req: VesselPositionRequest): Promise<VesselPosition | null> {
  if (!env.DATALASTIC_API_KEY) {
    console.log("[mock] datalastic-adapter — set DATALASTIC_API_KEY to activate live");
    return mockVesselPosition(req);
  }
  try {
    const params = new URLSearchParams();
    if (req.vesselImo) params.set("imo", req.vesselImo);
    if (req.vesselName) params.set("name", req.vesselName);
    const res = await fetch(`https://api.datalastic.com/api/v0/vessel?${params.toString()}`, {
      headers: { "api-key": env.DATALASTIC_API_KEY },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`datalastic ${res.status}`);
    const data = await res.json() as { data: VesselPosition };
    return data.data;
  } catch (e) {
    console.error("[datalastic] live call failed, falling back to mock", e);
    return mockVesselPosition(req);
  }
}

function mockVesselPosition(req: VesselPositionRequest): VesselPosition {
  const key = req.vesselImo ?? req.vesselName ?? "unknown";
  const seed = hashString(key + new Date().toISOString().substring(0, 13));
  // Position somewhere in the North Atlantic / Indian Ocean (realistic mid-voyage)
  const lat = seededFloat(seed, -10, 55);
  const lng = seededFloat(seed + 1, -30, 120);
  return {
    imo: req.vesselImo ?? "9999999",
    name: req.vesselName ?? "MV MOCK VESSEL",
    lat: parseFloat(lat.toFixed(4)),
    lng: parseFloat(lng.toFixed(4)),
    speed: parseFloat(seededFloat(seed + 2, 10, 24).toFixed(1)),
    course: Math.round(seededFloat(seed + 3, 0, 360)),
    status: "UNDERWAY",
    lastUpdated: new Date().toISOString(),
    eta: new Date(Date.now() + 7 * 86400000).toISOString(),
    destination: "ROTTERDAM",
    _mock: true,
  };
}
