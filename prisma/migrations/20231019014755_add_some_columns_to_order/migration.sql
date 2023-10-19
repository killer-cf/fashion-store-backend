/*
  Warnings:

  - Added the required column `couponValue` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "couponCode" TEXT,
ADD COLUMN     "couponValue" INTEGER NOT NULL,
ADD COLUMN     "subtotal" INTEGER NOT NULL;
