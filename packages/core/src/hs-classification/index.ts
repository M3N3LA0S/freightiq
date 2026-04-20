import { classifyHsCode } from "@freightiq/adapters/anthropic";
import type { HsClassifyRequest, HsClassifyResponse } from "@freightiq/adapters/anthropic";

const _cache = new Map<string, { result: HsClassifyResponse; expiresAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export type { HsClassifyRequest, HsClassifyResponse };

export async function classifyProduct(req: HsClassifyRequest): Promise<HsClassifyResponse> {
  const cacheKey = `${req.productName}|${req.productDescription ?? ""}|${req.originCountry ?? ""}`;
  const cached = _cache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) return cached.result;

  const result = await classifyHsCode(req);
  _cache.set(cacheKey, { result, expiresAt: Date.now() + CACHE_TTL_MS });
  return result;
}

export function clearCache(): void {
  _cache.clear();
}
