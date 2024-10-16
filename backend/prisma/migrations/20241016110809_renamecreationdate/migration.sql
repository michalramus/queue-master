/*
  Warnings:

  - You are about to drop the column `creationDate` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "creationDate",
ADD COLUMN     "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
