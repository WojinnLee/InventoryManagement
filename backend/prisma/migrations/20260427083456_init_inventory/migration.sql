-- CreateEnum
CREATE TYPE "StockLogType" AS ENUM ('IMPORT', 'EXPORT');

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockLog" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "type" "StockLogType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_sku_key" ON "Item"("sku");

-- CreateIndex
CREATE INDEX "StockLog_itemId_idx" ON "StockLog"("itemId");

-- AddForeignKey
ALTER TABLE "StockLog" ADD CONSTRAINT "StockLog_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
