/*
  Warnings:

  - You are about to drop the column `metaDescription` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `index` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `priceUnit` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `product_variant` table. All the data in the column will be lost.
  - Made the column `shortDescription` on table `image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "category" DROP COLUMN "metaDescription",
DROP COLUMN "metaTitle",
DROP COLUMN "position";

-- AlterTable
ALTER TABLE "image" DROP COLUMN "index",
ALTER COLUMN "shortDescription" SET NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "metaDescription",
DROP COLUMN "metaTitle",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "product_variant" DROP COLUMN "priceUnit",
DROP COLUMN "sku";

-- DropEnum
DROP TYPE "PriceUnit";

-- DropEnum
DROP TYPE "ProductType";
