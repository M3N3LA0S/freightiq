import Anthropic from "@anthropic-ai/sdk";
import { env } from "@freightiq/env";
import { hashString, seededFloat } from "../mock-utils";

export interface HsClassifyRequest {
  productName: string;
  productDescription?: string;
  originCountry?: string;
}

export interface HsCodeCandidate {
  code: string;
  description: string;
  confidence: number;
}

export interface HsClassifyResponse {
  primary: HsCodeCandidate;
  alternatives: HsCodeCandidate[];
  _mock?: true;
}

export async function classifyHsCode(req: HsClassifyRequest): Promise<HsClassifyResponse> {
  if (!env.ANTHROPIC_API_KEY) {
    console.log("[mock] anthropic-adapter — set ANTHROPIC_API_KEY to activate live");
    return mockClassifyHsCode(req);
  }
  try {
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Classify the following product with EU HS (Harmonized System) codes.
Product: ${req.productName}
${req.productDescription ? `Description: ${req.productDescription}` : ""}
${req.originCountry ? `Origin country: ${req.originCountry}` : ""}

Respond with JSON only, no markdown. Format:
{
  "primary": { "code": "XXXXXXXX", "description": "...", "confidence": 0.95 },
  "alternatives": [
    { "code": "XXXXXXXX", "description": "...", "confidence": 0.7 }
  ]
}

Use 8-digit HS codes. Provide 1-3 alternatives.`,
        },
      ],
    });
    const text = message.content[0]?.type === "text" ? message.content[0].text : "";
    return JSON.parse(text) as HsClassifyResponse;
  } catch (e) {
    console.error("[anthropic] live call failed, falling back to mock", e);
    return mockClassifyHsCode(req);
  }
}

// Common HS code patterns by keyword
const HS_CODE_HINTS: Record<string, HsCodeCandidate> = {
  sunglass: { code: "90041000", description: "Sunglasses", confidence: 0.95 },
  mug: { code: "69120010", description: "Ceramic mugs", confidence: 0.93 },
  "t-shirt": { code: "61091000", description: "T-shirts, cotton", confidence: 0.96 },
  tshirt: { code: "61091000", description: "T-shirts, cotton", confidence: 0.96 },
  led: { code: "94054090", description: "LED lamps", confidence: 0.9 },
  yoga: { code: "95069900", description: "Yoga mats / sports equipment", confidence: 0.88 },
  phone: { code: "85171200", description: "Mobile phones", confidence: 0.94 },
  headphone: { code: "85183000", description: "Headphones", confidence: 0.92 },
  coffee: { code: "09011100", description: "Coffee, not roasted", confidence: 0.9 },
  textile: { code: "63079098", description: "Made-up textile articles", confidence: 0.75 },
  furniture: { code: "94036000", description: "Wooden furniture", confidence: 0.85 },
  shoe: { code: "64041900", description: "Footwear with textile uppers", confidence: 0.88 },
  bag: { code: "42029200", description: "Bags, wallets of textile", confidence: 0.87 },
  toy: { code: "95030000", description: "Toys", confidence: 0.9 },
  watch: { code: "91021200", description: "Wrist-watches, electronic", confidence: 0.91 },
};

function mockClassifyHsCode(req: HsClassifyRequest): HsClassifyResponse {
  const key = req.productName.toLowerCase();
  const hint = Object.entries(HS_CODE_HINTS).find(([k]) => key.includes(k));

  const seed = hashString(req.productName + (req.productDescription ?? ""));
  const confidence = seededFloat(seed, 0.75, 0.97);

  const primary: HsCodeCandidate = hint
    ? hint[1]
    : {
        code: `${6200 + (seed % 3000)}${String(seed % 100).padStart(2, "0")}`,
        description: `${req.productName} (classified)`,
        confidence,
      };

  return {
    primary,
    alternatives: [
      {
        code: `${6300 + (seed % 2000)}${String((seed + 1) % 100).padStart(2, "0")}`,
        description: "Alternative classification",
        confidence: seededFloat(seed + 1, 0.5, 0.75),
      },
    ],
    _mock: true,
  };
}
