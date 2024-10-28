/*
  Warnings:

  - A unique constraint covering the columns `[short_name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `Global_Setting` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_short_name_key" ON "Category"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "Global_Setting_key_key" ON "Global_Setting"("key");
