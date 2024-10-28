/*
  Warnings:

  - Added the required column `last_counter_reset` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "last_counter_reset" TIMESTAMP(3) NOT NULL;
