-- DropEnum
DROP TYPE "crdb_internal_region";

-- CreateTable
CREATE TABLE "Order" (
    "id" STRING NOT NULL,
    "senderName" STRING NOT NULL,
    "senderNumber" STRING NOT NULL,
    "pickupLocation" STRING NOT NULL,
    "receiverName" STRING NOT NULL,
    "receiverNumber" STRING NOT NULL,
    "destination" STRING NOT NULL,
    "packageDesc" STRING NOT NULL,
    "status" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
