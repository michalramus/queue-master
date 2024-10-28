/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Global_Setting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User_Setting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `short_name` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category_id` on the `Client` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `id` to the `Global_Setting` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `User_Setting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_category_id_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ADD COLUMN     "short_name" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "category_id",
ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Global_Setting" DROP CONSTRAINT "Global_Setting_pkey",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Global_Setting_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User_Setting" DROP CONSTRAINT "User_Setting_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "User_Setting_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
