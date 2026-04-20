import { describe, expect, it } from "vitest";
import { fetchRates } from "./index";

const BASE_REQ = {
  originCountry: "CN",
  destinationCountry: "DE",
  cbm: 10,
  weightKg: 500,
} as const;

describe("fetchRates", () => {
  it("returns rates for SEA_FCL", async () => {
    const result = await fetchRates({ ...BASE_REQ, mode: "SEA_FCL" });
    expect(result.options.length).toBeGreaterThan(0);
    expect(result.options.every(o => o.mode === "SEA_FCL")).toBe(true);
  });

  it("returns rates for AIR", async () => {
    const result = await fetchRates({ ...BASE_REQ, mode: "AIR" });
    expect(result.options.length).toBeGreaterThan(0);
  });

  it("returns rates for BEST (all modes)", async () => {
    const result = await fetchRates({ ...BASE_REQ, mode: "BEST" });
    const modes = new Set(result.options.map(o => o.mode));
    expect(modes.size).toBeGreaterThan(1);
  });

  it("CHEAPEST strategy sorts by price ascending", async () => {
    const result = await fetchRates({ ...BASE_REQ, mode: "SEA_FCL" }, "CHEAPEST");
    for (let i = 1; i < result.options.length; i++) {
      expect(result.options[i]!.totalFreightEUR).toBeGreaterThanOrEqual(result.options[i - 1]!.totalFreightEUR);
    }
  });

  it("FASTEST strategy sorts by transit days ascending", async () => {
    const result = await fetchRates({ ...BASE_REQ, mode: "BEST" }, "FASTEST");
    for (let i = 1; i < result.options.length; i++) {
      expect(result.options[i]!.transitDays).toBeGreaterThanOrEqual(result.options[i - 1]!.transitDays);
    }
  });

  it("all mock rates have _mock flag", async () => {
    const result = await fetchRates({ ...BASE_REQ, mode: "BEST" });
    expect(result._mock).toBe(true);
  });
});
