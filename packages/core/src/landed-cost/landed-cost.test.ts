import { describe, expect, it } from "vitest";
import { calculateLandedCost } from "./index";

describe("calculateLandedCost", () => {
  it("sums all cost components", async () => {
    const result = await calculateLandedCost({
      productName: "Cotton T-Shirts",
      hsCode: "61091000",
      originCountry: "CN",
      destinationCountry: "DE",
      declaredValueEUR: 5000,
      quantity: 500,
      freightCostEUR: 1200,
      originChargesEUR: 250,
      destinationChargesEUR: 350,
      incoterm: "FOB",
    });
    expect(result.totalLandedEUR).toBeGreaterThan(result.declaredValueEUR);
    expect(result.totalLandedEUR).toBeGreaterThan(0);
    expect(result.perUnitEUR).toBeCloseTo(result.totalLandedEUR / 500, 1);
  });

  it("per unit cost is total divided by quantity", async () => {
    const result = await calculateLandedCost({
      productName: "Headphones",
      hsCode: "85183000",
      originCountry: "VN",
      destinationCountry: "NL",
      declaredValueEUR: 10000,
      quantity: 200,
      freightCostEUR: 800,
      incoterm: "FOB",
    });
    expect(result.perUnitEUR).toBe(parseFloat((result.totalLandedEUR / 200).toFixed(2)));
  });
});
