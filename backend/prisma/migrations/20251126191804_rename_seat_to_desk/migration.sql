/*
  Warnings:

  - You are about to drop the column `seat` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "seat",
ADD COLUMN     "desk" INTEGER;
