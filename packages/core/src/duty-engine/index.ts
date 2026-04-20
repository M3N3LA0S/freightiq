import { lookupTaricDuty } from "@freightiq/adapters/eu-taric";

export interface DutyInput {
  hsCode: string;
  originCountry: string;
  destinationCountry: string;
  declaredValueEUR: number;
  freightCostEUR: number;
  insuranceEUR?: number;
  incoterm: string;
}

export interface DutyResult {
  hsCode: string;
  dutyRate: number;
  dutyAmountEUR: number;
  vatRate: number;
  vatAmountEUR: number;
  customsValueEUR: number;
  totalDutyAndVatEUR: number;
  preferentialRateApplied: boolean;
  _mock?: true;
}

export async function calculateDuty(input: DutyInput): Promise<DutyResult> {
  const taric = await lookupTaricDuty({
    hsCode: input.hsCode,
    originCountry: input.originCountry,
    destinationCountry: input.destinationCountry,
  });

  // CIF value = declared value + freight + insurance (EU customs uses CIF as customs value)
  const insurance = input.insuranceEUR ?? input.declaredValueEUR * 0.005;
  const cifValue = input.incoterm === "CIF" || input.incoterm === "DDP"
    ? input.declaredValueEUR
    : input.declaredValueEUR + input.freightCostEUR + insurance;

  // Check preferential rate
  const preferential = taric.preferentialRates.find(p => p.country === input.originCountry);
  const effectiveDutyRate = preferential ? preferential.rate : taric.thirdCountryDutyRate;
  const preferentialRateApplied = preferential !== undefined;

  const dutyAmountEUR = parseFloat((cifValue * (effectiveDutyRate / 100)).toFixed(2));
  const vatBase = cifValue + dutyAmountEUR;
  const vatAmountEUR = parseFloat((vatBase * (taric.vatRate / 100)).toFixed(2));

  return {
    hsCode: input.hsCode,
    dutyRate: effectiveDutyRate,
    dutyAmountEUR,
    vatRate: taric.vatRate,
    vatAmountEUR,
    customsValueEUR: parseFloat(cifValue.toFixed(2)),
    totalDutyAndVatEUR: parseFloat((dutyAmountEUR + vatAmountEUR).toFixed(2)),
    preferentialRateApplied,
    ...(taric._mock ? { _mock: true as const } : {}),
  };
}
