-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Waiting', 'InService');

-- CreateTable
CREATE TABLE "Client" (
    "number" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "seat" INTEGER,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
