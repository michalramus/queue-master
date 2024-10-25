/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Client` table. All the data in the column will be lost.
  - The primary key for the `Device` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deviceId` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `Device` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_agent` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_categoryId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "categoryId",
ADD COLUMN     "category_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Device" DROP CONSTRAINT "Device_pkey",
DROP COLUMN "deviceId",
DROP COLUMN "userAgent",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "user_agent" TEXT NOT NULL,
ADD CONSTRAINT "Device_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Global_Setting" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Global_Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Setting" (
    "id" SERIAL NOT NULL,
    "setting_name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "User_Setting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
