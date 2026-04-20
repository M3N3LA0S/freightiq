import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCT_DIMENSIONS = [
  { hsCode: "61091000", productKeyword: "t-shirt", unitWeightKg: 0.25, unitLengthCm: 35, unitWidthCm: 25, unitHeightCm: 2, unitsPerCarton: 50, cartonCBM: 0.088, source: "industry" },
  { hsCode: "90041000", productKeyword: "sunglasses", unitWeightKg: 0.05, unitLengthCm: 18, unitWidthCm: 8, unitHeightCm: 5, unitsPerCarton: 100, cartonCBM: 0.072, source: "industry" },
  { hsCode: "69120010", productKeyword: "coffee mug", unitWeightKg: 0.35, unitLengthCm: 12, unitWidthCm: 10, unitHeightCm: 10, unitsPerCarton: 36, cartonCBM: 0.043, source: "industry" },
  { hsCode: "94054090", productKeyword: "led strip", unitWeightKg: 0.12, unitLengthCm: 60, unitWidthCm: 5, unitHeightCm: 3, unitsPerCarton: 50, cartonCBM: 0.045, source: "industry" },
  { hsCode: "95069900", productKeyword: "yoga mat", unitWeightKg: 1.2, unitLengthCm: 185, unitWidthCm: 62, unitHeightCm: 1, unitsPerCarton: 10, cartonCBM: 0.115, source: "industry" },
  { hsCode: "85183000", productKeyword: "headphones", unitWeightKg: 0.28, unitLengthCm: 22, unitWidthCm: 20, unitHeightCm: 10, unitsPerCarton: 20, cartonCBM: 0.088, source: "industry" },
  { hsCode: "42029200", productKeyword: "phone case", unitWeightKg: 0.05, unitLengthCm: 17, unitWidthCm: 9, unitHeightCm: 1, unitsPerCarton: 200, cartonCBM: 0.031, source: "industry" },
  { hsCode: "94036000", productKeyword: "wooden chair", unitWeightKg: 6.5, unitLengthCm: 55, unitWidthCm: 55, unitHeightCm: 90, unitsPerCarton: 1, cartonCBM: 0.272, source: "industry" },
  { hsCode: "61034200", productKeyword: "cotton trousers", unitWeightKg: 0.45, unitLengthCm: 38, unitWidthCm: 30, unitHeightCm: 3, unitsPerCarton: 30, cartonCBM: 0.103, source: "industry" },
  { hsCode: "64041900", productKeyword: "sneakers", unitWeightKg: 0.8, unitLengthCm: 33, unitWidthCm: 22, unitHeightCm: 13, unitsPerCarton: 12, cartonCBM: 0.113, source: "industry" },
  { hsCode: "85176200", productKeyword: "wifi router", unitWeightKg: 0.45, unitLengthCm: 25, unitWidthCm: 18, unitHeightCm: 5, unitsPerCarton: 20, cartonCBM: 0.045, source: "industry" },
  { hsCode: "95030010", productKeyword: "lego set", unitWeightKg: 0.9, unitLengthCm: 40, unitWidthCm: 30, unitHeightCm: 8, unitsPerCarton: 6, cartonCBM: 0.058, source: "industry" },
  { hsCode: "85285100", productKeyword: "monitor", unitWeightKg: 4.2, unitLengthCm: 65, unitWidthCm: 45, unitHeightCm: 15, unitsPerCarton: 1, cartonCBM: 0.044, source: "industry" },
  { hsCode: "91021200", productKeyword: "wristwatch", unitWeightKg: 0.12, unitLengthCm: 12, unitWidthCm: 10, unitHeightCm: 6, unitsPerCarton: 50, cartonCBM: 0.036, source: "industry" },
  { hsCode: "84713000", productKeyword: "laptop", unitWeightKg: 1.8, unitLengthCm: 38, unitWidthCm: 28, unitHeightCm: 3, unitsPerCarton: 5, cartonCBM: 0.016, source: "industry" },
  { hsCode: "94051090", productKeyword: "floor lamp", unitWeightKg: 3.5, unitLengthCm: 30, unitWidthCm: 30, unitHeightCm: 165, unitsPerCarton: 1, cartonCBM: 0.149, source: "industry" },
  { hsCode: "73211100", productKeyword: "cookware set", unitWeightKg: 4.0, unitLengthCm: 45, unitWidthCm: 35, unitHeightCm: 30, unitsPerCarton: 4, cartonCBM: 0.189, source: "industry" },
  { hsCode: "85098000", productKeyword: "electric kettle", unitWeightKg: 1.2, unitLengthCm: 25, unitWidthCm: 22, unitHeightCm: 30, unitsPerCarton: 6, cartonCBM: 0.099, source: "industry" },
  { hsCode: "62034200", productKeyword: "denim jeans", unitWeightKg: 0.65, unitLengthCm: 38, unitWidthCm: 32, unitHeightCm: 3, unitsPerCarton: 24, cartonCBM: 0.088, source: "industry" },
  { hsCode: "96032100", productKeyword: "toothbrush", unitWeightKg: 0.03, unitLengthCm: 20, unitWidthCm: 3, unitHeightCm: 2, unitsPerCarton: 500, cartonCBM: 0.06, source: "industry" },
  { hsCode: "84151090", productKeyword: "air conditioner", unitWeightKg: 28, unitLengthCm: 110, unitWidthCm: 40, unitHeightCm: 30, unitsPerCarton: 1, cartonCBM: 0.132, source: "industry" },
  { hsCode: "85051100", productKeyword: "phone charger", unitWeightKg: 0.08, unitLengthCm: 8, unitWidthCm: 5, unitHeightCm: 3, unitsPerCarton: 200, cartonCBM: 0.024, source: "industry" },
  { hsCode: "94016900", productKeyword: "office chair", unitWeightKg: 15, unitLengthCm: 70, unitWidthCm: 70, unitHeightCm: 110, unitsPerCarton: 1, cartonCBM: 0.539, source: "industry" },
  { hsCode: "39241000", productKeyword: "plastic container", unitWeightKg: 0.15, unitLengthCm: 25, unitWidthCm: 20, unitHeightCm: 15, unitsPerCarton: 48, cartonCBM: 0.36, source: "industry" },
  { hsCode: "63022100", productKeyword: "bed linen set", unitWeightKg: 1.5, unitLengthCm: 40, unitWidthCm: 35, unitHeightCm: 8, unitsPerCarton: 10, cartonCBM: 0.112, source: "industry" },
  { hsCode: "85261000", productKeyword: "radar detector", unitWeightKg: 0.3, unitLengthCm: 15, unitWidthCm: 10, unitHeightCm: 5, unitsPerCarton: 50, cartonCBM: 0.0375, source: "industry" },
  { hsCode: "87141000", productKeyword: "bicycle helmet", unitWeightKg: 0.35, unitLengthCm: 32, unitWidthCm: 28, unitHeightCm: 22, unitsPerCarton: 12, cartonCBM: 0.237, source: "industry" },
  { hsCode: "84743100", productKeyword: "cement mixer", unitWeightKg: 85, unitLengthCm: 100, unitWidthCm: 75, unitHeightCm: 90, unitsPerCarton: 1, cartonCBM: 0.675, source: "industry" },
  { hsCode: "90183900", productKeyword: "blood pressure monitor", unitWeightKg: 0.45, unitLengthCm: 22, unitWidthCm: 18, unitHeightCm: 10, unitsPerCarton: 20, cartonCBM: 0.0792, source: "industry" },
  { hsCode: "85271300", productKeyword: "bluetooth speaker", unitWeightKg: 0.55, unitLengthCm: 20, unitWidthCm: 10, unitHeightCm: 10, unitsPerCarton: 24, cartonCBM: 0.048, source: "industry" },
  { hsCode: "68022300", productKeyword: "granite tile", unitWeightKg: 22, unitLengthCm: 60, unitWidthCm: 60, unitHeightCm: 2, unitsPerCarton: 4, cartonCBM: 0.029, source: "industry" },
  { hsCode: "85165000", productKeyword: "microwave oven", unitWeightKg: 13, unitLengthCm: 60, unitWidthCm: 45, unitHeightCm: 35, unitsPerCarton: 1, cartonCBM: 0.0945, source: "industry" },
  { hsCode: "62114200", productKeyword: "women swimwear", unitWeightKg: 0.15, unitLengthCm: 30, unitWidthCm: 20, unitHeightCm: 2, unitsPerCarton: 100, cartonCBM: 0.012, source: "industry" },
  { hsCode: "44111310", productKeyword: "mdf board", unitWeightKg: 18, unitLengthCm: 244, unitWidthCm: 122, unitHeightCm: 1.5, unitsPerCarton: 1, cartonCBM: 0.447, source: "industry" },
  { hsCode: "85162000", productKeyword: "hair dryer", unitWeightKg: 0.6, unitLengthCm: 28, unitWidthCm: 12, unitHeightCm: 10, unitsPerCarton: 24, cartonCBM: 0.081, source: "industry" },
  { hsCode: "95021000", productKeyword: "action figure", unitWeightKg: 0.12, unitLengthCm: 20, unitWidthCm: 12, unitHeightCm: 8, unitsPerCarton: 48, cartonCBM: 0.092, source: "industry" },
  { hsCode: "87120030", productKeyword: "bicycle", unitWeightKg: 12, unitLengthCm: 180, unitWidthCm: 80, unitHeightCm: 100, unitsPerCarton: 1, cartonCBM: 1.44, source: "industry" },
  { hsCode: "94049000", productKeyword: "pillow", unitWeightKg: 0.5, unitLengthCm: 65, unitWidthCm: 45, unitHeightCm: 15, unitsPerCarton: 10, cartonCBM: 0.439, source: "industry" },
  { hsCode: "39269097", productKeyword: "plastic hanger", unitWeightKg: 0.04, unitLengthCm: 45, unitWidthCm: 1, unitHeightCm: 24, unitsPerCarton: 200, cartonCBM: 0.216, source: "industry" },
  { hsCode: "84212300", productKeyword: "oil filter", unitWeightKg: 0.35, unitLengthCm: 10, unitWidthCm: 10, unitHeightCm: 15, unitsPerCarton: 50, cartonCBM: 0.075, source: "industry" },
  { hsCode: "85234910", productKeyword: "usb flash drive", unitWeightKg: 0.02, unitLengthCm: 7, unitWidthCm: 3, unitHeightCm: 1, unitsPerCarton: 500, cartonCBM: 0.0105, source: "industry" },
  { hsCode: "63049200", productKeyword: "curtain", unitWeightKg: 0.8, unitLengthCm: 45, unitWidthCm: 30, unitHeightCm: 10, unitsPerCarton: 20, cartonCBM: 0.27, source: "industry" },
  { hsCode: "84143010", productKeyword: "compressor", unitWeightKg: 25, unitLengthCm: 70, unitWidthCm: 50, unitHeightCm: 65, unitsPerCarton: 1, cartonCBM: 0.2275, source: "industry" },
  { hsCode: "85299020", productKeyword: "tv remote", unitWeightKg: 0.08, unitLengthCm: 20, unitWidthCm: 5, unitHeightCm: 2, unitsPerCarton: 200, cartonCBM: 0.04, source: "industry" },
  { hsCode: "85044090", productKeyword: "power bank", unitWeightKg: 0.25, unitLengthCm: 16, unitWidthCm: 8, unitHeightCm: 2, unitsPerCarton: 100, cartonCBM: 0.0256, source: "industry" },
  { hsCode: "96034000", productKeyword: "paint brush set", unitWeightKg: 0.15, unitLengthCm: 30, unitWidthCm: 15, unitHeightCm: 3, unitsPerCarton: 100, cartonCBM: 0.135, source: "industry" },
  { hsCode: "85171100", productKeyword: "cordless phone", unitWeightKg: 0.38, unitLengthCm: 18, unitWidthCm: 8, unitHeightCm: 5, unitsPerCarton: 30, cartonCBM: 0.0216, source: "industry" },
  { hsCode: "61102000", productKeyword: "cotton hoodie", unitWeightKg: 0.65, unitLengthCm: 40, unitWidthCm: 32, unitHeightCm: 4, unitsPerCarton: 20, cartonCBM: 0.1024, source: "industry" },
  { hsCode: "73211200", productKeyword: "bbq grill", unitWeightKg: 8, unitLengthCm: 80, unitWidthCm: 55, unitHeightCm: 40, unitsPerCarton: 1, cartonCBM: 0.176, source: "industry" },
  { hsCode: "90318090", productKeyword: "digital scale", unitWeightKg: 0.6, unitLengthCm: 30, unitWidthCm: 22, unitHeightCm: 5, unitsPerCarton: 20, cartonCBM: 0.066, source: "industry" },
];

async function main() {
  console.log("Seeding ProductDimension table...");
  for (const product of PRODUCT_DIMENSIONS) {
    await prisma.productDimension.upsert({
      where: { hsCode_productKeyword: { hsCode: product.hsCode, productKeyword: product.productKeyword } },
      update: product,
      create: product,
    });
  }
  console.log(`Seeded ${PRODUCT_DIMENSIONS.length} product dimensions.`);
}

main()
  .catch(console.error)
  .finally(() => void prisma.$disconnect());
