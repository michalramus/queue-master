/*
  Warnings:

  - You are about to drop the column `multilingual_text_key` on the `Category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Category_multilingual_text_key_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "multilingual_text_key";
