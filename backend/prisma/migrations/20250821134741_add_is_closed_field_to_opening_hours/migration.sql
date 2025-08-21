/*
  Warnings:

  - You are about to drop the column `is_enabled` on the `Opening_Hours` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Opening_Hours" DROP COLUMN "is_enabled",
ADD COLUMN     "is_closed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "open_time" DROP NOT NULL,
ALTER COLUMN "close_time" DROP NOT NULL;
