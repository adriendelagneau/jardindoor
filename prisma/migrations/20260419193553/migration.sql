/*
  Warnings:

  - You are about to drop the column `price` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `priceUnit` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "image" ADD COLUMN     "variantId" TEXT;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "price",
DROP COLUMN "priceUnit",
DROP COLUMN "status";

-- CreateTable
CREATE TABLE "product_variant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "price" DECIMAL(16,2) NOT NULL,
    "priceUnit" "PriceUnit" NOT NULL DEFAULT 'UNIT',
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_sku_key" ON "product_variant"("sku");

-- CreateIndex
CREATE INDEX "product_variant_productId_idx" ON "product_variant"("productId");

-- CreateIndex
CREATE INDEX "image_variantId_idx" ON "image"("variantId");

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
