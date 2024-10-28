/*
  Warnings:

  - Changed the type of `short_name` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category_Short_Name" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "short_name",
ADD COLUMN     "short_name" "Category_Short_Name" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_short_name_key" ON "Category"("short_name");
