/*
  Warnings:

  - You are about to drop the column `theme` on the `WishlistItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'cupcake';

-- AlterTable
ALTER TABLE "public"."WishlistItem" DROP COLUMN "theme";
