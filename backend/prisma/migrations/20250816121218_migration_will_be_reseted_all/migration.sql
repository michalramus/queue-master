/*
  Warnings:

  - The `multilingual_text_key` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[multilingual_text_key]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `key` on the `Multilingual_Text` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lang` on the `Multilingual_Text` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('User', 'Admin');

-- CreateEnum
CREATE TYPE "LangCode" AS ENUM ('en', 'pl');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "multilingual_text_key",
ADD COLUMN     "multilingual_text_key" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Multilingual_Text" DROP COLUMN "key",
ADD COLUMN     "key" INTEGER NOT NULL,
DROP COLUMN "lang",
ADD COLUMN     "lang" "LangCode" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropEnum
DROP TYPE "Lang";

-- DropEnum
DROP TYPE "Role";

-- CreateIndex
CREATE UNIQUE INDEX "Category_multilingual_text_key_key" ON "Category"("multilingual_text_key");

-- CreateIndex
CREATE UNIQUE INDEX "Multilingual_Text_key_lang_module_name_key" ON "Multilingual_Text"("key", "lang", "module_name");
