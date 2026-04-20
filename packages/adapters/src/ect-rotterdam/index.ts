import { env } from "@freightiq/env";
import { hashString } from "../mock-utils";

export interface EctTerminalRequest {
  containerNumber?: string;
  blNumber?: string;
}

export interface EctTerminalStatus {
  containerNumber: string;
  status: "EXPECTED" | "ON_TERMINAL" | "RELEASED" | "DISCHARGED" | "LOADED";
  location?: string;
  eta?: string;
  vesselName?: string;
  updatedAt: string;
  _mock?: true;
}

export async function getEctTerminalStatus(req: EctTerminalRequest): Promise<EctTerminalStatus | null> {
  if (!env.ECT_ROTTERDAM_API_KEY) {
    console.log("[mock] ect-rotterdam-adapter — set ECT_ROTTERDAM_API_KEY to activate live");
    return mockEctStatus(req);
  }
  try {
    const res = await fetch("https://api.ect.nl/v1/tracking", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.ECT_ROTTERDAM_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`ect-rotterdam ${res.status}`);
    return await res.json() as EctTerminalStatus;
  } catch (e) {
    console.error("[ect-rotterdam] live call failed, falling back to mock", e);
    return mockEctStatus(req);
  }
}

function mockEctStatus(req: EctTerminalRequest): EctTerminalStatus {
  const key = req.containerNumber ?? req.blNumber ?? "unknown";
  const seed = hashString(key);
  const statuses: EctTerminalStatus["status"][] = ["EXPECTED", "ON_TERMINAL", "RELEASED", "DISCHARGED", "LOADED"];
  return {
    containerNumber: req.containerNumber ?? "MOCK" + String(seed).substring(0, 7),
    status: statuses[seed % statuses.length]!,
    location: "Rotterdam — Delta Terminal",
    eta: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0]!,
    vesselName: "MSC MAYA",
    updatedAt: new Date().toISOString(),
    _mock: true,
  };
}
