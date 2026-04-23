/*
  Warnings:

  - You are about to drop the column `isShowcInCarousel` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "isShowcInCarousel",
ADD COLUMN     "isShowInCarousel" BOOLEAN NOT NULL DEFAULT false;
