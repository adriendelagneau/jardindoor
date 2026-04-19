-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PRODUCT', 'SEED');

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'PRODUCT';
