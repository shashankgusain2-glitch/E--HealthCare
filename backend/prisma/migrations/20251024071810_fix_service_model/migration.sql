/*
  Warnings:

  - A unique constraint covering the columns `[name,hospitalId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hospitalId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Service_name_key";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "hospitalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_hospitalId_key" ON "Service"("name", "hospitalId");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
