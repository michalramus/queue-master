-- CreateTable
CREATE TABLE "Device" (
    "deviceId" SERIAL NOT NULL,
    "userAgent" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("deviceId")
);
