import { describe, expect, it } from "vitest";
import { estimateCbm } from "./index";

describe("estimateCbm", () => {
  it("uses user input dimensions when provided", async () => {
    const result = await estimateCbm({
      quantity: 10,
      unitDimensions: { lengthCm: 50, widthCm: 40, heightCm: 30 },
      unitWeightKg: 2,
    });
    expect(result.source).toBe("USER_INPUT");
    expect(result.totalCBM).toBeCloseTo(0.6, 2);
    expect(result.totalWeightKg).toBe(20);
  });

  it("falls back to DB lookup when HS code provided", async () => {
    const result = await estimateCbm({ quantity: 100, hsCode: "61091000" });
    expect(result.source).toBe("DB_LOOKUP");
    expect(result.totalCBM).toBeGreaterThan(0);
    expect(result._mock).toBe(true);
  });

  it("uses fallback for unknown inputs", async () => {
    const result = await estimateCbm({ quantity: 50 });
    expect(result.source).toBe("FALLBACK");
    expect(result.totalCBM).toBe(0.25);
  });

  it("recommends 20GP for small shipments", async () => {
    const result = await estimateCbm({
      quantity: 1,
      unitDimensions: { lengthCm: 10, widthCm: 10, heightCm: 10 },
      unitWeightKg: 1,
    });
    expect(result.containerRecommendation.type).toBe("20GP");
    expect(result.containerRecommendation.utilizationPct).toBeLessThan(85);
  });

  it("recommends 40HC for large shipments", async () => {
    const result = await estimateCbm({
      quantity: 1000,
      unitDimensions: { lengthCm: 50, widthCm: 50, heightCm: 30 },
      unitWeightKg: 5,
    });
    expect(["40GP", "40HC"]).toContain(result.containerRecommendation.type);
  });
});
