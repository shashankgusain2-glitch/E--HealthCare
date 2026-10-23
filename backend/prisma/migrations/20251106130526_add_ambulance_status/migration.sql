-- CreateEnum
CREATE TYPE "AmbulanceStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Ambulance" ADD COLUMN     "status" "AmbulanceStatus" NOT NULL DEFAULT 'PENDING_REVIEW';
