/*
  Warnings:

  - You are about to drop the column `color` on the `products` table. All the data in the column will be lost.
  - Added the required column `description` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "color",
ADD COLUMN     "colors" TEXT[],
ADD COLUMN     "description" TEXT NOT NULL;
