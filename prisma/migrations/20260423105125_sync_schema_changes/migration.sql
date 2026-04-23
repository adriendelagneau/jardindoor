-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PRODUCT', 'SEED');

-- CreateEnum
CREATE TYPE "PriceUnit" AS ENUM ('UNIT', 'KG', 'L');

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "image" ADD COLUMN     "index" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "shortDescription" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'PRODUCT';

-- AlterTable
ALTER TABLE "product_variant" ADD COLUMN     "priceUnit" "PriceUnit" NOT NULL DEFAULT 'UNIT',
ADD COLUMN     "sku" TEXT;
