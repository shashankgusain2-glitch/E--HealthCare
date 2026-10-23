/*
  Warnings:

  - Added the required column `contactNumber` to the `Ambulance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ambulance" ADD COLUMN     "contactNumber" TEXT NOT NULL;
