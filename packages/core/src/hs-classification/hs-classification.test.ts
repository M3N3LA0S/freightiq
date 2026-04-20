import { describe, expect, it } from "vitest";
import { classifyProduct, clearCache } from "./index";

describe("classifyProduct", () => {
  it("returns a primary HS code", async () => {
    clearCache();
    const result = await classifyProduct({ productName: "cotton t-shirts" });
    expect(result.primary.code).toBeTruthy();
    expect(result.primary.confidence).toBeGreaterThan(0);
    expect(result.primary.confidence).toBeLessThanOrEqual(1);
  });

  it("returns alternatives", async () => {
    clearCache();
    const result = await classifyProduct({ productName: "sunglasses" });
    expect(result.alternatives.length).toBeGreaterThan(0);
  });

  it("returns _mock when no API key", async () => {
    clearCache();
    const result = await classifyProduct({ productName: "yoga mats" });
    expect(result._mock).toBe(true);
  });

  it("caches results for same input", async () => {
    clearCache();
    const r1 = await classifyProduct({ productName: "headphones" });
    const r2 = await classifyProduct({ productName: "headphones" });
    expect(r1.primary.code).toBe(r2.primary.code);
  });
});
