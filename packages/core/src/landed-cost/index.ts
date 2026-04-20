import { calculateDuty, type DutyInput, type DutyResult } from "../duty-engine/index";

export interface LandedCostInput {
  productName: string;
  hsCode: string;
  originCountry: string;
  destinationCountry: string;
  declaredValueEUR: number;
  quantity: number;
  freightCostEUR: number;
  originChargesEUR?: number;
  destinationChargesEUR?: number;
  incoterm: string;
  insuranceRate?: number; // fraction of declared value, e.g. 0.005
}

export interface LandedCostBreakdown {
  declaredValueEUR: number;
  originChargesEUR: number;
  freightCostEUR: number;
  destinationChargesEUR: number;
  insuranceEUR: number;
  duty: DutyResult;
  totalLandedEUR: number;
  perUnitEUR: number;
  _mock?: true;
}

export async function calculateLandedCost(input: LandedCostInput): Promise<LandedCostBreakdown> {
  const insuranceEUR = parseFloat(
    (input.declaredValueEUR * (input.insuranceRate ?? 0.005)).toFixed(2),
  );
  const originChargesEUR = input.originChargesEUR ?? 0;
  const destinationChargesEUR = input.destinationChargesEUR ?? 0;

  const dutyInput: DutyInput = {
    hsCode: input.hsCode,
    originCountry: input.originCountry,
    destinationCountry: input.destinationCountry,
    declaredValueEUR: input.declaredValueEUR,
    freightCostEUR: input.freightCostEUR,
    insuranceEUR,
    incoterm: input.incoterm,
  };

  const duty = await calculateDuty(dutyInput);

  const totalLandedEUR = parseFloat(
    (
      input.declaredValueEUR +
      originChargesEUR +
      input.freightCostEUR +
      destinationChargesEUR +
      insuranceEUR +
      duty.dutyAmountEUR +
      duty.vatAmountEUR
    ).toFixed(2),
  );

  return {
    declaredValueEUR: input.declaredValueEUR,
    originChargesEUR,
    freightCostEUR: input.freightCostEUR,
    destinationChargesEUR,
    insuranceEUR,
    duty,
    totalLandedEUR,
    perUnitEUR: parseFloat((totalLandedEUR / input.quantity).toFixed(2)),
    ...(duty._mock ? { _mock: true as const } : {}),
  };
}
