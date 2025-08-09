import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const pikachu = await prisma.product.create({
    data: { name: "Pikachu V", set: "Lost Origin", number: "TG05", type: "SINGLE" },
  });

  await prisma.holding.create({
    data: {
      productId: pikachu.id,
      condition: "PSA10",
      grade: "PSA 10",
      quantity: 1,
      costBasisTotal: 120,
      acquiredAt: new Date("2024-08-10"),
      source: "eBay",
    },
  });

  await prisma.strategy.create({
    data: {
      risk: "med",
      horizonYears: 5,
      monthlyBudget: 500,
      targetAllocJson: JSON.stringify({ sealed_modern: 40, singles_modern: 60 }),
    },
  });
}

main().finally(() => prisma.$disconnect());


