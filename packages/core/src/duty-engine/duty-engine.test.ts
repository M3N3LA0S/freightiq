import { describe, expect, it } from "vitest";
import { calculateDuty } from "./index";

describe("calculateDuty", () => {
  it("calculates duty and VAT correctly", async () => {
    const result = await calculateDuty({
      hsCode: "61091000",
      originCountry: "US",
      destinationCountry: "DE",
      declaredValueEUR: 10000,
      freightCostEUR: 1500,
      incoterm: "FOB",
    });
    expect(result.dutyAmountEUR).toBeGreaterThan(0);
    expect(result.vatAmountEUR).toBeGreaterThan(0);
    expect(result.totalDutyAndVatEUR).toBe(
      parseFloat((result.dutyAmountEUR + result.vatAmountEUR).toFixed(2)),
    );
  });

  it("uses CIF value as customs base for FOB", async () => {
    const result = await calculateDuty({
      hsCode: "85171200",
      originCountry: "VN",
      destinationCountry: "NL",
      declaredValueEUR: 5000,
      freightCostEUR: 800,
      incoterm: "FOB",
    });
    expect(result.customsValueEUR).toBeGreaterThan(5000);
  });

  it("does not double-count freight for CIF incoterm", async () => {
    const result = await calculateDuty({
      hsCode: "85171200",
      originCountry: "VN",
      destinationCountry: "NL",
      declaredValueEUR: 5000,
      freightCostEUR: 800,
      incoterm: "CIF",
    });
    expect(result.customsValueEUR).toBe(5000);
  });

  it("returns mock flag", async () => {
    const result = await calculateDuty({
      hsCode: "94036000",
      originCountry: "TR",
      destinationCountry: "FR",
      declaredValueEUR: 3000,
      freightCostEUR: 500,
      incoterm: "EXW",
    });
    expect(result._mock).toBe(true);
  });
});
