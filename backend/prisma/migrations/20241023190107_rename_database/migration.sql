/*
  Warnings:

  - The primary key for the `User_Setting` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "User_Setting" DROP CONSTRAINT "User_Setting_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_Setting_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_Setting_id_seq";
