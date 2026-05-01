-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('active', 'inactive');

-- AlterTable: Add description and status
ALTER TABLE "Item"
ADD COLUMN "description" TEXT,
ADD COLUMN "status" "ItemStatus" NOT NULL DEFAULT 'active';

-- AlterTable: Add unit with temporary default for existing rows
ALTER TABLE "Item" ADD COLUMN "unit" TEXT NOT NULL DEFAULT 'cái';

-- Remove the temporary default so new rows must supply a value
ALTER TABLE "Item" ALTER COLUMN "unit" DROP DEFAULT;
