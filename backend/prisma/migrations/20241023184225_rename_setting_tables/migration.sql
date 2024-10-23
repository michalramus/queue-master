/*
  Warnings:

  - The primary key for the `Global_Setting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Global_Setting` table. All the data in the column will be lost.
  - You are about to drop the column `setting_name` on the `User_Setting` table. All the data in the column will be lost.
  - Added the required column `key` to the `Global_Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `User_Setting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Global_Setting" DROP CONSTRAINT "Global_Setting_pkey",
DROP COLUMN "id",
ADD COLUMN     "key" TEXT NOT NULL,
ADD CONSTRAINT "Global_Setting_pkey" PRIMARY KEY ("key");

-- AlterTable
ALTER TABLE "User_Setting" DROP COLUMN "setting_name",
ADD COLUMN     "key" TEXT NOT NULL;
