/*
  Warnings:

  - Made the column `altText` on table `image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shortDescription` on table `image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `metaTitle` on table `image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `metaDescription` on table `image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "image" ALTER COLUMN "altText" SET NOT NULL,
ALTER COLUMN "shortDescription" SET NOT NULL,
ALTER COLUMN "metaTitle" SET NOT NULL,
ALTER COLUMN "metaDescription" SET NOT NULL;
