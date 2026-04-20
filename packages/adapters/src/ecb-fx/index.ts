export interface FxRates {
  base: "EUR";
  date: string;
  rates: Record<string, number>;
  _mock?: true;
}

let _cache: { rates: FxRates; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function getEurRates(): Promise<FxRates> {
  if (_cache && Date.now() - _cache.fetchedAt < CACHE_TTL_MS) {
    return _cache.rates;
  }
  try {
    const res = await fetch(
      "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml",
      { signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) throw new Error(`ECB FX ${res.status}`);
    const xml = await res.text();
    const rates = parseEcbXml(xml);
    _cache = { rates, fetchedAt: Date.now() };
    return rates;
  } catch (e) {
    console.error("[ecb-fx] live call failed, falling back to mock", e);
    return mockFxRates();
  }
}

export async function convertFromEur(amount: number, toCurrency: string): Promise<number> {
  const fx = await getEurRates();
  const rate = fx.rates[toCurrency] ?? 1;
  return amount * rate;
}

function parseEcbXml(xml: string): FxRates {
  const rates: Record<string, number> = {};
  const cubePattern = /currency='([A-Z]+)'\s+rate='([0-9.]+)'/g;
  let match: RegExpExecArray | null;
  while ((match = cubePattern.exec(xml)) !== null) {
    if (match[1] && match[2]) rates[match[1]] = parseFloat(match[2]);
  }
  const dateMatch = /time='(\d{4}-\d{2}-\d{2})'/.exec(xml);
  return { base: "EUR", date: dateMatch?.[1] ?? new Date().toISOString().split("T")[0]!, rates };
}

function mockFxRates(): FxRates {
  return {
    base: "EUR",
    date: new Date().toISOString().split("T")[0]!,
    rates: {
      USD: 1.085, GBP: 0.856, CNY: 7.87, JPY: 165.2, CHF: 0.965,
      SEK: 11.38, NOK: 11.71, DKK: 7.461, PLN: 4.265, CZK: 25.11,
      HUF: 388.5, RON: 4.978, BGN: 1.956, HRK: 7.534, TRY: 34.8,
      INR: 90.5, VND: 27150, KRW: 1452,
    },
    _mock: true,
  };
}
