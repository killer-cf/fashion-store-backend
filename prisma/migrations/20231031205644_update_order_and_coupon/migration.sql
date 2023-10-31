/*
  Warnings:

  - Added the required column `isFirstOrder` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isFreeShipping` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isSingleUse` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryFee` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coupons" ADD COLUMN     "isFirstOrder" BOOLEAN NOT NULL,
ADD COLUMN     "isFreeShipping" BOOLEAN NOT NULL,
ADD COLUMN     "isSingleUse" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "deliveryFee" INTEGER NOT NULL;
