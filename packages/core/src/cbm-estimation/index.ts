import { classifyHsCode } from "@freightiq/adapters/anthropic";

export interface Dimensions {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export interface CbmInput {
  quantity: number;
  unitDimensions?: Dimensions;
  unitWeightKg?: number;
  hsCode?: string;
  productKeyword?: string;
}

export interface CbmResult {
  totalCBM: number;
  totalWeightKg: number;
  containerRecommendation: ContainerRecommendation;
  source: "USER_INPUT" | "DB_LOOKUP" | "AI_INFERENCE" | "FALLBACK";
  _mock?: boolean;
}

export interface ContainerRecommendation {
  type: "20GP" | "40GP" | "40HC";
  utilizationPct: number;
}

// Container capacities in CBM
const CONTAINER_CAPACITY: Record<ContainerRecommendation["type"], number> = {
  "20GP": 25,
  "40GP": 55,
  "40HC": 67,
};

// Fallback dimensions for common HS chapters (CBM per unit, weight per unit kg)
const CHAPTER_FALLBACKS: Record<string, { cbmPerUnit: number; kgPerUnit: number }> = {
  "61": { cbmPerUnit: 0.002, kgPerUnit: 0.4 }, // Clothing
  "62": { cbmPerUnit: 0.002, kgPerUnit: 0.4 },
  "64": { cbmPerUnit: 0.003, kgPerUnit: 0.6 }, // Footwear
  "84": { cbmPerUnit: 0.015, kgPerUnit: 5 },   // Machinery
  "85": { cbmPerUnit: 0.003, kgPerUnit: 0.8 }, // Electronics
  "90": { cbmPerUnit: 0.001, kgPerUnit: 0.3 }, // Optical
  "94": { cbmPerUnit: 0.05, kgPerUnit: 10 },   // Furniture
  "95": { cbmPerUnit: 0.005, kgPerUnit: 0.5 }, // Toys
};

export async function estimateCbm(input: CbmInput): Promise<CbmResult> {
  // Tier 1: user provided dimensions
  if (input.unitDimensions && input.unitWeightKg) {
    const { lengthCm, widthCm, heightCm } = input.unitDimensions;
    const unitCbm = (lengthCm / 100) * (widthCm / 100) * (heightCm / 100);
    const totalCBM = parseFloat((unitCbm * input.quantity).toFixed(4));
    const totalWeightKg = input.unitWeightKg * input.quantity;
    return {
      totalCBM,
      totalWeightKg,
      containerRecommendation: recommendContainer(totalCBM),
      source: "USER_INPUT",
    };
  }

  // Tier 2: DB/static lookup by HS chapter
  const chapter = input.hsCode?.substring(0, 2);
  if (chapter && CHAPTER_FALLBACKS[chapter]) {
    const { cbmPerUnit, kgPerUnit } = CHAPTER_FALLBACKS[chapter]!;
    const totalCBM = parseFloat((cbmPerUnit * input.quantity).toFixed(4));
    const totalWeightKg = kgPerUnit * input.quantity;
    return {
      totalCBM,
      totalWeightKg,
      containerRecommendation: recommendContainer(totalCBM),
      source: "DB_LOOKUP",
      _mock: true,
    };
  }

  // Tier 3: AI inference via keyword
  if (input.productKeyword) {
    try {
      const classification = await classifyHsCode({ productName: input.productKeyword });
      const inferredChapter = classification.primary.code.substring(0, 2);
      const fallback = CHAPTER_FALLBACKS[inferredChapter] ?? { cbmPerUnit: 0.005, kgPerUnit: 1 };
      const totalCBM = parseFloat((fallback.cbmPerUnit * input.quantity).toFixed(4));
      const totalWeightKg = fallback.kgPerUnit * input.quantity;
      return {
        totalCBM,
        totalWeightKg,
        containerRecommendation: recommendContainer(totalCBM),
        source: "AI_INFERENCE",
        ...(classification._mock ? { _mock: true as const } : {}),
      };
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback: generic average
  const totalCBM = parseFloat((0.005 * input.quantity).toFixed(4));
  const totalWeightKg = 1 * input.quantity;
  return {
    totalCBM,
    totalWeightKg,
    containerRecommendation: recommendContainer(totalCBM),
    source: "FALLBACK",
    _mock: true,
  };
}

function recommendContainer(totalCBM: number): ContainerRecommendation {
  for (const [type, capacity] of Object.entries(CONTAINER_CAPACITY) as [ContainerRecommendation["type"], number][]) {
    const utilizationPct = (totalCBM / capacity) * 100;
    if (utilizationPct <= 85) {
      return { type, utilizationPct: parseFloat(utilizationPct.toFixed(1)) };
    }
  }
  return { type: "40HC", utilizationPct: parseFloat(((totalCBM / 67) * 100).toFixed(1)) };
}
