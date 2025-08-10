import { prisma } from "./db";

export async function listHoldings() {
  return prisma.holding.findMany({ include: { product: true } });
}

export async function createHolding(input: {
  productName: string;
  productSet?: string | null;
  productNumber?: string | null;
  productType: "SINGLE" | "SEALED";
  condition?: string | null;
  grade?: string | null;
  quantity: number;
  costBasisTotal: number;
  acquiredAt?: Date | null;
  source?: string | null;
}) {
  let product = await prisma.product.findFirst({
    where: {
      name: input.productName,
      set: input.productSet ?? undefined,
      number: input.productNumber ?? undefined,
      type: input.productType,
    },
  });
  if (!product) {
    product = await prisma.product.create({
      data: {
        name: input.productName,
        set: input.productSet ?? undefined,
        number: input.productNumber ?? undefined,
        type: input.productType,
        sku: `${input.productName}:${input.productSet ?? ""}:${input.productNumber ?? ""}`,
      },
    });
  }
  return prisma.holding.create({
    data: {
      productId: product.id,
      condition: input.condition ?? undefined,
      grade: input.grade ?? undefined,
      quantity: input.quantity,
      costBasisTotal: Number(input.costBasisTotal),
      acquiredAt: input.acquiredAt ?? undefined,
      source: input.source ?? undefined,
    },
    include: { product: true },
  });
}

export async function updateHolding(id: string, input: {
  condition?: string | null;
  grade?: string | null;
  quantity?: number | null;
  costBasisTotal?: number | null;
  acquiredAt?: Date | null;
  source?: string | null;
}) {
  return prisma.holding.update({
    where: { id },
    data: {
      condition: input.condition ?? undefined,
      grade: input.grade ?? undefined,
      quantity: input.quantity ?? undefined,
      costBasisTotal: input.costBasisTotal != null ? Number(input.costBasisTotal) : undefined,
      acquiredAt: input.acquiredAt ?? undefined,
      source: input.source ?? undefined,
    },
    include: { product: true },
  });
}

export async function deleteHolding(id: string) {
  return prisma.holding.delete({ where: { id } });
}


