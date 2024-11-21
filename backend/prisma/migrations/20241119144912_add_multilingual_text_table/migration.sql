/*
  Warnings:

  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number,category_id]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,key]` on the table `User_Setting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `multilingual_text_key` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('en', 'pl');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
ADD COLUMN     "multilingual_text_key" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Multilingual_Text" (
    "id" SERIAL NOT NULL,
    "module_name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "lang" "Lang" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Multilingual_Text_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Multilingual_Text_key_lang_module_name_key" ON "Multilingual_Text"("key", "lang", "module_name");

-- CreateIndex
CREATE UNIQUE INDEX "Client_number_category_id_key" ON "Client"("number", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_Setting_user_id_key_key" ON "User_Setting"("user_id", "key");
