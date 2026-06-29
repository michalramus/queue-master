/*
  Warnings:

  - You are about to drop the column `desk` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "desk",
ADD COLUMN     "desk_id" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "default_desk_id" INTEGER;

-- CreateTable
CREATE TABLE "Desk" (
    "id" SERIAL NOT NULL,
    "desk_number" INTEGER NOT NULL,
    "desk_name" TEXT NOT NULL,

    CONSTRAINT "Desk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category_Desk" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "desk_id" INTEGER NOT NULL,

    CONSTRAINT "Category_Desk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Desk_desk_number_key" ON "Desk"("desk_number");

-- CreateIndex
CREATE UNIQUE INDEX "Desk_desk_name_key" ON "Desk"("desk_name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_Desk_category_id_desk_id_key" ON "Category_Desk"("category_id", "desk_id");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_desk_id_fkey" FOREIGN KEY ("desk_id") REFERENCES "Desk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category_Desk" ADD CONSTRAINT "Category_Desk_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category_Desk" ADD CONSTRAINT "Category_Desk_desk_id_fkey" FOREIGN KEY ("desk_id") REFERENCES "Desk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_default_desk_id_fkey" FOREIGN KEY ("default_desk_id") REFERENCES "Desk"("id") ON DELETE SET NULL ON UPDATE CASCADE;
